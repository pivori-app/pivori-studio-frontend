from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "geolocation"
    service_port: int = 8010
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
