import { beforeEach, describe, expect, it, vi } from "vitest";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));

vi.mock("../api/_lib/supabase", () => ({
  getServiceSupabase: () => ({ rpc }),
}));

import { enforceContactRateLimit } from "../api/_lib/rateLimit";
import { sanitizeText } from "../api/_lib/sanitize";
import { contactSchema } from "../api/_lib/validation";
import { ApiError } from "../api/_lib/http";

describe("contact validation", () => {
  it("accepts valid contact details and an empty honeypot", () => {
    expect(contactSchema.safeParse({
      name: "Adama",
      email: "adama@example.com",
      message: "Bonjour",
      website: "",
    }).success).toBe(true);
  });

  it("rejects malformed emails, overlong fields, and unknown properties", () => {
    const base = { name: "Adama", email: "invalid", message: "Bonjour" };
    expect(contactSchema.safeParse(base).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, email: "adama@example.com", role: "admin" }).success).toBe(false);
    expect(contactSchema.safeParse({
      name: "A".repeat(101),
      email: "adama@example.com",
      message: "Bonjour",
    }).success).toBe(false);
  });
});

describe("contact sanitization and rate limiting", () => {
  beforeEach(() => {
    vi.stubEnv("RATE_LIMIT_SECRET", "a-random-test-secret-that-is-long-enough");
    rpc.mockReset();
  });

  it("removes markup and control characters from stored text", () => {
    expect(sanitizeText("  <b>Hello</b>\u0000\nworld  ")).toBe("Hello\nworld");
  });

  it("uses a server-side hashed IP and rejects requests above the limit", async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    await expect(enforceContactRateLimit("203.0.113.8")).rejects.toMatchObject<ApiError>({
      status: 429,
    });
    expect(rpc).toHaveBeenCalledWith("consume_contact_rate_limit", expect.objectContaining({
      p_limit: 5,
      p_ip_hash: expect.not.stringContaining("203.0.113.8"),
    }));
  });

  it("surfaces rate-limit database failures instead of failing open", async () => {
    const databaseError = new Error("database unavailable");
    rpc.mockResolvedValue({ data: null, error: databaseError });
    await expect(enforceContactRateLimit("203.0.113.8")).rejects.toBe(databaseError);
  });
});
