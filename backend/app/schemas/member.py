from pydantic import BaseModel, Field


class MemberBase(BaseModel):
    name: str = Field(..., min_length=1)
    role: str = Field(..., min_length=1)
    skill: str = Field(..., min_length=1)
    availability: int = Field(..., ge=0, le=100)


class MemberCreate(MemberBase):
    pass


class MemberResponse(MemberBase):
    id: str

    model_config = {"from_attributes": True}
