from datetime import UTC, datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class ToolType(StrEnum):
    REPOSITORY_SEARCH = "repository_search"
    DOCUMENTATION_SEARCH = "documentation_search"
    API_EXPLORER = "api_explorer"
    DATABASE_EXPLORER = "database_explorer"
    INFRASTRUCTURE = "infrastructure"
    PROJECT_EXPLORER = "project_explorer"
    SETUP_GUIDE = "setup_guide"
    TROUBLESHOOTING = "troubleshooting"


class AgentRequest(BaseModel):
    message: str = Field(
        ..., min_length=1, max_length=10000, description="User question or instruction"
    )
    conversation_id: str | None = Field(None, description="Existing conversation ID")
    model: str = Field(default="llama3.2", description="LLM model to use")
    max_tool_calls: int = Field(
        default=5, ge=1, le=10, description="Maximum tool invocations per request"
    )


class ToolCall(BaseModel):
    tool: ToolType
    reasoning: str = Field(description="Why this tool was selected")
    parameters: dict = Field(default_factory=dict, description="Tool input parameters")
    result: dict = Field(default_factory=dict, description="Tool execution output")
    execution_time_ms: float = 0.0
    success: bool = True
    error: str | None = None


class ReasoningStep(BaseModel):
    step: int
    thought: str = Field(description="Planner's reasoning")
    action: str = Field(description="Action taken")
    tool_used: ToolType | None = None
    observation: str = Field(default="", description="Result observation")


class SourceReference(BaseModel):
    file_path: str
    file_name: str = ""
    section: str = ""
    score: float = 0.0


class AgentResponse(BaseModel):
    answer: str
    conversation_id: str
    reasoning_steps: list[ReasoningStep] = Field(default_factory=list)
    tools_used: list[ToolType] = Field(default_factory=list)
    sources: list[SourceReference] = Field(default_factory=list)
    confidence_score: float = 0.0
    model: str = "llama3.2"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    tool_calls: list[ToolCall] = Field(default_factory=list)
