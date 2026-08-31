import { Resend } from "resend";

import { serverEnv } from "@/config/env";
import type { QuoteRequestInput } from "@/lib/validation/quote-request";

type QuoteRequestEmailPayload = QuoteRequestInput & {
  receivedAt: Date;
};

const defaultFromEmail = "Les Minots de la Garrigue <onboarding@resend.dev>";

function formatQuoteRequestEmail(payload: QuoteRequestEmailPayload) {
  const receivedAt = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
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

  return resend.emails.send({
    from: serverEnv.RESEND_FROM_EMAIL ?? defaultFromEmail,
    replyTo: payload.email,
    to: serverEnv.QUOTE_REQUEST_RECIPIENT_EMAIL,
    subject: "Nouvelle demande de devis",
    text: formatQuoteRequestEmail(payload),
  });
}