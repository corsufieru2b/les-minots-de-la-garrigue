import { afterEach, describe, expect, it, vi } from "vitest";

import { sendQuoteRequestEmail } from "@/services/mail/quote-request-mailer";

import { POST } from "./route";

vi.mock("@/services/mail/quote-request-mailer", () => ({
  sendQuoteRequestEmail: vi.fn(),
}));

const mockedSendQuoteRequestEmail = vi.mocked(sendQuoteRequestEmail);

const validQuoteRequest = {
  name: "Client Test",
  company: "",
  phone: "04 23 14 32 61",
  email: "client@example.com",
  description: "Demande de devis traiteur pour un evenement professionnel.",
  honeypot: "",
};

function createQuoteRequest(body: unknown) {
  return new Request("http://localhost/api/quote-request", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/quote-request", () => {
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
});