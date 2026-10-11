import { createHmac } from "node:crypto";
import { ApiError } from "./http.js";
import { getServiceSupabase } from "./supabase.js";

const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

export async function enforceContactRateLimit(ip: string): Promise<void> {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("RATE_LIMIT_SECRET must contain at least 32 characters");
  }

  const ipHash = createHmac("sha256", secret).update(ip).digest("hex");
  const windowStart = new Date(Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS).toISOString();
  const { data, error } = await getServiceSupabase().rpc("consume_contact_rate_limit", {
    p_ip_hash: ipHash,
    p_window_start: windowStart,
    p_limit: LIMIT,
  });
  if (error) throw error;
  if (!data) throw new ApiError(429, "Too many requests. Please try again later.");
}

export function getClientIp(headers: ApiRequestHeaders): string {
  const realIp = headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) return realIp.trim();

  const forwarded = headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) return forwarded.split(",")[0].trim();
  throw new ApiError(400, "Unable to determine client address.");
}

type ApiRequestHeaders = Record<string, string | string[] | undefined>;
