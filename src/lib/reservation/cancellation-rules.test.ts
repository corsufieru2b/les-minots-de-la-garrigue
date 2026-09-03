import { describe, expect, it } from "vitest";

import { validateReservationCancellationWindow } from "./cancellation-rules";

describe("cancellation rules", () => {
  it("allows cancellation with more than 24 hours notice", () => {
    const result = validateReservationCancellationWindow({
      date: "2026-09-04",
      now: new Date("2026-09-03T17:59:00.000Z"),
      time: "20:00",
    });

    expect(result.ok).toBe(true);
  });

  it("allows cancellation when Supabase returns the time as HH:MM:SS", () => {
    const result = validateReservationCancellationWindow({
      date: "2026-09-08",
      now: new Date("2026-09-03T10:00:00.000Z"),
      time: "13:30:00",
    });

    expect(result.ok).toBe(true);
  });

  it("keeps accepting cancellation times formatted as HH:MM", () => {
    const result = validateReservationCancellationWindow({
      date: "2026-09-08",
      now: new Date("2026-09-03T10:00:00.000Z"),
      time: "13:30",
    });

    expect(result.ok).toBe(true);
  });

  it("allows cancellation exactly at the 24 hour limit", () => {
    const result = validateReservationCancellationWindow({
      date: "2026-09-04",
      now: new Date("2026-09-03T18:00:00.000Z"),
      time: "20:00",
    });

    expect(result.ok).toBe(true);
  });

  it("refuses cancellation with less than 24 hours notice", () => {
    const result = validateReservationCancellationWindow({
      date: "2026-09-04",
      now: new Date("2026-09-03T18:01:00.000Z"),
      time: "20:00",
    });

    expect(result).toMatchObject({ ok: false, reason: "INSUFFICIENT_NOTICE" });
  });

  it("uses Europe/Paris for the cancellation window", () => {
    const authorizedFromParisTime = validateReservationCancellationWindow({
      date: "2026-09-04",
      now: new Date("2026-09-03T17:59:00.000Z"),
      time: "20:00",
    });
    const refusedFromParisTime = validateReservationCancellationWindow({
      date: "2026-09-04",
      now: new Date("2026-09-03T18:01:00.000Z"),
      time: "20:00",
    });

    expect(authorizedFromParisTime.ok).toBe(true);
    expect(refusedFromParisTime).toMatchObject({ ok: false, reason: "INSUFFICIENT_NOTICE" });
  });
});