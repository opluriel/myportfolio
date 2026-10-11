import type { ApiRequest, ApiResponse } from "./http";
import { sendJson } from "./http";

function allowedOrigins(): Set<string> {
  const configured = process.env.CORS_ORIGINS;
  if (!configured) {
    throw new Error("CORS_ORIGINS is not configured");
  }

  const origins = configured.split(",").map(origin => origin.trim()).filter(Boolean);
  if (origins.length === 0 || origins.some(origin => origin === "*" || !isOrigin(origin))) {
    throw new Error("CORS_ORIGINS contains an invalid origin");
  }
  return new Set(origins);
}

function isOrigin(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && url.origin === value;
  } catch {
    return false;
  }
}

export function applyCors(req: ApiRequest, res: ApiResponse): boolean {
  const origin = req.headers.origin;
  const origins = allowedOrigins();
  res.setHeader("Vary", "Origin");

  if (origin && !origins.has(origin)) {
    sendJson(res, 403, { error: "Origin not allowed." });
    return false;
  }
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Max-Age", "600");
  return true;
}

export function handleOptions(req: ApiRequest, res: ApiResponse): boolean {
  if (req.method !== "OPTIONS") return false;
  if (applyCors(req, res)) {
    res.statusCode = 204;
    res.end();
  }
  return true;
}
