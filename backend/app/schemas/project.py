from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProjectBase(BaseModel):
    name: str
    description: str = ""

    sprint_duration: int = Field(alias="sprintDuration")

    team_size: int = Field(alias="teamSize")

    status: str = "Planning"

    model_config = ConfigDict(populate_by_name=True)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None

    sprint_duration: int | None = Field(default=None, alias="sprintDuration")

    team_size: int | None = Field(default=None, alias="teamSize")

    status: str | None = None

    model_config = ConfigDict(populate_by_name=True)


class ProjectResponse(ProjectBase):
    id: str

    created_at: datetime = Field(alias="createdAt")

    updated_at: datetime = Field(alias="updatedAt")

    members: list = []

    generatedSprint: dict | None = None

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )
