export const PARIS_TIME_ZONE = "Europe/Paris";
export const RESTAURANT_PHONE_DISPLAY = "04 23 14 32 61";

export const LUNCH_RESERVATION_TIMES = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:15"] as const;
export const DINNER_RESERVATION_TIMES = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:15"] as const;

export const RESERVATION_TIMES = [...LUNCH_RESERVATION_TIMES, ...DINNER_RESERVATION_TIMES] as const;

export type ReservationTime = (typeof RESERVATION_TIMES)[number];

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type ParsedDate = {
  day: number;
  month: number;
  year: number;
};

type ParsedTime = {
  hour: number;
  minute: number;
};

export type ReservationRuleFailure =
  | "INVALID_DATE"
  | "INVALID_TIME"
  | "INVALID_GUESTS"
  | "CLOSED_DAY"
  | "UNAVAILABLE_TIME"
  | "INSUFFICIENT_NOTICE";

export type ReservationRuleResult =
  | {
      ok: true;
      requiredNoticeHours: number;
      reservationDateTime: Date;
    }
  | {
      message: string;
      ok: false;
      reason: ReservationRuleFailure;
      requiredNoticeHours?: number;
    };

export type ReservationSlotRequest = {
  date: string;
  guests: number;
  now?: Date;
  time: string;
};

export type AvailableReservationSlotsRequest = {
  date: string;
  guests?: number;
  now?: Date;
};

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: PARIS_TIME_ZONE,
  weekday: "short",
});

const parisPartsFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  timeZone: PARIS_TIME_ZONE,
  year: "numeric",
});

const weekdayIndexByName: Record<string, Weekday> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function getRequiredReservationNoticeHours(guests: number) {
  return guests >= 16 ? 48 : 24;
}

export function formatParisDateInputValue(now = new Date()) {
  const parts = getParisDateTimeParts(now);

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getParisReservationDateTime(date: string, time: string) {
  const parsedDate = parseDateInput(date);
  const parsedTime = parseTimeInput(time);

  if (!parsedDate || !parsedTime) {
    return null;
  }

  return createParisDateTime(parsedDate, parsedTime);
}

export function getReservationTimesForDate(date: string): ReservationTime[] {
  const weekday = getParisWeekdayForDateInput(date);

  if (weekday === null || weekday === 0 || weekday === 1) {
    return [];
  }

  if (weekday === 6) {
    return [...LUNCH_RESERVATION_TIMES];
  }

  return [...LUNCH_RESERVATION_TIMES, ...DINNER_RESERVATION_TIMES];
}

export function getAvailableReservationTimes({ date, guests, now = new Date() }: AvailableReservationSlotsRequest) {
  const times = getReservationTimesForDate(date);

  if (typeof guests !== "number" || !Number.isInteger(guests) || guests < 1) {
    return times;
  }

  return times.filter((time) => validateReservationSlot({ date, guests, now, time }).ok);
}

export function validateReservationSlot({ date, guests, now = new Date(), time }: ReservationSlotRequest): ReservationRuleResult {
  const parsedDate = parseDateInput(date);

  if (!parsedDate) {
    return {
      message: "Merci de choisir une date valide.",
      ok: false,
      reason: "INVALID_DATE",
    };
  }

  if (!Number.isInteger(guests) || guests < 1) {
    return {
      message: "Merci d'indiquer un nombre de personnes valide.",
      ok: false,
      reason: "INVALID_GUESTS",
    };
  }

  if (!isReservationTime(time)) {
    return {
      message: "Merci de choisir un horaire proposé.",
      ok: false,
      reason: "INVALID_TIME",
    };
  }

  const availableTimesForDay = getReservationTimesForDate(date);

  if (availableTimesForDay.length === 0) {
    return {
      message: "Ce jour n'est pas ouvert à la réservation en ligne.",
      ok: false,
      reason: "CLOSED_DAY",
    };
  }

  if (!availableTimesForDay.includes(time)) {
    return {
      message: "Ce créneau n'est pas disponible à la réservation en ligne.",
      ok: false,
      reason: "UNAVAILABLE_TIME",
    };
  }

  const parsedTime = parseTimeInput(time);

  if (!parsedTime) {
    return {
      message: "Merci de choisir un horaire proposé.",
      ok: false,
      reason: "INVALID_TIME",
    };
  }

  const requiredNoticeHours = getRequiredReservationNoticeHours(guests);
  const reservationDateTime = createParisDateTime(parsedDate, parsedTime);
  const noticeMs = reservationDateTime.getTime() - now.getTime();

  if (noticeMs < requiredNoticeHours * 60 * 60 * 1000) {
    return {
      message: `Une réservation en ligne nécessite ${requiredNoticeHours} h d'avance. Pour une demande plus proche, contactez directement le restaurant au ${RESTAURANT_PHONE_DISPLAY}.`,
      ok: false,
      reason: "INSUFFICIENT_NOTICE",
      requiredNoticeHours,
    };
  }

  return {
    ok: true,
    requiredNoticeHours,
    reservationDateTime,
  };
}

function isReservationTime(time: string): time is ReservationTime {
  return RESERVATION_TIMES.includes(time as ReservationTime);
}

function parseDateInput(date: string): ParsedDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    return null;
  }

  return { day, month, year };
}

function parseTimeInput(time: string): ParsedTime | null {
  const match = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(time);

  if (!match) {
    return null;
  }

  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
  };
}

function getParisWeekdayForDateInput(date: string): Weekday | null {
  const parsedDate = parseDateInput(date);

  if (!parsedDate) {
    return null;
  }

  const weekdayName = weekdayFormatter.format(
    new Date(Date.UTC(parsedDate.year, parsedDate.month - 1, parsedDate.day, 12)),
  );

  return weekdayIndexByName[weekdayName] ?? null;
}

function createParisDateTime(date: ParsedDate, time: ParsedTime) {
  const utcGuess = Date.UTC(date.year, date.month - 1, date.day, time.hour, time.minute);
  const offset = getParisOffsetMs(new Date(utcGuess));
  const utcTime = utcGuess - offset;
  const correctedOffset = getParisOffsetMs(new Date(utcTime));

  return new Date(utcGuess - correctedOffset);
}

function getParisOffsetMs(date: Date) {
  const parts = getParisDateTimeParts(date);
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );

  return asUtc - date.getTime();
}

function getParisDateTimeParts(date: Date) {
  const parts = Object.fromEntries(
    parisPartsFormatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return {
    day: parts.day ?? "01",
    hour: parts.hour ?? "00",
    minute: parts.minute ?? "00",
    month: parts.month ?? "01",
    second: parts.second ?? "00",
    year: parts.year ?? "1970",
  };
}