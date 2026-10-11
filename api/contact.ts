import { Resend } from "resend";
import { applyCors, handleOptions } from "./_lib/cors.js";
import { ApiError, readJsonBody, sendApiError, sendJson, type ApiRequest, type ApiResponse } from "./_lib/http.js";
import { getClientIp, enforceContactRateLimit } from "./_lib/rateLimit.js";
import { escapeHtml, sanitizeText } from "./_lib/sanitize.js";
import { getServiceSupabase } from "./_lib/supabase.js";
import { contactSchema } from "./_lib/validation.js";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  try {
    if (handleOptions(req, res)) return;
    if (!applyCors(req, res)) return;
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST, OPTIONS");
      throw new ApiError(405, "Method not allowed.");
    }

    await enforceContactRateLimit(getClientIp(req.headers));
    const body = await readJsonBody(req, 8192);
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError(400, "Please check the submitted contact details.");
    }

    const name = sanitizeText(parsed.data.name);
    const email = sanitizeText(parsed.data.email);
    const message = sanitizeText(parsed.data.message);
    if (!name || !email || !message) {
      throw new ApiError(400, "Please check the submitted contact details.");
    }
    if (parsed.data.website) {
      sendJson(res, 200, { ok: true });
      return;
    }

    const { error: insertError } = await getServiceSupabase()
      .from("messages")
      .insert({ name, email, message });
    if (insertError) throw insertError;

    const resend = new Resend(requiredEnv("RESEND_API_KEY"));
    const { error: emailError } = await resend.emails.send({
      from: requiredEnv("EMAIL_FROM"),
      to: requiredEnv("CONTACT_TO_EMAIL"),
      replyTo: email,
      subject: `Portfolio contact message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    });
    if (emailError) {
      console.error("Contact notification delivery failed", emailError.name);
      throw new ApiError(503, "Your message could not be delivered. Please try again later.");
    }

    sendJson(res, 201, { ok: true });
  } catch (error) {
    sendApiError(res, error);
  }
}
