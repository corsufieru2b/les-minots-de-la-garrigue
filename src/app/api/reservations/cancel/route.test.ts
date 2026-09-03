import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit } from "@/lib/security/rate-limit";
import { sendReservationCancellationEmails } from "@/services/mail/reservation-mailer";
import {
  cancelReservationByCancellationTokenHash,
  findReservationByCancellationTokenHash,
} from "@/services/reservations/reservation-repository";

import { POST } from "./route";

vi.mock("@/services/reservations/reservation-repository", () => ({
  cancelReservationByCancellationTokenHash: vi.fn(),
  findReservationByCancellationTokenHash: vi.fn(),
}));

vi.mock("@/services/mail/reservation-mailer", () => ({
  sendReservationCancellationEmails: vi.fn(),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  rateLimitExceededResponseMessage: () => "Trop de demandes ont été envoyées. Merci de réessayer dans quelques minutes.",
}));

const mockedFindReservation = vi.mocked(findReservationByCancellationTokenHash);
const mockedCancelReservation = vi.mocked(cancelReservationByCancellationTokenHash);
const mockedSendCancellationEmails = vi.mocked(sendReservationCancellationEmails);
const mockedCheckRateLimit = vi.mocked(checkRateLimit);

const token = "secure_cancellation_token_with_enough_length";
const confirmedReservation = {
  cancellation_token_hash: "token_hash",
  cancelled_at: null,
  comment: null,
  created_at: "2026-09-03T10:00:00.000Z",
  email: "client@example.com",
  id: "3b06ed61-c6fd-4fc7-b198-b5ccde27d7af",
  name: "Client Test",
  party_size: 4,
  phone: "04 23 14 32 61",
  reservation_date: "2026-09-04",
  reservation_time: "20:00",
  status: "confirmed" as const,
};
const cancelledReservation = {
  ...confirmedReservation,
  cancelled_at: "2026-09-03T12:00:00.000Z",
  status: "cancelled" as const,
};

