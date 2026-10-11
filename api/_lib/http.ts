import type { IncomingMessage, ServerResponse } from "node:http";

export type ApiRequest = IncomingMessage & {
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
};

export type ApiResponse = ServerResponse;

export function sendJson(res: ApiResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export async function readJsonBody(req: ApiRequest, maxBytes: number): Promise<unknown> {
  if (req.body !== undefined) {
    const serialized = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(serialized, "utf8") > maxBytes) {
      throw new ApiError(413, "Request body too large");
    }
    try {
      return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch {
      throw new ApiError(400, "Invalid JSON body");
    }
  }

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBytes) {
      throw new ApiError(413, "Request body too large");
    }
    chunks.push(buffer);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new ApiError(400, "Invalid JSON body");
  }
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function sendApiError(res: ApiResponse, error: unknown): void {
  if (error instanceof ApiError) {
    sendJson(res, error.status, { error: error.message });
    return;
  }

  console.error("API operation failed", error instanceof Error ? error.name : "UnknownError");
  sendJson(res, 500, { error: "An unexpected error occurred." });
}
