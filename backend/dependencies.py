from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import models
from auth import TokenType, verify_token
from config import settings
from database import get_db


async def get_current_user(
    request: Request,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> models.User:
    """
    Authenticate the current user using the access token cookie.

    Returns:
        The authenticated User.

    Raises:
        HTTPException(401): If authentication fails.
    """

    token = request.cookies.get(settings.access_cookie_name)

    payload = verify_token(
        token=token,
        expected_type=TokenType.ACCESS,
    )

    user_id = payload["sub"]

    try:
        user_id = int(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

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

    return user