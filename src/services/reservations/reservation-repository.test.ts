import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock, singleMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  singleMock: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

const reservationInput = {
  comment: "Table calme si possible.",
  date: "2026-09-04",
  email: "client@example.com",
  guests: 4,
  name: "Client Test",
  phone: "04 23 14 32 61",
  time: "13:00",
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
  status: "confirmed",
};

async function importRepository() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test_service_role_key";

  return import("./reservation-repository");
}

beforeEach(() => {
  vi.resetModules();
  createClientMock.mockReset();
  singleMock.mockReset();
  createClientMock.mockReturnValue({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: singleMock,
        })),
      })),
    })),
  });
});

describe("createReservation", () => {
  it("stores a confirmed reservation in Supabase", async () => {
    singleMock.mockResolvedValueOnce({ data: reservationRecord, error: null });

    const { createReservation } = await importRepository();

    await expect(createReservation(reservationInput, "token_hash")).resolves.toEqual(reservationRecord);
  });

  it("throws a generic error when Supabase insertion fails", async () => {
    singleMock.mockResolvedValueOnce({ data: null, error: { message: "Sensitive Supabase detail" } });

    const { createReservation } = await importRepository();

    await expect(createReservation(reservationInput, "token_hash")).rejects.toThrow("Reservation persistence failed.");
  });
});