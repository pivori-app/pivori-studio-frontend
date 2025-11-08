from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "audio"
    service_port: int = 8080
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
