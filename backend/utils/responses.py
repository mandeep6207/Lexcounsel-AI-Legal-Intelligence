from flask import jsonify


def success_response(data, status=200, meta=None):
    payload = {
        "success": True,
        "data": data,
        "error": None,
    }
    if meta is not None:
        payload["meta"] = meta
    return jsonify(payload), status


def error_response(message, status=400, details=None):
    payload = {
        "success": False,
        "data": None,
        "error": {
            "message": message,
            "details": details,
        },
    }
    return jsonify(payload), status
