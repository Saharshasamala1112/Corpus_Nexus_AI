from app.models.project import Project
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    def __init__(self, repository: ProjectRepository):
        self.repository = repository

    def get_projects(self) -> list[Project]:
        return self.repository.get_all()

    def get_project(self, project_id: str) -> Project | None:
        return self.repository.get_by_id(project_id)

    def create_project(self, data: ProjectCreate) -> Project:
        project = Project(
            name=data.name,
            description=data.description,
            sprint_duration=data.sprint_duration,
            team_size=data.team_size,
            status=data.status,
        )

        return self.repository.create(project)

    def update_project(
        self,
        project_id: str,
        data: ProjectUpdate,
    ) -> Project | None:
        project = self.repository.get_by_id(project_id)

        if not project:
            return None

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(project, key, value)

        return self.repository.update(project)

    def delete_project(self, project_id: str) -> bool:
        project = self.repository.get_by_id(project_id)

        if not project:
            return False

        self.repository.delete(project)
        return True
