from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.members import router as member_router
from app.api.projects import router as project_router
from app.api.sprints import router as sprint_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(project_router)
app.include_router(member_router)
app.include_router(sprint_router)


@app.get("/")
def root():
    return {
        "message": "SprintWise AI API is running!",
    }
