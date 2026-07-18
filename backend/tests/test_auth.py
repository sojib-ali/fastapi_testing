import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_login_success(async_client: AsyncClient, test_user):
    response = await async_client.post(
        "/api/users/login",
        json={"email": test_user.email, "password": "securepassword"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Login successful"
    
    # Check for HttpOnly cookies
    cookies = response.cookies
    assert "access_token" in cookies
    assert "refresh_token" in cookies

@pytest.mark.asyncio
async def test_login_invalid_password(async_client: AsyncClient, test_user):
    response = await async_client.post(
        "/api/users/login",
        json={"email": test_user.email, "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

@pytest.mark.asyncio
async def test_login_nonexistent_email(async_client: AsyncClient):
    response = await async_client.post(
        "/api/users/login",
        json={"email": "nobody@example.com", "password": "password123"}
    )
    # Security Best Practice: Do not distinguish between invalid email or invalid password
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

@pytest.mark.asyncio
async def test_refresh_token_success(async_client: AsyncClient, test_user):
    # First, login to get cookies
    login_resp = await async_client.post(
        "/api/users/login",
        json={"email": test_user.email, "password": "securepassword"}
    )
    refresh_token = login_resp.cookies.get("refresh_token")
    
    import asyncio
    await asyncio.sleep(1.1)  # Ensure the new token has a different timestamp
    
    # Try refreshing
    async_client.cookies.set("refresh_token", refresh_token)
    response = await async_client.post("/api/users/refresh")
    
    assert response.status_code == 200
    assert "access_token" in response.cookies
    # Ensure new access token is actually issued
    assert response.cookies.get("access_token") != login_resp.cookies.get("access_token")

@pytest.mark.asyncio
async def test_refresh_token_missing(async_client: AsyncClient):
    # Missing refresh cookie
    response = await async_client.post("/api/users/refresh")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_refresh_token_invalid_signature(async_client: AsyncClient):
    async_client.cookies.set("refresh_token", "invalid.jwt.token")
    response = await async_client.post("/api/users/refresh")
    assert response.status_code == 401
    assert "Invalid authentication token" in response.json()["detail"]

@pytest.mark.asyncio
async def test_logout(async_client: AsyncClient, test_user):
    await async_client.post(
        "/api/users/login",
        json={"email": test_user.email, "password": "securepassword"}
    )
    
    response = await async_client.post("/api/users/logout")
    assert response.status_code == 200
    
    # Ensure cookies are cleared (httpx deletes the cookie if max-age=0 or expires in past)
    # httpx doesn't always reflect deletion directly in async_client.cookies correctly if using exact parsing,
    # but we can check the set-cookie headers
    set_cookies = response.headers.get_list("set-cookie")
    assert any("access_token" in sc and "Max-Age=0" in sc for sc in set_cookies)
    assert any("refresh_token" in sc and "Max-Age=0" in sc for sc in set_cookies)
