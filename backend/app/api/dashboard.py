from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.project_repository import ProjectRepository
from app.repositories.teammemberrepositories import TeamMemberRepository
from app.schemas.dashboard import DashboardStats
from app.services.dashboard_service import DashboardService

router = APIRouter(
    tags=["Dashboard"],
)


def get_dashboard_service(
    db: Session = Depends(get_db),
) -> DashboardService:
    project_repository = ProjectRepository(db)
    member_repository = TeamMemberRepository(db)

    return DashboardService(
        project_repository=project_repository,
        member_repository=member_repository,
    )


@router.get(
    "/dashboard",
    response_model=DashboardStats,
)
def get_dashboard(
    service: DashboardService = Depends(get_dashboard_service),
):
    return service.get_dashboard_stats()
