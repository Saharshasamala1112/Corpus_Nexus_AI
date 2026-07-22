import uuid

from app.agent.planner import AgentPlanner, get_agent_planner
from app.agent.executor import ToolExecutor, get_tool_executor
from app.agent.prompt_builder import AgentPromptBuilder, get_agent_prompt_builder
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.schemas.agent import (
    AgentRequest,
    AgentResponse,
    ReasoningStep,
    SourceReference,
)
from app.core.logging import get_logger

logger = get_logger("agent.chat.service")


class AgentChatService:
    def __init__(
        self,
        conversation_repo: ConversationRepository,
        message_repo: MessageRepository,
        planner: AgentPlanner | None = None,
        executor: ToolExecutor | None = None,
        prompt_builder: AgentPromptBuilder | None = None,
    ):
        self.conversation_repo = conversation_repo
        self.message_repo = message_repo
        self.planner = planner or get_agent_planner()
        self.executor = executor or get_tool_executor()
        self.prompt_builder = prompt_builder or get_agent_prompt_builder()

    async def process(self, request: AgentRequest) -> AgentResponse:
        conversation_id = request.conversation_id
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
            title = self._derive_title(request.message)
            await self.conversation_repo.create(
                conversation_id=conversation_id,
                title=title,
                model=request.model,
            )

        conversation = await self.conversation_repo.get_by_id(conversation_id)
        if not conversation:
            from app.core.exceptions import NotFoundException
            raise NotFoundException("Conversation", conversation_id)

        await self.message_repo.create(
            message_id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            role="user",
            content=request.message,
        )

        plan, planning_steps = await self.planner.plan(
            query=request.message,
            max_tools=request.max_tool_calls,
        )

        reasoning_steps = [s.__dict__ for s in planning_steps]

        tool_calls = await self.executor.execute_plan(plan)

        for tc in tool_calls:
            tool_step_num = len(reasoning_steps) + 1
            if tc.success:
                observation = f"Tool {tc.tool.value} returned results ({tc.execution_time_ms:.1f}ms)"
            else:
                observation = f"Tool {tc.tool.value} failed: {tc.error}"
            reasoning_steps.append({
                "step": tool_step_num,
                "thought": f"Executing {tc.tool.value}: {tc.reasoning}",
                "action": f"Executed {tc.tool.value}",
                "tool_used": tc.tool.value,
                "observation": observation,
            })

        answer, confidence, sources = await self.prompt_builder.build_response(
            query=request.message,
            tool_calls=tool_calls,
            reasoning_steps=reasoning_steps,
        )

        final_step_num = len(reasoning_steps) + 1
        reasoning_steps.append({
            "step": final_step_num,
            "thought": "Synthesized final response from all tool results",
            "action": "Response generation",
        })

        tools_used = [tc.tool for tc in tool_calls if tc.success]

        await self.message_repo.create(
            message_id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            role="assistant",
            content=answer,
        )
        await self.conversation_repo.touch(conversation_id)

        logger.info(
            "Agent chat complete: conversation=%s tools=%d confidence=%.2f",
            conversation_id, len(tools_used), confidence,
        )

        return AgentResponse(
            answer=answer,
            conversation_id=conversation_id,
            reasoning_steps=[
                ReasoningStep(**rs) if isinstance(rs, dict) else rs
                for rs in reasoning_steps
            ],
            tools_used=tools_used,
            sources=sources,
            confidence_score=confidence,
            model=request.model,
            tool_calls=tool_calls,
        )

    def _derive_title(self, message: str) -> str:
        if len(message) <= 60:
            return message
        return message[:57] + "..."
