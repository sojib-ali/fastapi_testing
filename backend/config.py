from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    secret_key: SecretStr

    algorithm: str = "HS256"

    access_token_expire_minutes: int = 1
    refresh_token_expire_days: int = 30

    # Cookie settings
    cookie_secure: bool = False
    cookie_samesite: str = "lax"

    access_cookie_name: str = "access_token"
    refresh_cookie_name: str = "refresh_token"

    #image setting
    max_upload_size_bytes: int = 5 * 1024 * 1024


settings = Settings()