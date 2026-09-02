import { beforeEach, describe, expect, it, vi } from "vitest";

const { resendSendMock } = vi.hoisted(() => ({
  resendSendMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: vi.fn(function Resend() {
    return {
      emails: {
        send: resendSendMock,
      },
    };
  }),
}));

const validPayload = {
  name: "Client Test",
  company: "",
  phone: "04 23 14 32 61",
  email: "client@example.com",
  description: "Demande de devis traiteur pour un evenement professionnel.",
  receivedAt: new Date("2026-09-02T16:39:00.000Z"),
};

async function importMailer() {
  process.env.RESEND_API_KEY = "test_resend_key";
  process.env.RESEND_FROM_EMAIL = "Les Minots de la Garrigue <test@example.com>";
  process.env.QUOTE_REQUEST_RECIPIENT_EMAIL = "recipient@example.com";

  return import("./quote-request-mailer");
}

beforeEach(() => {
  vi.resetModules();
  resendSendMock.mockReset();
});

describe("sendQuoteRequestEmail", () => {
  it("returns Resend data when the response includes data.id", async () => {
    resendSendMock.mockResolvedValueOnce({ data: { id: "email_123" }, error: null });

    const { sendQuoteRequestEmail } = await importMailer();

    await expect(sendQuoteRequestEmail(validPayload)).resolves.toEqual({ id: "email_123" });
  });

  it("throws a generic application error when Resend returns an error", async () => {
    resendSendMock.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_key", message: "Sensitive provider detail", statusCode: 401 },
    });

    const { sendQuoteRequestEmail } = await importMailer();

    await expect(sendQuoteRequestEmail(validPayload)).rejects.toThrow(
      "Quote request email delivery was rejected.",
    );
  });

  it("throws a generic application error when Resend does not provide data.id", async () => {
    resendSendMock.mockResolvedValueOnce({ data: {}, error: null });

    const { sendQuoteRequestEmail } = await importMailer();

    await expect(sendQuoteRequestEmail(validPayload)).rejects.toThrow(
      "Quote request email delivery was rejected.",
    );
  });
});