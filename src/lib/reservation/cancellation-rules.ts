import { RESTAURANT_PHONE_DISPLAY, getParisReservationDateTime } from "./reservation-rules";

const CANCELLATION_NOTICE_HOURS = 24;

export type CancellationRuleResult =
  | {
      ok: true;
      reservationDateTime: Date;
    }
  | {
      message: string;
      ok: false;
      reason: "INVALID_SLOT" | "INSUFFICIENT_NOTICE";
    };

export function validateReservationCancellationWindow({
  date,
  now = new Date(),
  time,
}: {
  date: string;
  now?: Date;
  time: string;
}): CancellationRuleResult {
  const reservationDateTime = getParisReservationDateTime(date, time);

  if (!reservationDateTime) {
    return {
      message: "Cette réservation ne peut pas être annulée en ligne.",
      ok: false,
      reason: "INVALID_SLOT",
    };
  }

  const noticeMs = reservationDateTime.getTime() - now.getTime();

  if (noticeMs < CANCELLATION_NOTICE_HOURS * 60 * 60 * 1000) {
    return {
      message: `L'annulation en ligne est possible jusqu'à 24 h avant l'horaire prévu. Merci de contacter directement le restaurant au ${RESTAURANT_PHONE_DISPLAY}.`,
      ok: false,
      reason: "INSUFFICIENT_NOTICE",
    };
  }

  return {
    ok: true,
    reservationDateTime,
  };
}