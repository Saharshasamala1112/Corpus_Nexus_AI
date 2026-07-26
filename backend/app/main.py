from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.assistant import router as assistant_router
from app.api.dashboard import router as dashboard_router
from app.api.members import router as member_router
from app.api.projects import router as project_router
from app.api.sprints import router as sprint_router
from app.api.upload import router as upload_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(project_router)
app.include_router(member_router)
app.include_router(sprint_router)
app.include_router(dashboard_router)
app.include_router(upload_router)
app.include_router(assistant_router)


@app.get("/")
def root():
    return {
        "message": "SprintWise AI API is running!",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }
