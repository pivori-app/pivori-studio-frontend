from pydantic import BaseSettings

class Settings(BaseSettings):
    service_name: str = "payment"
    service_port: int = 8060
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

settings = Settings()
