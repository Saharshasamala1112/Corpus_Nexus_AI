from fastapi import APIRouter, Request, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from typing import AsyncGenerator
from time import time

from app.services.assistant_service import ask, stream
from app.services.vector_store import vector_store, search_docs
from app.services.local_indexer import ingest_local
from app.services.prompt_builder import build_retrieval_prompt
from app.services.llm import get_default_provider
from app.services.conversation_repo import conversation_repo
from app.services.message_repo import message_repo

router = APIRouter()


def get_user_id(request: Request) -> str:
    return request.headers.get("x-user-id") or "anonymous"


async def ensure_conversation(conversation_id: str, title: str, owner: str):
    existing = await conversation_repo.get_by_id(conversation_id)
    if existing is None:
        await conversation_repo.create(conversation_id, title, model=None)
        await conversation_repo.set_owner(conversation_id, owner)
    elif existing.get("owner") is None:
        await conversation_repo.set_owner(conversation_id, owner)


@router.post("/assistant/chat")
async def chat_endpoint(request: Request, payload: dict):
    user = get_user_id(request)
    question = payload.get("question")
    if not question:
        raise HTTPException(status_code=400, detail="Missing question")

    history = payload.get("history") if isinstance(payload.get("history"), list) else []
    context = payload.get("context")
    top_k = int(payload.get("top_k", 5))
    conversation_id = payload.get("conversation_id") or f"conv-{int(time() * 1000)}"
    title = payload.get("conversation_title") or question[:80]

    result = await ask(question, history, context, top_k=top_k)
    answer = result.get("answer", "")
    used_corpus = result.get("used_corpus", False)
    source_count = result.get("source_count", 0)
    confidence = result.get("confidence", 0.0)

    await ensure_conversation(conversation_id, title, user)
    await message_repo.create(
        f"msg-{int(time() * 1000)}-user", conversation_id, "user", question
    )
    await message_repo.create(
        f"msg-{int(time() * 1000)}-assistant", conversation_id, "assistant", answer
    )

    return JSONResponse(
        content={
            "answer": answer,
            "usedCorpus": used_corpus,
            "sourceCount": source_count,
            "confidence": confidence,
            "conversation_id": conversation_id,
        }
    )


def sse_format(payload: str) -> str:
    if payload == "":
        return "data: \n\n"

    lines = payload.split("\n")
    if payload.endswith("\n"):
        lines.append("")

    return "".join(f"data: {line}\n" for line in lines) + "\n"


@router.post("/assistant/chat/stream")
async def chat_stream_endpoint(request: Request):
    payload = await request.json()
    question = payload.get("question")
    history = payload.get("history") if isinstance(payload.get("history"), list) else []
    context = payload.get("context")
    top_k = int(payload.get("top_k", 5))
    if not question:
        raise HTTPException(status_code=400, detail="Missing question")

    user = get_user_id(request)
    conversation_id = payload.get("conversation_id") or f"conv-{int(time() * 1000)}"
    title = payload.get("conversation_title") or question[:80]
    await ensure_conversation(conversation_id, title, user)
    await message_repo.create(
        f"msg-{int(time() * 1000)}-user", conversation_id, "user", question
    )

    async def event_generator() -> AsyncGenerator[str, None]:
        assistant_id = f"msg-{int(time() * 1000)}-assistant"
        accumulated = ""
        try:
            async for chunk in stream(question, history, context, top_k=top_k):
                accumulated += str(chunk)
                yield sse_format(chunk)
        except Exception:
            fallback = await ask(question, history, context, top_k=top_k)
            accumulated = fallback.get("answer", "")
            yield sse_format(accumulated)
            await message_repo.create(
                assistant_id, conversation_id, "assistant", accumulated
            )
            return

        await message_repo.create(
            assistant_id, conversation_id, "assistant", accumulated
        )
        yield sse_format("[DONE]")

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/assistant/search")
async def assistant_search(payload: dict):
    q = payload.get("q") or payload.get("query")
    if not q:
        raise HTTPException(status_code=400, detail="Missing query")
    results = await search_docs(q, top_k=int(payload.get("top_k", 5)))
    return JSONResponse(content={"results": results})


