from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "market-data"
    service_port: int = 8050
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
