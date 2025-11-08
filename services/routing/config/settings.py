from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "routing"
    service_port: int = 8020
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
