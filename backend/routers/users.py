from typing import Annotated
from datetime import timedelta

from fastapi import Response, Request
from fastapi import Depends, FastAPI, HTTPException, status, APIRouter
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
import models
from database import get_db
from schemas import PostResponse, UserCreate, UserUpdate, UserPrivate, UserPublic, LoginRequest, Message
from fastapi.security import OAuth2PasswordRequestForm
from auth import (
     create_token, verify_token, hash_password, verify_password, TokenType, set_access_cookie, set_refresh_cookie, clear_auth_cookies
)
from config import settings
from dependencies import get_current_user


router = APIRouter()


@router.post(
    "",
    response_model=UserPrivate,
    status_code=status.HTTP_201_CREATED,
)

async def create_user(user: UserCreate, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        select(models.User).where(func.lower(models.User.username) == user.username.lower())
    )

    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )
    
    # for email
    result = await db.execute(
        select(models.User).where(func.lower(models.User.email) == user.email.lower()),
    )
    
    existing_email = result.scalars().first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    new_user = models.User(
        username=user.username,
        email=user.email.lower(),
        password_hash=hash_password(user.password),
    ) 
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Message)
async def login(login_data: LoginRequest, response: Response, db: Annotated[AsyncSession, Depends(get_db)]):
    # Look up user by email (case-insensitive)
    result = await db.execute(
        select(models.User).where(func.lower(models.User.email) == login_data.email.lower())
    )

    user = result.scalars().first()

    #Don't reveal whether the email or password was incorrect
    if user is None or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_token(
        subject=str(user.id),
        token_type=TokenType.ACCESS,
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    refresh_token = create_token(
        subject=str(user.id),
        token_type=TokenType.REFRESH,
        expires_delta=timedelta(days=settings.refresh_token_expire_days)
    )

    set_access_cookie(response, access_token)
    set_refresh_cookie(response, refresh_token)

    return Message(message="Login successful")

@router.get(
    "/me",
    response_model=UserPrivate,
)
async def get_me(
    current_user: Annotated[
        models.User,
        Depends(get_current_user),
    ],
):
    return current_user

@router.post(
    "/refresh",
    response_model=Message,
)
async def refresh_access_token(
    request: Request,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    # Read refresh token from cookie
    refresh_token = request.cookies.get(
        settings.refresh_cookie_name,
    )

    # Verify refresh token
    payload = verify_token(
        token=refresh_token,
        expected_type=TokenType.REFRESH,
    )

    user_id = payload["sub"]

    try:
        user_id = int(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

    # Make sure the user still exists
    result = await db.execute(
        select(models.User).where(
            models.User.id == user_id,
        )
    )

    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )

    # Create a fresh access token
    access_token = create_token(
        subject=str(user.id),
        token_type=TokenType.ACCESS,
        expires_delta=timedelta(
            minutes=settings.access_token_expire_minutes,
        ),
    )

    # Replace the access-token cookie
    set_access_cookie(
        response,
        access_token,
    )

    return Message(
        message="Access token refreshed successfully.",
    )


@router.post(
    "/logout",
    response_model=Message,
)
async def logout(
    response: Response,
):
    clear_auth_cookies(response)

    return Message(
        message="Logged out successfully.",
    )


@router.get("/{user_id}", response_model=UserPublic)
async def get_user(user_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        select(models.User).where(models.User.id == user_id),
    )
    user = result.scalars().first()
    if user:
        return user
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


@router.get("/{user_id}/posts", response_model=list[PostResponse])
async def get_user_post(user_id:int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        select(models.User).where(models.User.id == user_id),
    )
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    result = await db.execute(
        select(models.Post)
        .options(selectinload(models.Post.author))
        .where(models.Post.user_id == user_id)
    )
    posts = result.scalars().all()
    return posts


@router.patch("/{user_id}", response_model=UserPrivate)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Annotated[AsyncSession, Depends(get_db)]
):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    if user_update.username is not None and user_update.username != user.username:
        result = await db.execute(
            select(models.User).where(models.User.username == user_update.username),
        )
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username alreday exists",
            )
    
    if user_update.email is not None and user_update.email != user.email:
        result = await db.execute(
            select(models.User).where(models.User.email == user_update.email),
        )
        existing_email = result.scalars().first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="email alreday registered",
            )
    
    if user_update.username is not None:
        user.username = user_update.username
    if user_update.email is not None:
        user.email = user_update.email
    if user_update.image_file is not None:
        user.image_file = user_update.image_file

    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.User).where(models.User.id == user_id))

    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    await db.delete(user)
    await db.commit()
