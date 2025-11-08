from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "reward"
    service_port: int = 8120
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
