import os


class Settings:
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = FLASK_ENV == "development"
    API_VERSION = "v1"

    raw_origins = os.getenv("CORS_ORIGINS", "").strip()

    # In development, allow any localhost/127.0.0.1 port because Vite may shift ports.
    if raw_origins:
        CORS_ORIGINS = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    elif FLASK_ENV == "development":
        CORS_ORIGINS = [r"http://localhost(:\d+)?", r"http://127\.0\.0\.1(:\d+)?"]
    else:
        CORS_ORIGINS = ["http://localhost:5173"]


settings = Settings()
