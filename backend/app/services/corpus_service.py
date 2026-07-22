from app.core.config import settings
from app.services.corpus_client import CorpusClient


class CorpusService:
    def __init__(self):
        self.client = CorpusClient(settings.corpus_api_base_url)

    async def get_languages(self, token: str):
        return await self.client.get(
            "/api/v1/languages",
            token,
        )

    async def get_categories(self, token: str):
        return await self.client.get(
            "/api/v1/categories/",
            token,
        )

    async def search(self, query: str, token: str):

        records = await self.client.get(
            "/api/v1/records/?skip=0&limit=100",
            token,
        )

        results = []

        for item in records:
            searchable_text = (
                str(item.get("title", ""))
                + str(item.get("description", ""))
                + str(item.get("username", ""))
                + str(item.get("creator", ""))
                + str(item.get("language", ""))
            ).lower()

            if query.lower() in searchable_text:
                results.append(item)

        return results

    async def get_records(self, token: str):
        return await self.client.get(
            "/api/v1/records",
            token,
        )

    async def get_record(self, record_id: str, token: str):
        return await self.client.get(
            f"/api/v1/records/{record_id}",
            token,
        )
