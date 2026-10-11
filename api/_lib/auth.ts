import type { ApiRequest } from "./http.js";
import { ApiError } from "./http.js";
import { getAuthSupabase } from "./supabase.js";

export async function requireAdmin(req: ApiRequest): Promise<string> {
  const authorization = req.headers.authorization;
  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i);
  if (!match) throw new ApiError(401, "Authentication required.");

  const { data, error } = await getAuthSupabase().auth.getUser(match[1]);
  if (error || !data.user) throw new ApiError(401, "Authentication required.");

  const adminIds = process.env.ADMIN_USER_IDS?.split(",").map(id => id.trim()).filter(Boolean) ?? [];
  if (adminIds.length === 0) throw new Error("ADMIN_USER_IDS is not configured");
  if (!adminIds.includes(data.user.id)) throw new ApiError(403, "Administrator access required.");

  return data.user.id;
}
