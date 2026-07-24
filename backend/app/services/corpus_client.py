import os
import httpx


class CorpusClient:
    def __init__(self, base_url: str | None = None):
        self.base_url = (base_url or os.environ.get("CORPUS_SERVER_URL", "http://localhost:8000")).rstrip("/")

    async def get(self, endpoint: str, token: str | None = None):
        headers = {"accept": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"

        url = f"{self.base_url.rstrip('/')}/{endpoint.lstrip('/')}"

        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
            resp = await client.get(url, headers=headers)
            resp.raise_for_status()
            return resp.json()
