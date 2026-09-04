import { NextResponse } from "next/server";

import { getClientIp, getOptionalStringField, isJsonRequest, jsonContentTypeError, logProtectionFailure, omitFields } from "@/lib/security/http";
import { checkRateLimit, rateLimitExceededResponseMessage } from "@/lib/security/rate-limit";
import { turnstileErrorMessage, verifyTurnstileToken } from "@/lib/security/turnstile";
import { validateQuoteRequest } from "@/lib/validation/quote-request";
import { sendQuoteRequestEmail } from "@/services/mail/quote-request-mailer";

// Defense in depth on top of Vercel's own platform-level request size limit.
const MAX_BODY_BYTES = 20_000;

export async function POST(request: Request) {
  if (!isJsonRequest(request)) {
    return jsonContentTypeError();
  }

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
  if (getOptionalStringField(body, "honeypot").trim() !== "") {
    return NextResponse.json({ message: "Votre demande de devis a bien été envoyée." });
  }

  const clientIp = getClientIp(request);

  try {
    const rateLimit = await checkRateLimit({ identifier: clientIp, limit: 5, name: "quote-request", windowSeconds: 600 });

    if (!rateLimit.allowed) {
      return NextResponse.json({ message: rateLimitExceededResponseMessage() }, { status: 429 });
    }

    const isTurnstileValid = await verifyTurnstileToken(getOptionalStringField(body, "turnstileToken"), clientIp);

    if (!isTurnstileValid) {
      return NextResponse.json({ message: turnstileErrorMessage() }, { status: 400 });
    }
  } catch (error) {
    logProtectionFailure("Quote request", error);

    return NextResponse.json(
      { message: "Votre demande n'a pas pu être envoyée. Merci de réessayer plus tard." },
      { status: 500 },
    );
  }

  const validation = validateQuoteRequest(omitFields(body, ["honeypot", "turnstileToken"]));

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
  } catch {
    console.error("Quote request email failed");

    return NextResponse.json(
      { message: "Votre demande n'a pas pu être envoyée. Merci de réessayer plus tard." },
      { status: 500 },
    );
  }
}