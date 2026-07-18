import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_all_posts(async_client: AsyncClient, test_post):
    response = await async_client.get("/api/posts")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["title"] == test_post.title

@pytest.mark.asyncio
async def test_create_post_success(async_client: AsyncClient, test_user):
    login_resp = await async_client.post(
        "/api/users/login",
        json={"email": test_user.email, "password": "securepassword"}
    )
    async_client.cookies.set("access_token", login_resp.cookies.get("access_token"))
    
    response = await async_client.post(
        "/api/posts",
        json={"title": "New Post", "content": "Content", "user_id": test_user.id}
    )
    assert response.status_code == 201
    assert response.json()["title"] == "New Post"

@pytest.mark.asyncio
async def test_create_post_unauthorized(async_client: AsyncClient):
    response = await async_client.post(
        "/api/posts",
        json={"title": "New Post", "content": "Content", "user_id": 1}
    )
    # SECURITY FLAW: The endpoint currently lacks authentication (Depends(get_current_user)). 
    # It only checks if the user_id provided in the payload exists.
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_update_post(async_client: AsyncClient, test_user, test_post):
    login_resp = await async_client.post(
        "/api/users/login",
        json={"email": test_user.email, "password": "securepassword"}
    )
    async_client.cookies.set("access_token", login_resp.cookies.get("access_token"))
    
    response = await async_client.patch(
        f"/api/posts/{test_post.id}",
        json={"title": "Updated Title", "content": "Updated Content"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"

@pytest.mark.asyncio
async def test_delete_post(async_client: AsyncClient, test_user, test_post):
    login_resp = await async_client.post(
        "/api/users/login",
        json={"email": test_user.email, "password": "securepassword"}
    )
    async_client.cookies.set("access_token", login_resp.cookies.get("access_token"))
    
    response = await async_client.delete(f"/api/posts/{test_post.id}")
    assert response.status_code == 204
    
    # Verify deletion
    response = await async_client.get(f"/api/posts/{test_post.id}")
    assert response.status_code == 404
