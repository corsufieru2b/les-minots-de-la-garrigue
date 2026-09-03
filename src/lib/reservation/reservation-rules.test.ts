import { describe, expect, it } from "vitest";

import {
  getReservationTimesForDate,
  validateReservationSlot,
} from "./reservation-rules";

const now = new Date("2026-09-02T10:00:00.000Z");

describe("reservation rules", () => {
  it("refuses Monday", () => {
    const result = validateReservationSlot({ date: "2026-09-07", guests: 2, now, time: "12:00" });

    expect(result).toMatchObject({ ok: false, reason: "CLOSED_DAY" });
  });

  it("refuses Sunday", () => {
    const result = validateReservationSlot({ date: "2026-09-06", guests: 2, now, time: "12:00" });

    expect(result).toMatchObject({ ok: false, reason: "CLOSED_DAY" });
  });

  it("accepts Tuesday lunch", () => {
    const result = validateReservationSlot({ date: "2026-09-08", guests: 2, now, time: "12:00" });

    expect(result.ok).toBe(true);
  });

  it("accepts Friday dinner", () => {
    const result = validateReservationSlot({ date: "2026-09-04", guests: 2, now, time: "20:30" });

    expect(result.ok).toBe(true);
  });

  it("accepts Saturday lunch", () => {
    const result = validateReservationSlot({ date: "2026-09-05", guests: 2, now, time: "13:00" });

    expect(result.ok).toBe(true);
  });

  it("refuses Saturday dinner", () => {
    const result = validateReservationSlot({ date: "2026-09-05", guests: 2, now, time: "19:00" });

    expect(result).toMatchObject({ ok: false, reason: "UNAVAILABLE_TIME" });
  });

  it("refuses a time slot that does not exist", () => {
    const result = validateReservationSlot({ date: "2026-09-04", guests: 2, now, time: "18:00" });

    expect(result).toMatchObject({ ok: false, reason: "INVALID_TIME" });
  });

  it("refuses a 1-15 guests reservation with less than 24 hours notice", () => {
    const result = validateReservationSlot({ date: "2026-09-02", guests: 15, now, time: "20:00" });

    expect(result).toMatchObject({ ok: false, reason: "INSUFFICIENT_NOTICE", requiredNoticeHours: 24 });
  });

  it("accepts a 1-15 guests reservation with more than 24 hours notice", () => {
    const result = validateReservationSlot({ date: "2026-09-03", guests: 15, now, time: "12:30" });

    expect(result.ok).toBe(true);
  });

  it("refuses a 16+ guests reservation with less than 48 hours notice", () => {
    const result = validateReservationSlot({ date: "2026-09-03", guests: 16, now, time: "20:00" });

    expect(result).toMatchObject({ ok: false, reason: "INSUFFICIENT_NOTICE", requiredNoticeHours: 48 });
  });

  it("accepts a 16+ guests reservation with more than 48 hours notice", () => {
    const result = validateReservationSlot({ date: "2026-09-04", guests: 16, now, time: "13:00" });

    expect(result.ok).toBe(true);
  });

  it("updates availability correctly around a day change", () => {
    expect(getReservationTimesForDate("2026-09-04")).toContain("19:00");
    expect(getReservationTimesForDate("2026-09-05")).not.toContain("19:00");
  });

  it("uses Europe/Paris when calculating the real slot date and time", () => {
    const nearParisDinner = new Date("2026-09-02T17:30:00.000Z");
    const result = validateReservationSlot({
      date: "2026-09-03",
      guests: 2,
      now: nearParisDinner,
      time: "19:00",
    });

    expect(result).toMatchObject({ ok: false, reason: "INSUFFICIENT_NOTICE" });
  });
});