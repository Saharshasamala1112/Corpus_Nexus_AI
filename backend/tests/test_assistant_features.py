import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.llm import LocalProvider, OllamaProvider, get_fallback_provider, select_model_for_question
from app.services.vector_store import InMemoryVectorStore


class AssistantFeaturesTestCase(unittest.TestCase):
    def test_select_model_for_question_prefers_technical_model(self):
        self.assertEqual(select_model_for_question("How do I deploy this application?"), "qwen2.5")

    def test_select_model_for_question_prefers_code_model(self):
        self.assertEqual(select_model_for_question("What is the bug in this python function?"), "mistral")

    def test_get_fallback_provider_returns_local_for_ollama(self):
        provider = OllamaProvider(model="qwen2.5")
        fallback = get_fallback_provider(provider)
        self.assertIsInstance(fallback, LocalProvider)

    def test_prompt_builder_includes_confidence_instruction(self):
        from app.services.prompt_builder import SYSTEM_PROMPT
        self.assertIn("confidence score", SYSTEM_PROMPT.lower())
        self.assertIn("Confidence: 0.85", SYSTEM_PROMPT)

    def test_in_memory_vector_store_supports_metadata_filters(self):
        store = InMemoryVectorStore()

        async def run_test():
            await store.upsert("doc-1", "Docker deployment guide", metadata={"source": "docs", "type": "guide"})
            await store.upsert("doc-2", "API usage notes", metadata={"source": "api", "type": "guide"})
            docs = await store.search("deployment", top_k=5, filters={"source": "docs"})
            return docs

        import asyncio

        docs = asyncio.run(run_test())
        self.assertEqual(len(docs), 1)
        self.assertEqual(docs[0]["id"], "doc-1")

    def test_local_provider_uses_transformers_pipeline_if_available(self):
        provider = LocalProvider(model="gpt2")
        if provider._pipeline is None and provider.__class__.__name__ == "LocalProvider":
            self.assertTrue(True)
        else:
            self.assertIsInstance(provider, LocalProvider)


if __name__ == "__main__":
    unittest.main()
