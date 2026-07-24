from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.teammemberrepositories import TeamMemberRepository
from app.schemas.team_member import (
    TeamMemberCreate,
    TeamMemberResponse,
    TeamMemberUpdate,
)
from app.services.member_service import TeamMemberService

router = APIRouter(
    tags=["Team Members"],
)


def get_member_service(
    db: Session = Depends(get_db),
) -> TeamMemberService:
    repository = TeamMemberRepository(db)
    return TeamMemberService(repository)


@router.get(
    "/projects/{project_id}/members",
    response_model=list[TeamMemberResponse],
)
def get_members(
    project_id: str,
    service: TeamMemberService = Depends(get_member_service),
):
    return service.get_members(project_id)


@router.post(
    "/projects/{project_id}/members",
    response_model=TeamMemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_member(
    project_id: str,
    data: TeamMemberCreate,
    service: TeamMemberService = Depends(get_member_service),
):
    return service.create_member(project_id, data)


@router.put(
    "/members/{member_id}",
    response_model=TeamMemberResponse,
)
def update_member(
    member_id: str,
    data: TeamMemberUpdate,
    service: TeamMemberService = Depends(get_member_service),
):
    member = service.update_member(member_id, data)

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team member not found",
        )

    return member


@router.delete(
    "/members/{member_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_member(
    member_id: str,
    service: TeamMemberService = Depends(get_member_service),
):
    deleted = service.delete_member(member_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team member not found",
        )

    return None
