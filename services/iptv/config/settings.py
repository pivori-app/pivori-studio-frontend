from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "iptv"
    service_port: int = 8070
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
