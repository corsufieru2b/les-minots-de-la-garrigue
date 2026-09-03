import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import { sendReservationEmails } from "@/services/mail/reservation-mailer";
import { createReservation } from "@/services/reservations/reservation-repository";

import { POST } from "./route";

vi.mock("@/services/reservations/reservation-repository", () => ({
  createReservation: vi.fn(),
}));

vi.mock("@/services/mail/reservation-mailer", () => ({
  sendReservationEmails: vi.fn(),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  rateLimitExceededResponseMessage: () => "Trop de demandes ont été envoyées. Merci de réessayer dans quelques minutes.",
}));

vi.mock("@/lib/security/turnstile", () => ({
  turnstileErrorMessage: () => "La vérification anti-abus a échoué. Merci de réessayer.",
  verifyTurnstileToken: vi.fn(),
}));

const mockedCreateReservation = vi.mocked(createReservation);
const mockedSendReservationEmails = vi.mocked(sendReservationEmails);
const mockedCheckRateLimit = vi.mocked(checkRateLimit);
const mockedVerifyTurnstileToken = vi.mocked(verifyTurnstileToken);

const validPayload = {
  comment: "Table calme si possible.",
  date: "2026-09-04",
  email: "client@example.com",
  guests: 4,
  name: "Client Test",
  phone: "04 23 14 32 61",
  time: "13:00",
  turnstileToken: "turnstile_test_token",
};

const reservationRecord = {
  cancellation_token_hash: "token_hash",
  cancelled_at: null,
  comment: "Table calme si possible.",
  created_at: "2026-09-03T10:00:00.000Z",
  email: "client@example.com",
  id: "3b06ed61-c6fd-4fc7-b198-b5ccde27d7af",
  name: "Client Test",
  party_size: 4,
  phone: "04 23 14 32 61",
  reservation_date: "2026-09-04",
  reservation_time: "13:00",
  status: "confirmed" as const,
};

function createRequest(body: unknown, headers: HeadersInit = { "Content-Type": "application/json" }) {
  return new Request("http://localhost/api/reservations", {
    body: JSON.stringify(body),
    headers,
    method: "POST",
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-02T10:00:00.000Z"));
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  mockedCheckRateLimit.mockResolvedValue({ allowed: true, limit: 8 });
  mockedVerifyTurnstileToken.mockResolvedValue(true);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("POST /api/reservations", () => {
  it("creates a valid reservation and returns HTTP 200", async () => {
    mockedCreateReservation.mockResolvedValueOnce(reservationRecord);
    mockedSendReservationEmails.mockResolvedValueOnce(undefined);

    const response = await POST(createRequest(validPayload));
    const payload = (await response.json()) as { message?: string };

    expect(response.status).toBe(200);
    expect(payload).toEqual({ message: "Votre réservation a bien été prise en compte." });
    expect(mockedCreateReservation).toHaveBeenCalledWith(
      expect.objectContaining({ email: validPayload.email, time: validPayload.time }),
      expect.any(String),
    );
    expect(mockedSendReservationEmails).toHaveBeenCalledWith({
      cancellationToken: expect.any(String),
      receivedAt: expect.any(Date),
      reservation: reservationRecord,
    });
  });

  it("rejects an invalid payload", async () => {
    const response = await POST(createRequest({ ...validPayload, email: "invalid" }));

    expect(response.status).toBe(400);
    expect(mockedCreateReservation).not.toHaveBeenCalled();
    expect(mockedSendReservationEmails).not.toHaveBeenCalled();
  });

  it("rejects a closed day sent directly to the API", async () => {
    const response = await POST(createRequest({ ...validPayload, date: "2026-09-07" }));

    expect(response.status).toBe(400);
    expect(mockedCreateReservation).not.toHaveBeenCalled();
  });

  it("rejects an invalid time sent directly to the API", async () => {
    const response = await POST(createRequest({ ...validPayload, time: "18:00" }));

    expect(response.status).toBe(400);
    expect(mockedCreateReservation).not.toHaveBeenCalled();
  });

  it("rejects a 1-15 guests reservation with less than 24 hours notice", async () => {
    const response = await POST(createRequest({ ...validPayload, date: "2026-09-02", time: "20:00" }));

    expect(response.status).toBe(400);
    expect(mockedCreateReservation).not.toHaveBeenCalled();
  });

  it("rejects a 16+ guests reservation with less than 48 hours notice", async () => {
    const response = await POST(createRequest({ ...validPayload, date: "2026-09-03", guests: 16, time: "20:00" }));

    expect(response.status).toBe(400);
    expect(mockedCreateReservation).not.toHaveBeenCalled();
  });

  it("returns HTTP 500 when Supabase persistence fails", async () => {
    mockedCreateReservation.mockRejectedValueOnce(new Error("Supabase sensitive failure detail"));

    const response = await POST(createRequest(validPayload));
    const payload = (await response.json()) as { message?: string };

    expect(response.status).toBe(500);
    expect(payload.message).toBe("Votre réservation n'a pas pu être envoyée. Merci de réessayer plus tard.");
    expect(mockedSendReservationEmails).not.toHaveBeenCalled();
  });

  it("returns HTTP 500 when Resend rejects the reservation emails", async () => {
    mockedCreateReservation.mockResolvedValueOnce(reservationRecord);
    mockedSendReservationEmails.mockRejectedValueOnce(new Error("invalid_api_key: secret resend detail"));

    const response = await POST(createRequest(validPayload));
    const payload = (await response.json()) as { message?: string };

    expect(response.status).toBe(500);
    expect(payload.message).toBe("Votre réservation n'a pas pu être envoyée. Merci de réessayer plus tard.");
  });

  it("does not leak sensitive provider details in the client response", async () => {
    mockedCreateReservation.mockRejectedValueOnce(new Error("SUPABASE_SERVICE_ROLE_KEY secret detail"));

    const response = await POST(createRequest(validPayload));
    const payload = (await response.json()) as { message?: string };
    const serializedPayload = JSON.stringify(payload);

    expect(response.status).toBe(500);
    expect(serializedPayload).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(serializedPayload).not.toContain("secret detail");
  });

  it("rejects a request with a non-json content type", async () => {
    const response = await POST(createRequest(validPayload, { "Content-Type": "text/plain" }));

    expect(response.status).toBe(415);
  });

  it("rejects a request that exceeds the content length limit", async () => {
    const response = await POST(createRequest(validPayload, {
      "Content-Length": "20001",
      "Content-Type": "application/json",
    }));

    expect(response.status).toBe(413);
  });

  it("rejects unknown payload keys", async () => {
    const response = await POST(createRequest({ ...validPayload, reservationId: "forged-id" }));

    expect(response.status).toBe(400);
    expect(mockedCreateReservation).not.toHaveBeenCalled();
  });

  it("rejects an invalid Turnstile token", async () => {
    mockedVerifyTurnstileToken.mockResolvedValueOnce(false);

    const response = await POST(createRequest(validPayload));

    expect(response.status).toBe(400);
    expect(mockedCreateReservation).not.toHaveBeenCalled();
  });

  it("rejects a request when the rate limit is exceeded", async () => {
    mockedCheckRateLimit.mockResolvedValueOnce({ allowed: false, limit: 8 });

    const response = await POST(createRequest(validPayload));

    expect(response.status).toBe(429);
    expect(mockedCreateReservation).not.toHaveBeenCalled();
  });
});