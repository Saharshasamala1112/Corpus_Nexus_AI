from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.dependencies import get_current_user
from app.services.corpus_service import CorpusService

router = APIRouter(prefix="/records")

service = CorpusService()
security = HTTPBearer()


@router.get("")
async def get_records(
    user=Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    return await service.get_records(token)


@router.get("/{record_id}")
async def get_record(
    record_id: str,
    user=Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    return await service.get_record(record_id, token)
