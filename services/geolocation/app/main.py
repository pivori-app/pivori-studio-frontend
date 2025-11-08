from fastapi import FastAPI
from fastapi.responses import JSONResponse
import logging

app = FastAPI(
    title="Geolocation Service",
    description="Geolocation Service for Pivori Studio",
    version="1.0.0"
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "geolocation"}

@app.get("/metrics")
async def metrics():
    return {"service": "geolocation", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8010)
