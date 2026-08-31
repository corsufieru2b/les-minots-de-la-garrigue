import { z } from "zod";

const requiredText = (message: string) => z.string().trim().min(1, message);

export const quoteRequestSchema = z.object({
  name: requiredText("Le nom est obligatoire."),
  company: z.string().trim().optional(),
  phone: requiredText("Le téléphone est obligatoire."),
  email: requiredText("L'email est obligatoire.").email("L'email doit être valide."),
  description: requiredText("La description est obligatoire."),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type QuoteRequestErrors = Partial<Record<keyof QuoteRequestInput, string>>;

export function validateQuoteRequest(input: unknown) {
  const result = quoteRequestSchema.safeParse(input);

  if (result.success) {
    return { data: result.data, errors: null } as const;
  }

  const errors: QuoteRequestErrors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && field in quoteRequestSchema.shape) {
      const key = field as keyof QuoteRequestInput;
      errors[key] ??= issue.message;
    }
  }

  return { data: null, errors } as const;
}