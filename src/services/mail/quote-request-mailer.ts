import { Resend } from "resend";

import { serverEnv } from "@/config/env";
import type { QuoteRequestInput } from "@/lib/validation/quote-request";

type QuoteRequestEmailPayload = QuoteRequestInput & {
  receivedAt: Date;
};

const defaultFromEmail = "Les Minots de la Garrigue <onboarding@resend.dev>";

function formatQuoteRequestEmail(payload: QuoteRequestEmailPayload) {
  // Explicit parts + hour12:false instead of dateStyle/timeStyle shorthands, which can
  // resolve differently (12h vs 24h, DST handling) across Node/ICU versions/runtimes.
  const receivedAt = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(payload.receivedAt);

  return [
    "Nouvelle demande de devis",
    "",
    `Nom : ${payload.name}`,
    `Entreprise : ${payload.company || "Non renseignée"}`,
    `Téléphone : ${payload.phone}`,
    `Email : ${payload.email}`,
    "",
    "Description :",
    payload.description,
    "",
    `Date et heure de réception : ${receivedAt}`,
  ].join("\n");
}

export async function sendQuoteRequestEmail(payload: QuoteRequestEmailPayload) {
  if (!serverEnv.RESEND_API_KEY || !serverEnv.QUOTE_REQUEST_RECIPIENT_EMAIL) {
    throw new Error("Quote request email configuration is missing.");
  }

  const resend = new Resend(serverEnv.RESEND_API_KEY);

  const result = await resend.emails.send({
    from: serverEnv.RESEND_FROM_EMAIL ?? defaultFromEmail,
    replyTo: payload.email,
    to: serverEnv.QUOTE_REQUEST_RECIPIENT_EMAIL,
    subject: "Nouvelle demande de devis",
    text: formatQuoteRequestEmail(payload),
  });

  if (result.error || !result.data?.id) {
    throw new Error("Quote request email delivery was rejected.");
  }

  return result.data;
}