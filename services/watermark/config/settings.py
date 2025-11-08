from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "watermark"
    service_port: int = 8140
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
