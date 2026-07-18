import pytest
from httpx import AsyncClient
import jwt
from datetime import UTC, datetime, timedelta
from config import settings

@pytest.mark.asyncio
async def test_register_user_success(async_client: AsyncClient):
    response = await async_client.post(
        "/api/users",
        json={"username": "newuser", "email": "newuser@example.com", "password": "strongpassword"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "password_hash" not in data  # Security check: Password hash should not leak

@pytest.mark.asyncio
async def test_register_duplicate_username(async_client: AsyncClient, test_user):
    response = await async_client.post(
        "/api/users",
        json={"username": test_user.username, "email": "different@example.com", "password": "password123"}
    )
    assert response.status_code == 400
    assert "Username already exists" in response.json()["detail"]

@pytest.mark.asyncio
async def test_register_duplicate_email(async_client: AsyncClient, test_user):
    response = await async_client.post(
        "/api/users",
        json={"username": "differentname", "email": test_user.email, "password": "password123"}
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

@pytest.mark.asyncio
async def test_get_me_success(async_client: AsyncClient, test_user):
    # Authenticate
    login_resp = await async_client.post(
        "/api/users/login",
        json={"email": test_user.email, "password": "securepassword"}
    )
    async_client.cookies.set("access_token", login_resp.cookies.get("access_token"))
    
    response = await async_client.get("/api/users/me")
    assert response.status_code == 200
    assert response.json()["email"] == test_user.email

@pytest.mark.asyncio
async def test_get_me_unauthorized(async_client: AsyncClient):
    response = await async_client.get("/api/users/me")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_me_expired_token(async_client: AsyncClient, test_user):
    # Manually craft an expired token
    expire = datetime.now(UTC) - timedelta(minutes=5)
    payload = {
        "sub": str(test_user.id),
        "type": "access",
        "exp": expire,
        "iat": datetime.now(UTC) - timedelta(minutes=15),
    }
    expired_token = jwt.encode(payload, settings.secret_key.get_secret_value(), algorithm=settings.algorithm)
    
    async_client.cookies.set("access_token", expired_token)
    response = await async_client.get("/api/users/me")
    
    assert response.status_code == 401
    assert "Token has expired" in response.json()["detail"]

@pytest.mark.asyncio
async def test_update_user(async_client: AsyncClient, test_user):
    login_resp = await async_client.post(
        "/api/users/login",
        json={"email": test_user.email, "password": "securepassword"}
    )
    async_client.cookies.set("access_token", login_resp.cookies.get("access_token"))
    
    # Update user - wait, the endpoint is /api/users/{user_id} and does not enforce IDOR 
    # natively unless `get_current_user` checks it, but let's test the endpoint as is.
    response = await async_client.patch(
        f"/api/users/{test_user.id}",
        json={"username": "updatedusername"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "updatedusername"
