"""Tests for security module and auth."""

from app.core.security import create_access_token, decode_access_token


class TestJWTAuth:
    def test_create_and_decode_token(self):
        token = create_access_token(subject="user123")
        payload = decode_access_token(token)
        assert payload is not None
        assert payload.get("sub") == "user123"
        assert "exp" in payload
        assert "iat" in payload

    def test_decode_invalid_token(self):
        payload = decode_access_token("invalid.token.here")
        assert payload is None

    def test_token_with_extra_claims(self):
        token = create_access_token(subject="user1", extra_claims={"role": "admin"})
        payload = decode_access_token(token)
        assert payload["role"] == "admin"
