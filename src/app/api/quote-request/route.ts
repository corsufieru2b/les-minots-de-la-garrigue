import { NextResponse } from "next/server";

import { validateQuoteRequest } from "@/lib/validation/quote-request";
import { sendQuoteRequestEmail } from "@/services/mail/quote-request-mailer";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "La demande est invalide." },
      { status: 400 },
    );
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