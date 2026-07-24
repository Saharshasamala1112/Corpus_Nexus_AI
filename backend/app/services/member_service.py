from app.models.team_member import TeamMember
from app.repositories.teammemberrepositories import TeamMemberRepository
from app.schemas.team_member import (
    TeamMemberCreate,
    TeamMemberUpdate,
)


class TeamMemberService:
    def __init__(self, repository: TeamMemberRepository):
        self.repository = repository

    def get_members(self, project_id: str) -> list[TeamMember]:
        return self.repository.get_all_by_project(project_id)

    def get_member(self, member_id: str) -> TeamMember | None:
        return self.repository.get_by_id(member_id)

    def create_member(
        self,
        project_id: str,
        data: TeamMemberCreate,
    ) -> TeamMember:
        member = TeamMember(
            project_id=project_id,
            name=data.name,
            role=data.role,
            skill=data.skill,
            availability=data.availability,
        )

        return self.repository.create(member)

    def update_member(
        self,
        member_id: str,
        data: TeamMemberUpdate,
    ) -> TeamMember | None:
        member = self.repository.get_by_id(member_id)

        if not member:
            return None

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(member, key, value)

        return self.repository.update(member)

    def delete_member(self, member_id: str) -> bool:
        member = self.repository.get_by_id(member_id)

        if not member:
            return False

        self.repository.delete(member)
        return True
