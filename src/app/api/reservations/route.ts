import { NextResponse } from "next/server";

import { createCancellationToken } from "@/lib/reservation/cancellation-token";
import { getClientIp, getOptionalStringField, isJsonRequest, jsonContentTypeError, omitFields } from "@/lib/security/http";
import { checkRateLimit, rateLimitExceededResponseMessage } from "@/lib/security/rate-limit";
import { turnstileErrorMessage, verifyTurnstileToken } from "@/lib/security/turnstile";
import { validateReservationRequest } from "@/lib/validation/reservation";
import { sendReservationEmails } from "@/services/mail/reservation-mailer";
import { createReservation } from "@/services/reservations/reservation-repository";

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

  const clientIp = getClientIp(request);

  try {
    const rateLimit = await checkRateLimit({ identifier: clientIp, limit: 8, name: "reservation-create", windowSeconds: 600 });

    if (!rateLimit.allowed) {
      return NextResponse.json({ message: rateLimitExceededResponseMessage() }, { status: 429 });
    }

    const isTurnstileValid = await verifyTurnstileToken(getOptionalStringField(body, "turnstileToken"), clientIp);

    if (!isTurnstileValid) {
      return NextResponse.json({ message: turnstileErrorMessage() }, { status: 400 });
    }
  } catch {
    console.error("Reservation request protection failed");

    return NextResponse.json(
      { message: "Votre réservation n'a pas pu être envoyée. Merci de réessayer plus tard." },
      { status: 500 },
    );
  }

  const validation = validateReservationRequest(omitFields(body, ["turnstileToken"]));

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
    const cancellationToken = createCancellationToken();
    const reservation = await createReservation(validation.data, cancellationToken.hash);

    await sendReservationEmails({
      cancellationToken: cancellationToken.token,
      receivedAt: new Date(),
      reservation,
    });

    return NextResponse.json({ message: "Votre réservation a bien été prise en compte." });
  } catch {
    console.error("Reservation request failed");

    return NextResponse.json(
      { message: "Votre réservation n'a pas pu être envoyée. Merci de réessayer plus tard." },
      { status: 500 },
    );
  }
}