from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TeamMemberBase(BaseModel):
    name: str

    role: str

    skill: str

    availability: int = 100


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseModel):
    name: str | None = None

    role: str | None = None

    skill: str | None = None

    availability: int | None = None


class TeamMemberResponse(TeamMemberBase):
    id: str

    project_id: str = Field(alias="projectId")

    created_at: datetime = Field(alias="createdAt")

    updated_at: datetime = Field(alias="updatedAt")

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )
