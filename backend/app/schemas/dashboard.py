from pydantic import BaseModel


class DashboardStats(BaseModel):
    projects: int
    members: int
    sprint_plans: int
    ai_suggestions: int
