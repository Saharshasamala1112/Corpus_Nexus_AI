import httpx
from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings
from app.dependencies import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

security = HTTPBearer()


@router.get("")
async def get_profile(
    user=Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            f"{settings.corpus_api_base_url}/api/v1/auth/me",
            headers={
                "Authorization": f"Bearer {token}",
                "accept": "application/json",
            },
        )

    response.raise_for_status()

    return response.json()
