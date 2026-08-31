import { NextResponse } from "next/server";

import { validateQuoteRequest } from "@/lib/validation/quote-request";
import { sendQuoteRequestEmail } from "@/services/mail/quote-request-mailer";

// Defense in depth on top of Vercel's own platform-level request size limit.
const MAX_BODY_BYTES = 20_000;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ message: "La demande est trop volumineuse." }, { status: 413 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "La demande est invalide." },
      { status: 400 },
    );
  }

  // Honeypot: a hidden form field that must stay empty for genuine visitors.
  // Bots that fill every field get a normal-looking success response with no email sent.
  if (
    body &&
    typeof body === "object" &&
    "honeypot" in body &&
    typeof (body as { honeypot?: unknown }).honeypot === "string" &&
    (body as { honeypot: string }).honeypot.trim() !== ""
  ) {
    return NextResponse.json({ message: "Votre demande de devis a bien été envoyée." });
  }

  const validation = validateQuoteRequest(body);

  if (!validation.data) {
    return NextResponse.json(
      {
        message: "Merci de vérifier les champs du formulaire.",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  try {
    await sendQuoteRequestEmail({
      ...validation.data,
      receivedAt: new Date(),
    });

    return NextResponse.json({ message: "Votre demande de devis a bien été envoyée." });
  } catch (error) {
    console.error("Quote request email failed", error);

    return NextResponse.json(
      { message: "Votre demande n'a pas pu être envoyée. Merci de réessayer plus tard." },
      { status: 500 },
    );
  }
}