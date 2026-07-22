from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_async_session
from app.schemas.agent import AgentRequest, AgentResponse
from app.schemas.common import HealthResponse
from app.services.agent_service import AgentChatService
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.agent.planner import AgentPlanner, get_agent_planner
from app.agent.executor import ToolExecutor, get_tool_executor
from app.agent.prompt_builder import AgentPromptBuilder, get_agent_prompt_builder
from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger("agent.api")

router = APIRouter(prefix="/agent", tags=["agent"])


async def _get_agent_service(
    session: AsyncSession = Depends(get_async_session),
) -> AgentChatService:
    return AgentChatService(
        conversation_repo=ConversationRepository(session),
        message_repo=MessageRepository(session),
        planner=get_agent_planner(),
        executor=get_tool_executor(),
        prompt_builder=get_agent_prompt_builder(),
    )


@router.get("/health", response_model=HealthResponse, summary="Agent health check")
async def health_check() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        service=f"{settings.APP_NAME} Agent",
    )


@router.post("/chat", response_model=AgentResponse, summary="Agent chat with tool reasoning")
async def agent_chat(
    request: AgentRequest,
    service: AgentChatService = Depends(_get_agent_service),
) -> AgentResponse:
    logger.info(
        "Agent chat request: conversation_id=%s model=%s max_tools=%d",
        request.conversation_id, request.model, request.max_tool_calls,
    )
    return await service.process(request)


@router.get("/tools", summary="List available agent tools")
async def list_tools():
    from app.agent import get_tool_executor
    executor = get_tool_executor()
    return {"tools": executor.get_available_tools()}
