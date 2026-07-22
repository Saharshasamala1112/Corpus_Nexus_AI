import httpx
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

security = HTTPBearer()


async def get_current_user(
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

    if response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    return response.json()
