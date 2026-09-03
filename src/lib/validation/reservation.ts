import { z } from "zod";

import { validateReservationSlot } from "@/lib/reservation/reservation-rules";

const COMMENT_MAX_LENGTH = 5000;

const requiredText = (message: string, maxLength: number) =>
  z.string().trim().min(1, message).max(maxLength, "Ce champ est trop long.");

const guestCountSchema = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      return value.trim() === "" ? value : Number(value);
    }

    return value;
  },
  z.number().int("Le nombre de personnes doit être un nombre entier.").min(1, "Le nombre de personnes est obligatoire."),
);

export const reservationRequestSchema = z
  .object({
    comment: z.string().trim().max(COMMENT_MAX_LENGTH, "Ce champ est trop long.").optional(),
    date: requiredText("La date est obligatoire.", 10),
    email: requiredText("L'email est obligatoire.", 254).email("L'email doit être valide."),
    guests: guestCountSchema,
    name: requiredText("Le nom est obligatoire.", 120),
    phone: requiredText("Le téléphone est obligatoire.", 30),
    time: requiredText("L'heure est obligatoire.", 5),
  })
  .strict();

export type ReservationRequestInput = z.infer<typeof reservationRequestSchema>;
export type ReservationRequestErrors = Partial<Record<keyof ReservationRequestInput, string>>;

export function validateReservationRequest(input: unknown, now = new Date()) {
  const result = reservationRequestSchema.safeParse(input);

  if (!result.success) {
    const errors: ReservationRequestErrors = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0];

      if (typeof field === "string" && field in reservationRequestSchema.shape) {
        const key = field as keyof ReservationRequestInput;
        errors[key] ??= issue.message;
      }
    }

    return { data: null, errors } as const;
  }

  const slotValidation = validateReservationSlot({
    date: result.data.date,
    guests: result.data.guests,
    now,
    time: result.data.time,
  });

  if (!slotValidation.ok) {
    const errors: ReservationRequestErrors = {
      time: slotValidation.message,
    };

    if (slotValidation.reason === "CLOSED_DAY") {
      errors.date = slotValidation.message;
    }

    if (slotValidation.reason === "INVALID_GUESTS") {
      errors.guests = slotValidation.message;
    }

    return { data: null, errors } as const;
  }

  return { data: result.data, errors: null } as const;
}