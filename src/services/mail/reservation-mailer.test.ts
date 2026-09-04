import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ReservationRecord } from "@/services/reservations/reservation-repository";

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

const reservation: ReservationRecord = {
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

async function importMailer() {
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
  process.env.RESEND_API_KEY = "test_resend_key";
  process.env.RESEND_FROM_EMAIL = "Les Minots de la Garrigue <test@example.com>";
  process.env.RESERVATIONS_RECIPIENT_EMAIL = "restaurant@example.com";

  return import("./reservation-mailer");
}

beforeEach(() => {
  vi.resetModules();
  resendSendMock.mockReset();
});

describe("sendReservationEmails", () => {
  it("sends the customer and restaurant emails when Resend returns data.id", async () => {
    resendSendMock
      .mockResolvedValueOnce({ data: { id: "email_customer" }, error: null })
      .mockResolvedValueOnce({ data: { id: "email_restaurant" }, error: null });

    const { sendReservationEmails } = await importMailer();

    await expect(sendReservationEmails({
      cancellationToken: "raw_cancellation_token",
      receivedAt: new Date("2026-09-03T10:00:00.000Z"),
      reservation,
    })).resolves.toBeUndefined();
    expect(resendSendMock).toHaveBeenCalledTimes(2);
  });

  it("throws a generic error when Resend returns an error", async () => {
    resendSendMock.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_key", message: "Sensitive provider detail", statusCode: 401 },
    });

    const { sendReservationEmails } = await importMailer();

    await expect(sendReservationEmails({
      cancellationToken: "raw_cancellation_token",
      receivedAt: new Date("2026-09-03T10:00:00.000Z"),
      reservation,
    })).rejects.toThrow(
      "Reservation email delivery was rejected.",
    );
  });

  it("throws a generic error when Resend does not return data.id", async () => {
    resendSendMock.mockResolvedValueOnce({ data: {}, error: null });

    const { sendReservationEmails } = await importMailer();

    await expect(sendReservationEmails({
      cancellationToken: "raw_cancellation_token",
      receivedAt: new Date("2026-09-03T10:00:00.000Z"),
      reservation,
    })).rejects.toThrow(
      "Reservation email delivery was rejected.",
    );
  });

  it("throws a generic error when the customer cancellation email fails", async () => {
    resendSendMock.mockResolvedValueOnce({
      data: null,
      error: { name: "application_error", message: "Sensitive provider detail", statusCode: 500 },
    });

    const { sendReservationCancellationEmails } = await importMailer();

    await expect(sendReservationCancellationEmails({ reservation })).rejects.toThrow(
      "Reservation email delivery was rejected.",
    );
    expect(resendSendMock).toHaveBeenCalledTimes(1);
  });

  it("throws a generic error when the restaurant cancellation email fails", async () => {
    resendSendMock
      .mockResolvedValueOnce({ data: { id: "email_customer_cancelled" }, error: null })
      .mockResolvedValueOnce({ data: {}, error: null });

    const { sendReservationCancellationEmails } = await importMailer();

    await expect(sendReservationCancellationEmails({ reservation })).rejects.toThrow(
      "Reservation email delivery was rejected.",
    );
    expect(resendSendMock).toHaveBeenCalledTimes(2);
  });
});