import time
from collections import deque, defaultdict

from flask import request


class InMemoryRateLimiter:
    def __init__(self, requests_per_minute: int = 120):
        self.requests_per_minute = requests_per_minute
        self.buckets = defaultdict(deque)

    def check(self, client_key: str) -> bool:
        now = time.time()
        window_start = now - 60
        bucket = self.buckets[client_key]

        while bucket and bucket[0] < window_start:
            bucket.popleft()

        if len(bucket) >= self.requests_per_minute:
            return False

        bucket.append(now)
        return True


def register_rate_limiter(app, requests_per_minute: int = 120):
    limiter = InMemoryRateLimiter(requests_per_minute=requests_per_minute)

    @app.before_request
    def enforce_rate_limit():
        if request.path in {"/", "/api/health"}:
            return None

        forwarded = request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
        remote = forwarded or request.remote_addr or "unknown"
        key = f"{remote}:{request.path}"

        if not limiter.check(key):
            from utils.responses import error_response

            return error_response("Rate limit exceeded. Please try again later.", status=429)

        return None
