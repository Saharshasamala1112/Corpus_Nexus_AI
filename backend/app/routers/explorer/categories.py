from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.dependencies import get_current_user
from app.services.corpus_service import CorpusService

router = APIRouter()

service = CorpusService()
security = HTTPBearer()


@router.get("/categories")
async def get_categories(
    user=Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    return await service.get_categories(token)
