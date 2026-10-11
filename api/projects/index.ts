import { applyCors, handleOptions } from "../_lib/cors.js";
import { requireAdmin } from "../_lib/auth.js";
import { ApiError, readJsonBody, sendApiError, sendJson, type ApiRequest, type ApiResponse } from "../_lib/http.js";
import { getServiceSupabase, type ProjectRow } from "../_lib/supabase.js";
import { createProjectSchema } from "../_lib/validation.js";

const publicProjectFields = "id,title,description,project_type,technologies,preview_type,url,accent";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  try {
    if (handleOptions(req, res)) return;
    if (!applyCors(req, res)) return;

    if (req.method === "GET") {
      const { data, error } = await getServiceSupabase()
        .from("projects")
        .select(publicProjectFields)
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      sendJson(res, 200, { projects: data });
      return;
    }

    if (req.method === "POST") {
      await requireAdmin(req);
      const parsed = createProjectSchema.safeParse(await readJsonBody(req, 16384));
      if (!parsed.success) throw new ApiError(400, "Please check the submitted project details.");

      const project: ProjectRow = {
        ...parsed.data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await getServiceSupabase()
        .from("projects")
        .insert(project)
        .select(publicProjectFields)
        .single();
      if (error) throw error;
      sendJson(res, 201, { project: data });
      return;
    }

    res.setHeader("Allow", "GET, POST, OPTIONS");
    throw new ApiError(405, "Method not allowed.");
  } catch (error) {
    sendApiError(res, error);
  }
}
