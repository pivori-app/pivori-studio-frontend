from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "leaderboard"
    service_port: int = 8110
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
