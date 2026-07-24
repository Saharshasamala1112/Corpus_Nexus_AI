import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    phone: str
    password: str


@router.post("/login")
async def login(data: LoginRequest):

    url = f"{settings.corpus_api_base_url}/api/v1/auth/login"

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            url,
            json={
                "phone": data.phone,
                "password": data.password,
            },
            headers={
                "accept": "application/json",
                "Content-Type": "application/json",
            },
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.json(),
        )

    return response.json()
