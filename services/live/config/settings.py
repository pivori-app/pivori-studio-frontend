from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "live"
    service_port: int = 8090
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
