from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.project_repository import ProjectRepository
from app.schemas.sprint import SprintResponse
from app.services.sprint_service import SprintService

router = APIRouter(
    tags=["Sprint"],
)


def get_project_repository(
    db: Session = Depends(get_db),
):
    return ProjectRepository(db)


@router.post(
    "/projects/{project_id}/generate-sprint",
    response_model=SprintResponse,
)
def generate_sprint(
    project_id: str,
    repository: ProjectRepository = Depends(get_project_repository),
):
    project = repository.get_by_id(project_id)

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    sprint_service = SprintService(repository)

    return sprint_service.generate_sprint(project)
