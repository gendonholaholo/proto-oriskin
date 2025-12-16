from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import analyze
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(
    analyze.router, prefix=f"{settings.API_V1_STR}", tags=["analysis"]
)


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/info")
def service_info():
    """
    Service information endpoint.
    Useful for frontend to check current service configuration.
    """
    return {
        "service": settings.PROJECT_NAME,
        "mock_mode": settings.MOCK_MODE,
        "api_version": settings.API_V1_STR,
        "message": "MOCK MODE ACTIVE - Data is simulated"
        if settings.MOCK_MODE
        else "PRODUCTION MODE - Using real ML model",
    }
