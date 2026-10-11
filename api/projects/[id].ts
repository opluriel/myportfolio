import { applyCors, handleOptions } from "../_lib/cors";
import { requireAdmin } from "../_lib/auth";
import { ApiError, readJsonBody, sendApiError, sendJson, type ApiRequest, type ApiResponse } from "../_lib/http";
import { getServiceSupabase } from "../_lib/supabase";
import { updateProjectSchema } from "../_lib/validation";

const publicProjectFields = "id,title,description,project_type,technologies,preview_type,url,accent";

function getProjectId(req: ApiRequest): string {
  const id = req.query?.id;
  if (typeof id !== "string" || !/^[a-z0-9-]{1,120}$/.test(id)) {
    throw new ApiError(400, "Invalid project identifier.");
  }
  return id;
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  try {
    if (handleOptions(req, res)) return;
    if (!applyCors(req, res)) return;
    const id = getProjectId(req);

    if (req.method === "GET") {
      const { data, error } = await getServiceSupabase()
        .from("projects")
        .select(publicProjectFields)
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new ApiError(404, "Project not found.");
      sendJson(res, 200, { project: data });
      return;
    }

    if (req.method === "PUT") {
      await requireAdmin(req);
      const parsed = updateProjectSchema.safeParse(await readJsonBody(req, 16384));
      if (!parsed.success) throw new ApiError(400, "Please check the submitted project details.");

      const { data, error } = await getServiceSupabase()
        .from("projects")
        .update({ ...parsed.data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(publicProjectFields)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new ApiError(404, "Project not found.");
      sendJson(res, 200, { project: data });
      return;
    }

    if (req.method === "DELETE") {
      await requireAdmin(req);
      const { data, error } = await getServiceSupabase()
        .from("projects")
        .delete()
        .eq("id", id)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new ApiError(404, "Project not found.");
      sendJson(res, 200, { ok: true });
      return;
    }

    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS");
    throw new ApiError(405, "Method not allowed.");
  } catch (error) {
    sendApiError(res, error);
  }
}
