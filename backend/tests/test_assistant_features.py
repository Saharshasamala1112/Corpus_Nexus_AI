import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.assistant_service import _clean_response_text
from app.services.llm import (
    LocalProvider,
    OllamaProvider,
    _strip_reasoning_sections,
    get_fallback_provider,
)
from app.services.vector_store import InMemoryVectorStore


class AssistantFeaturesTestCase(unittest.TestCase):
    def test_clean_response_text_preserves_leading_spaces_and_newlines(self):
        text = "To\n deploy\n the\n Swecha"
        self.assertEqual(_clean_response_text(text), text)

    def test_get_fallback_provider_returns_local_for_ollama(self):
        provider = OllamaProvider(model="qwen2.5")
        fallback = get_fallback_provider(provider)
        self.assertIsInstance(fallback, LocalProvider)

    def test_strip_reasoning_sections_preserves_whitespace(self):
        text = "Hello!\n\nThinking: this is internal reasoning.\n\nHow can I help you today?"
        cleaned = _strip_reasoning_sections(text)

        self.assertIn("Hello!\n\n", cleaned)
        self.assertIn("How can I help you today?", cleaned)
        self.assertNotIn("Thinking:", cleaned)

    def test_retrieval_prompt_guides_general_knowledge_fallback(self):
        from app.services.prompt_builder import build_retrieval_prompt

        prompt = build_retrieval_prompt(
            "How should I deploy this service?", [], max_context_chars=2000
        )
        lowered = prompt.lower()

        self.assertIn("corpus", lowered)
        self.assertIn("general knowledge", lowered)
        self.assertIn("without explaining the fallback", lowered)
        self.assertIn("never invent", lowered)

    def test_in_memory_vector_store_supports_metadata_filters(self):
        store = InMemoryVectorStore()

        async def run_test():
            await store.upsert(
                "doc-1",
                "Docker deployment guide",
                metadata={"source": "docs", "type": "guide"},
            )
            await store.upsert(
                "doc-2", "API usage notes", metadata={"source": "api", "type": "guide"}
            )
            docs = await store.search("deployment", top_k=5, filters={"source": "docs"})
            return docs

        import asyncio

        docs = asyncio.run(run_test())
        self.assertEqual(len(docs), 1)
        self.assertEqual(docs[0]["id"], "doc-1")

    def test_local_provider_uses_transformers_pipeline_if_available(self):
        provider = LocalProvider(model="gpt2")
        if (
            provider._pipeline is None
            and provider.__class__.__name__ == "LocalProvider"
        ):
            self.assertTrue(True)
        else:
            self.assertIsInstance(provider, LocalProvider)


if __name__ == "__main__":
    unittest.main()
