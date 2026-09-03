import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import { sendQuoteRequestEmail } from "@/services/mail/quote-request-mailer";

import { POST } from "./route";

vi.mock("@/services/mail/quote-request-mailer", () => ({
  sendQuoteRequestEmail: vi.fn(),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  rateLimitExceededResponseMessage: () => "Trop de demandes ont été envoyées. Merci de réessayer dans quelques minutes.",
}));

vi.mock("@/lib/security/turnstile", () => ({
  turnstileErrorMessage: () => "La vérification anti-abus a échoué. Merci de réessayer.",
  verifyTurnstileToken: vi.fn(),
}));

const mockedSendQuoteRequestEmail = vi.mocked(sendQuoteRequestEmail);
const mockedCheckRateLimit = vi.mocked(checkRateLimit);
const mockedVerifyTurnstileToken = vi.mocked(verifyTurnstileToken);

const validQuoteRequest = {
  name: "Client Test",
  company: "",
  phone: "04 23 14 32 61",
  email: "client@example.com",
  description: "Demande de devis traiteur pour un evenement professionnel.",
  honeypot: "",
  turnstileToken: "turnstile_test_token",
};

function createQuoteRequest(body: unknown, headers: HeadersInit = { "Content-Type": "application/json" }) {
  return new Request("http://localhost/api/quote-request", {
    body: JSON.stringify(body),
    headers,
    method: "POST",
  });
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/quote-request", () => {
  beforeEach(() => {
    mockedCheckRateLimit.mockResolvedValue({ allowed: true, limit: 5 });
    mockedVerifyTurnstileToken.mockResolvedValue(true);
  });

  it("returns HTTP 200 only when Resend confirms delivery with data.id", async () => {
    mockedSendQuoteRequestEmail.mockResolvedValueOnce({ id: "email_123" });

    const response = await POST(createQuoteRequest(validQuoteRequest));
    const payload = (await response.json()) as { message?: string };

    expect(response.status).toBe(200);
    expect(payload).toEqual({ message: "Votre demande de devis a bien été envoyée." });
    expect(mockedSendQuoteRequestEmail).toHaveBeenCalledOnce();
  });

  it("does not return HTTP 200 when Resend returns an error", async () => {
    mockedSendQuoteRequestEmail.mockRejectedValueOnce(
      new Error("Quote request email delivery was rejected."),
    );

    const response = await POST(createQuoteRequest(validQuoteRequest));
    const payload = (await response.json()) as { message?: string };

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      message: "Votre demande n'a pas pu être envoyée. Merci de réessayer plus tard.",
    });
  });

  it("does not return HTTP 200 when Resend does not provide data.id", async () => {
    mockedSendQuoteRequestEmail.mockRejectedValueOnce(
      new Error("Quote request email delivery was rejected."),
    );

    const response = await POST(createQuoteRequest(validQuoteRequest));

    expect(response.status).toBe(500);
  });

  it("does not expose Resend error details in the client response", async () => {
    mockedSendQuoteRequestEmail.mockRejectedValueOnce(
      new Error("invalid_api_key: secret resend failure details"),
    );

    const response = await POST(createQuoteRequest(validQuoteRequest));
    const payload = (await response.json()) as { message?: string };

    expect(response.status).toBe(500);
    expect(payload.message).toBe("Votre demande n'a pas pu être envoyée. Merci de réessayer plus tard.");
    expect(JSON.stringify(payload)).not.toContain("invalid_api_key");
    expect(JSON.stringify(payload)).not.toContain("secret");
  });

  it("rejects a request with a non-json content type", async () => {
    const response = await POST(createQuoteRequest(validQuoteRequest, { "Content-Type": "text/plain" }));

    expect(response.status).toBe(415);
  });

  it("rejects a request that exceeds the content length limit", async () => {
    const response = await POST(createQuoteRequest(validQuoteRequest, {
      "Content-Length": "20001",
      "Content-Type": "application/json",
    }));

    expect(response.status).toBe(413);
  });

  it("rejects unknown business payload keys", async () => {
    const response = await POST(createQuoteRequest({ ...validQuoteRequest, admin: true }));

    expect(response.status).toBe(400);
    expect(mockedSendQuoteRequestEmail).not.toHaveBeenCalled();
  });

  it("rejects an invalid Turnstile token", async () => {
    mockedVerifyTurnstileToken.mockResolvedValueOnce(false);

    const response = await POST(createQuoteRequest(validQuoteRequest));

    expect(response.status).toBe(400);
    expect(mockedSendQuoteRequestEmail).not.toHaveBeenCalled();
  });

  it("rejects a request when the rate limit is exceeded", async () => {
    mockedCheckRateLimit.mockResolvedValueOnce({ allowed: false, limit: 5 });

    const response = await POST(createQuoteRequest(validQuoteRequest));

    expect(response.status).toBe(429);
    expect(mockedSendQuoteRequestEmail).not.toHaveBeenCalled();
  });
});