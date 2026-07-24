from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import load_dotenv
load_dotenv()

from app.api.assistant import router as assistant_router
from app.services.indexer import indexer
import os
import asyncio
from app.services.embedding_worker import EmbeddingWorker


def create_app() -> FastAPI:
	app = FastAPI(title="Corpus Nexus Backend")

	app.add_middleware(
		CORSMiddleware,
		allow_origins=["*"],
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)

	app.include_router(assistant_router)

	return app


app = create_app()


@app.on_event("startup")
async def startup_event():
	# optional corpus sync worker
	enable = os.environ.get("ENABLE_CORPUS_SYNC", "false").lower() in ("1", "true", "yes")
	if enable:
		# kick off background indexing task
		asyncio.create_task(indexer.run(interval_seconds=int(os.environ.get("CORPUS_SYNC_INTERVAL", "60"))))
	# optional embedding worker
	if os.environ.get("ENABLE_EMBEDDING_WORKER", "false").lower() in ("1", "true", "yes"):
		worker = EmbeddingWorker()
		asyncio.create_task(worker.run(interval_seconds=int(os.environ.get("EMBEDDING_INTERVAL", "300"))))

