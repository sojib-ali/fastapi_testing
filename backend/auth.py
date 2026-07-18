from datetime import UTC, datetime, timedelta
from fastapi import Response, HTTPException, status

import jwt
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from enum import Enum
from typing import Any

from config import settings

password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/users/token")



def hash_password(password: str) -> str: 
    return password_hash.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)

class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"


def create_token(
    *,
    subject: str,
    token_type: TokenType,
    expires_delta: timedelta,
) -> str:
    """
    Create a signed JWT.

    Args:
        subject: User ID.
        token_type: ACCESS or REFRESH.
        expires_delta: Token lifetime.

    Returns:
        Encoded JWT.
    """

    expire = datetime.now(UTC) + expires_delta

    payload = {
        "sub": subject,
        "type": token_type.value,
        "exp": expire,
        "iat": datetime.now(UTC),
    }

    return jwt.encode(
        payload,
        settings.secret_key.get_secret_value(),
        algorithm=settings.algorithm,
    )

def verify_token(
    token: str,
    expected_type: TokenType,
) -> dict[str, Any]:
    """
    Verify and decode a JWT.

    Args:
        token: The encoded JWT.
        expected_type: The expected token type (ACCESS or REFRESH).

    Returns:
        The decoded payload.

    Raises:
        HTTPException(401): If the token is missing, expired, invalid,
        or is not the expected token type.
    """

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided.",
        )

    try:
        payload = jwt.decode(
            token,
            settings.secret_key.get_secret_value(),
            algorithms=[settings.algorithm],
            options={
                "require": ["sub", "exp", "type"],
            },
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

    sub = payload.get("sub")
    token_type = payload.get("type")

    if not isinstance(sub, str):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject.",
        )

    if token_type != expected_type.value:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type.",
        )

    return payload



def set_access_cookie(
    response: Response,
    token: str,
) -> None:
    response.set_cookie(
        key=settings.access_cookie_name,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )


def set_refresh_cookie(
    response: Response,
    token: str,
) -> None:
    response.set_cookie(
        key=settings.refresh_cookie_name,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        path="/",
    )


def clear_auth_cookies(
    response: Response,
) -> None:
    response.delete_cookie(
        key=settings.access_cookie_name,
        path="/",
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
    )

    




