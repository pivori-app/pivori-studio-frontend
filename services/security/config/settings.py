from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "security"
    service_port: int = 8150
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
