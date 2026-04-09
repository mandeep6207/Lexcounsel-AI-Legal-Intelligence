import type { ApiEnvelope } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000";
const cache = new Map<string, { expiresAt: number; value: unknown }>();
const CACHE_TTL_MS = 30_000;

async function parseResponse<T>(response: Response): Promise<T> {
  const envelope = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !envelope.success) {
    const message = envelope?.error?.message || "Request failed";
    throw new Error(message);
  }

  return envelope.data;
}

export async function apiGet<T>(path: string): Promise<T> {
  const cached = cache.get(path);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }

  const response = await fetch(`${API_BASE_URL}${path}`);
  const data = await parseResponse<T>(response);
  cache.set(path, { expiresAt: Date.now() + CACHE_TTL_MS, value: data });
  return data;
}

export async function apiPost<TResponse, TBody extends Record<string, unknown>>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return parseResponse<TResponse>(response);
}
