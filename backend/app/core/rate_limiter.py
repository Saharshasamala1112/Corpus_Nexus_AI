import time

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger("rate_limiter")

_redis_available: bool = False
_MAX_CLEANUP_KEYS = 1000

try:
    import redis.asyncio as _aioredis  # noqa: F401 — verify import works at module load

    _redis_available = True
except ImportError:
    pass


class RedisRateLimiter:
    """Redis-backed sliding window rate limiter."""

    def __init__(self) -> None:
        self._client = None

    async def _get_client(self):
        if self._client is None:
            import redis.asyncio as aioredis

            settings = get_settings()
            self._client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        return self._client

    async def check(self, key: str, max_requests: int, window_seconds: int) -> bool:
        try:
            client = await self._get_client()
            now = time.time()
            window_start = now - window_seconds
            pipe = client.pipeline()
            pipe.zremrangebyscore(key, 0, window_start)
            pipe.zadd(key, {str(now): now})
            pipe.expire(key, window_seconds)
            pipe.zcard(key)
            result = await pipe.execute()
            count = result[-1]
            return count <= max_requests
        except Exception as exc:
            logger.error("Redis rate limiter failed: %s — denying request", exc)
            return False

    async def close(self) -> None:
        if self._client is not None:
            await self._client.close()
            self._client = None


class MemoryRateLimiter:
    """In-memory fallback rate limiter."""

    def __init__(self) -> None:
        self._store: dict[str, list[float]] = {}
        self._last_cleanup = time.time()

    def check(self, key: str, max_requests: int, window_seconds: int) -> bool:
        now = time.time()
        window_start = now - window_seconds
        timestamps = self._store.get(key, [])
        timestamps = [t for t in timestamps if t > window_start]
        if len(timestamps) >= max_requests:
            return False
        timestamps.append(now)
        self._store[key] = timestamps
        if now - self._last_cleanup > 300:
            self._cleanup(now)
        return True

    def _cleanup(self, now: float) -> None:
        stale_keys = [k for k, v in self._store.items() if not v]
        for k in stale_keys:
            del self._store[k]
        if len(self._store) > _MAX_CLEANUP_KEYS:
            keys = sorted(self._store.keys(), key=lambda k: self._store[k][-1], reverse=True)
            for k in keys[_MAX_CLEANUP_KEYS:]:
                del self._store[k]
        self._last_cleanup = now

    def clear(self) -> None:
        self._store.clear()


_redis_limiter = RedisRateLimiter()
_memory_limiter = MemoryRateLimiter()


async def check_rate_limit(key: str) -> bool:
    settings = get_settings()
    if not settings.RATE_LIMIT_ENABLED:
        return True

    max_r = settings.RATE_LIMIT_MAX_REQUESTS
    window = settings.RATE_LIMIT_WINDOW_SECONDS

    if _redis_available:
        return await _redis_limiter.check(key, max_r, window)
    return _memory_limiter.check(key, max_r, window)


async def close_rate_limiter() -> None:
    if _redis_available:
        await _redis_limiter.close()


def clear_rate_limiter() -> None:
    _memory_limiter.clear()
