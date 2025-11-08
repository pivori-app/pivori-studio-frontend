from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "proximity"
    service_port: int = 8030
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
