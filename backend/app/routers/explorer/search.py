from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.dependencies import get_current_user
from app.services.corpus_service import CorpusService

router = APIRouter()

service = CorpusService()
security = HTTPBearer()


@router.get("/search")
async def search(
    q: str,
    user=Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    return await service.search(q, token)
