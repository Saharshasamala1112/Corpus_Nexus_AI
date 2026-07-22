from fastapi import APIRouter

from app.api.v1.assistant.router import router as assistant_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(assistant_router)
