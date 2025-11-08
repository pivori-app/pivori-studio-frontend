from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "document-scan"
    service_port: int = 8130
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