function createRequest(body: unknown, headers: HeadersInit = { "Content-Type": "application/json" }) {
  return new Request("http://localhost/api/reservations/cancel", {
    body: JSON.stringify(body),
    headers,
    method: "POST",
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-03T17:59:00.000Z"));
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  mockedCheckRateLimit.mockResolvedValue({ allowed: true, limit: 20 });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("POST /api/reservations/cancel", () => {
  it("cancels a reservation with a valid token and more than 24 hours notice", async () => {
    mockedFindReservation.mockResolvedValueOnce(confirmedReservation);
    mockedCancelReservation.mockResolvedValueOnce(cancelledReservation);
    mockedSendCancellationEmails.mockResolvedValueOnce(undefined);

    const response = await POST(createRequest({ token }));
    const payload = (await response.json()) as { message?: string };

    expect(response.status).toBe(200);
    expect(payload).toEqual({ message: "Votre réservation a bien été annulée." });
    expect(mockedCancelReservation).toHaveBeenCalledWith(expect.any(String));
  });

  it("rejects an invalid token", async () => {
    mockedFindReservation.mockResolvedValueOnce(null);

    const response = await POST(createRequest({ token }));

    expect(response.status).toBe(404);
    expect(mockedCancelReservation).not.toHaveBeenCalled();
  });

  it("rejects an absent token", async () => {
    const response = await POST(createRequest({}));

    expect(response.status).toBe(400);
    expect(mockedFindReservation).not.toHaveBeenCalled();
  });

  it("returns an appropriate response for an already cancelled reservation", async () => {
    mockedFindReservation.mockResolvedValueOnce(cancelledReservation);

    const response = await POST(createRequest({ token }));
    const payload = (await response.json()) as { message?: string };

    expect(response.status).toBe(409);
    expect(payload.message).toBe("Cette réservation est déjà annulée.");
    expect(mockedCancelReservation).not.toHaveBeenCalled();
  });

  it("allows cancellation exactly at the authorized limit", async () => {
    vi.setSystemTime(new Date("2026-09-03T18:00:00.000Z"));
    mockedFindReservation.mockResolvedValueOnce(confirmedReservation);
    mockedCancelReservation.mockResolvedValueOnce(cancelledReservation);
    mockedSendCancellationEmails.mockResolvedValueOnce(undefined);

    const response = await POST(createRequest({ token }));

    expect(response.status).toBe(200);
  });

  it("rejects cancellation with less than 24 hours notice", async () => {
    vi.setSystemTime(new Date("2026-09-03T18:01:00.000Z"));
    mockedFindReservation.mockResolvedValueOnce(confirmedReservation);

    const response = await POST(createRequest({ token }));

    expect(response.status).toBe(409);
    expect(mockedCancelReservation).not.toHaveBeenCalled();
  });

  it("returns a generic error when the Supabase update fails", async () => {
    mockedFindReservation.mockResolvedValueOnce(confirmedReservation);
    mockedCancelReservation.mockRejectedValueOnce(new Error("Supabase sensitive detail"));

    const response = await POST(createRequest({ token }));
    const payload = (await response.json()) as { message?: string };

    expect(response.status).toBe(500);
    expect(payload.message).toBe("L'annulation n'a pas pu être effectuée. Merci de réessayer plus tard.");
  });

  it("keeps the reservation cancelled when cancellation emails fail", async () => {
    mockedFindReservation.mockResolvedValueOnce(confirmedReservation);
    mockedCancelReservation.mockResolvedValueOnce(cancelledReservation);
    mockedSendCancellationEmails.mockRejectedValueOnce(new Error("Resend sensitive detail"));

    const response = await POST(createRequest({ token }));

    expect(response.status).toBe(200);
    expect(mockedCancelReservation).toHaveBeenCalledBefore(mockedSendCancellationEmails);
  });

  it("keeps the reservation cancelled when the customer cancellation email fails", async () => {
    mockedFindReservation.mockResolvedValueOnce(confirmedReservation);
    mockedCancelReservation.mockResolvedValueOnce(cancelledReservation);
    mockedSendCancellationEmails.mockRejectedValueOnce(new Error("customer email failed"));

    const response = await POST(createRequest({ token }));

    expect(response.status).toBe(200);
    expect(mockedCancelReservation).toHaveBeenCalledOnce();
  });

  it("keeps the reservation cancelled when the restaurant cancellation email fails", async () => {
    mockedFindReservation.mockResolvedValueOnce(confirmedReservation);
    mockedCancelReservation.mockResolvedValueOnce(cancelledReservation);
    mockedSendCancellationEmails.mockRejectedValueOnce(new Error("restaurant email failed"));

    const response = await POST(createRequest({ token }));

    expect(response.status).toBe(200);
    expect(mockedCancelReservation).toHaveBeenCalledOnce();
  });

  it("does not leak secrets or raw tokens in the client response", async () => {
    mockedFindReservation.mockRejectedValueOnce(new Error("service_role raw token secret detail"));

    const response = await POST(createRequest({ token }));
    const payload = (await response.json()) as { message?: string };
    const serializedPayload = JSON.stringify(payload);

    expect(response.status).toBe(500);
    expect(serializedPayload).not.toContain("service_role");
    expect(serializedPayload).not.toContain(token);
    expect(serializedPayload).not.toContain("secret detail");
  });

  it("does not allow an arbitrary id to choose a reservation to cancel", async () => {
    const response = await POST(createRequest({ id: confirmedReservation.id, token }));

    expect(response.status).toBe(400);
    expect(mockedFindReservation).not.toHaveBeenCalled();
    expect(mockedCancelReservation).not.toHaveBeenCalled();
  });

  it("rejects a request with a non-json content type", async () => {
    const response = await POST(createRequest({ token }, { "Content-Type": "text/plain" }));

    expect(response.status).toBe(415);
  });

  it("rejects a request that exceeds the content length limit", async () => {
    const response = await POST(createRequest({ token }, {
      "Content-Length": "2001",
      "Content-Type": "application/json",
    }));

    expect(response.status).toBe(413);
  });

  it("rejects a request when the rate limit is exceeded", async () => {
    mockedCheckRateLimit.mockResolvedValueOnce({ allowed: false, limit: 20 });

    const response = await POST(createRequest({ token }));

    expect(response.status).toBe(429);
    expect(mockedFindReservation).not.toHaveBeenCalled();
  });
});