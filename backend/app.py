import logging
import os
import subprocess
import sys


def _relaunch_in_venv() -> None:
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    venv_python = os.path.join(project_root, ".venv", "Scripts", "python.exe")

    if not os.path.exists(venv_python):
        return

    current = os.path.abspath(sys.executable).lower()
    target = os.path.abspath(venv_python).lower()
    if current == target or os.environ.get("AI_LAWYER_VENV_BOOTSTRAPPED") == "1":
        return

    os.environ["AI_LAWYER_VENV_BOOTSTRAPPED"] = "1"
    subprocess.Popen([venv_python, os.path.abspath(__file__), *sys.argv[1:]], cwd=project_root)
    raise SystemExit(0)


_relaunch_in_venv()

from flask import Flask
from flask_cors import CORS

from config import settings
from routes.api import api_bp
from utils.errors import register_error_handlers
from utils.rate_limit import register_rate_limiter


def create_app():
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False

    CORS(app, resources={r"/api/*": {"origins": settings.CORS_ORIGINS}})
    register_rate_limiter(app, requests_per_minute=120)

    @app.before_request
    def _set_request_logging():
        app.logger.setLevel(logging.INFO)

    app.register_blueprint(api_bp)
    register_error_handlers(app)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=settings.DEBUG)
