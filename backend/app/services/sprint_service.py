from app.models.project import Project
from app.repositories.project_repository import ProjectRepository
from app.schemas.sprint import SprintResponse


class SprintService:
    def __init__(
        self,
        repository: ProjectRepository,
    ):
        self.repository = repository

    def generate_sprint(
        self,
        project: Project,
    ) -> SprintResponse:
        sprint = SprintResponse(
            goal=f"Complete the first sprint for {project.name}",
            stories=[
                "As a user, I can log in.",
                "As a user, I can view my dashboard.",
            ],
            tasks=[
                "Design login page",
                "Implement login API",
                "Create dashboard UI",
                "Connect dashboard API",
            ],
            acceptance=[
                "User can log in successfully.",
                "Dashboard loads correctly.",
            ],
            timeline=[
                "Day 1-2: UI",
                "Day 3-4: Backend",
                "Day 5: Testing",
            ],
            risks=[
                "Authentication issues",
                "API integration delays",
            ],
        )

        project.generated_sprint = sprint.model_dump()

        self.repository.update(project)

        return sprint
