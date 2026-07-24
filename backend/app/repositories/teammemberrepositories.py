from sqlalchemy.orm import Session

from app.models.team_member import TeamMember


class TeamMemberRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[TeamMember]:
        return self.db.query(TeamMember).order_by(TeamMember.created_at.asc()).all()

    def get_all_by_project(self, project_id: str) -> list[TeamMember]:
        return (
            self.db.query(TeamMember)
            .filter(TeamMember.project_id == project_id)
            .order_by(TeamMember.created_at.asc())
            .all()
        )

    def get_by_id(self, member_id: str) -> TeamMember | None:
        return self.db.query(TeamMember).filter(TeamMember.id == member_id).first()

    def create(self, member: TeamMember) -> TeamMember:
        self.db.add(member)
        self.db.commit()
        self.db.refresh(member)
        return member

    def update(self, member: TeamMember) -> TeamMember:
        self.db.commit()
        self.db.refresh(member)
        return member

    def delete(self, member: TeamMember) -> None:
        self.db.delete(member)
        self.db.commit()