@router.post("/assistant/retrieve")
async def assistant_retrieve(payload: dict):
    q = payload.get("q") or payload.get("query")
    if not q:
        raise HTTPException(status_code=400, detail="Missing query")
    results = await search_docs(q, top_k=int(payload.get("top_k", 5)))
    return JSONResponse(content={"results": results})


@router.post("/assistant/ingest-local")
async def assistant_ingest_local(payload: dict | None = None):
    # optionally accept base_path in payload
    base = None
    if payload:
        base = payload.get("base_path")
    count = await ingest_local(base)
    return JSONResponse(content={"indexed": count})


@router.get("/assistant/suggestions")
async def assistant_suggestions():
    # lightweight suggestions endpoint; can be enhanced later to use analytics or popularity signals
    suggestions = [
        "Summarize the latest corpus health trends",
        "Which records need review today?",
        "Explain the current ingestion pipeline",
        "Show me the most relevant documents for this project",
        "How do I deploy the platform?",
        "Show recent model drift alerts",
    ]
    return JSONResponse(content={"suggestions": suggestions})


# Conversation persistence endpoints
@router.post("/assistant/conversations")
async def create_conversation(request: Request, payload: dict):
    user = get_user_id(request)
    if not user:
        raise HTTPException(status_code=401, detail="Missing X-User-Id header")
    conv_id = payload.get("id") or f"conv-{int(time() * 1000)}"
    title = payload.get("title") or "Conversation"
    await ensure_conversation(conv_id, title, user)
    return JSONResponse(content={"id": conv_id, "title": title, "owner": user})


@router.get("/assistant/conversations")
async def list_conversations(request: Request):
    user = request.headers.get("x-user-id")
    if not user:
        raise HTTPException(status_code=401, detail="Missing X-User-Id header")
    items = await conversation_repo.list(owner=user)
    return JSONResponse(content={"conversations": items})


@router.get("/assistant/conversations/{conv_id}")
async def get_conversation(conv_id: str, request: Request):
    user = request.headers.get("x-user-id")
    if not user:
        raise HTTPException(status_code=401, detail="Missing X-User-Id header")
    conv = await conversation_repo.get_by_id(conv_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Not found")
    if conv.get("owner") and conv.get("owner") != user:
        raise HTTPException(status_code=403, detail="Forbidden")
    messages = await message_repo.list_for_conversation(conv_id)
    conv = {**conv, "messages": messages}
    return JSONResponse(content={"conversation": conv})


@router.post("/assistant/conversations/{conv_id}/messages")
async def create_message(conv_id: str, request: Request, payload: dict):
    user = request.headers.get("x-user-id")
    if not user:
        raise HTTPException(status_code=401, detail="Missing X-User-Id header")
    conv = await conversation_repo.get_by_id(conv_id)
    if conv and conv.get("owner") and conv.get("owner") != user:
        raise HTTPException(status_code=403, detail="Forbidden")
    # ensure conversation exists and set owner if missing
    if not conv:
        await conversation_repo.create(
            conv_id, payload.get("title") or "Conversation", model=None
        )
        await conversation_repo.set_owner(conv_id, user)

    message_id = payload.get("id") or f"msg-{__import__('time').time()}"
    role = payload.get("role") or "assistant"
    content = payload.get("content") or ""
    await message_repo.create(message_id, conv_id, role, content)
    # touch conversation
    await conversation_repo.touch(conv_id)
    return JSONResponse(content={"id": message_id})


@router.post("/assistant/upload")
async def upload_file(request: Request, file: UploadFile = File(...)):
    user = request.headers.get("x-user-id")
    if not user:
        raise HTTPException(status_code=401, detail="Missing X-User-Id header")
    # Save file to temporary location
    import os, tempfile

    fd, path = tempfile.mkstemp(prefix="upload_", suffix="_" + (file.filename or "bin"))
    os.close(fd)
    contents = await file.read()
    with open(path, "wb") as f:
        f.write(contents)
    # In production you'd store in object storage; respond with a simple pointer
    return JSONResponse(
        content={"url": f"/uploads/{os.path.basename(path)}", "filename": file.filename}
    )
