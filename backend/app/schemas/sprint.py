from pydantic import BaseModel, Field


class SprintResponse(BaseModel):
    goal: str

    stories: list[str] = Field(default_factory=list)
    tasks: list[str] = Field(default_factory=list)
    acceptance: list[str] = Field(default_factory=list)
    timeline: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)

    model_config = {"from_attributes": True}
