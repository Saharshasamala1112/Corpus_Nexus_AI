import httpx


class CorpusClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")

    async def get(self, endpoint: str, token: str):

        headers = {
            "Authorization": f"Bearer {token}",
            "accept": "application/json",
        }

        url = self.base_url + "/" + endpoint.lstrip("/")

        async with httpx.AsyncClient(
            timeout=60.0,
            follow_redirects=True,
        ) as client:
            response = await client.get(
                url,
                headers=headers,
            )

            response.raise_for_status()

            return response.json()
