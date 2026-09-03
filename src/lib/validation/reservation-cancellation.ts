import { z } from "zod";

export const reservationCancellationSchema = z
  .object({
    token: z.string().trim().min(32, "Le lien d'annulation est invalide.").max(256, "Le lien d'annulation est invalide."),
  })
  .strict();

export function validateReservationCancellationRequest(input: unknown) {
  const result = reservationCancellationSchema.safeParse(input);

  if (!result.success) {
    return { data: null, error: "Le lien d'annulation est invalide." } as const;
  }

  return { data: result.data, error: null } as const;
}