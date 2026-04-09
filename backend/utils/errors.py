from pydantic import ValidationError
from utils.responses import error_response


def register_error_handlers(app):
    @app.errorhandler(ValidationError)
    def handle_validation_error(exc):
        return error_response("Validation failed", status=422, details=exc.errors())

    @app.errorhandler(ValueError)
    def handle_value_error(exc):
        return error_response(str(exc), status=400)

    @app.errorhandler(Exception)
    def handle_unexpected_error(exc):
        app.logger.exception("Unhandled error", exc_info=exc)
        return error_response("Internal server error", status=500)
