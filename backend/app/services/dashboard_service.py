from app.repositories.project_repository import ProjectRepository
from app.repositories.teammemberrepositories import TeamMemberRepository
from app.schemas.dashboard import DashboardStats


class DashboardService:
    def __init__(
        self,
        project_repository: ProjectRepository,
        member_repository: TeamMemberRepository,
    ):
        self.project_repository = project_repository
        self.member_repository = member_repository

    def get_dashboard_stats(self) -> DashboardStats:
        projects = self.project_repository.get_all()
        members = self.member_repository.get_all()

        sprint_plans = sum(
            1 for project in projects if project.generated_sprint is not None
        )

        return DashboardStats(
            projects=len(projects),
            members=len(members),
            sprint_plans=sprint_plans,
            ai_suggestions=sprint_plans,
        )
