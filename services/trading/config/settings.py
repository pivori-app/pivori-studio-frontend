from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "trading"
    service_port: int = 8040
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
