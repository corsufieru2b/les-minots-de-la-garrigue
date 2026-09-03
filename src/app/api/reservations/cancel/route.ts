import { NextResponse } from "next/server";

import { hashCancellationToken } from "@/lib/reservation/cancellation-token";
import { validateReservationCancellationWindow } from "@/lib/reservation/cancellation-rules";
import { getClientIp, isJsonRequest, jsonContentTypeError } from "@/lib/security/http";
import { checkRateLimit, rateLimitExceededResponseMessage } from "@/lib/security/rate-limit";
import { validateReservationCancellationRequest } from "@/lib/validation/reservation-cancellation";
import { sendReservationCancellationEmails } from "@/services/mail/reservation-mailer";
import {
  cancelReservationByCancellationTokenHash,
  findReservationByCancellationTokenHash,
} from "@/services/reservations/reservation-repository";

const MAX_BODY_BYTES = 2_000;

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

  try {
    const rateLimit = await checkRateLimit({
      identifier: getClientIp(request),
      limit: 20,
      name: "reservation-cancel",
      windowSeconds: 600,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json({ message: rateLimitExceededResponseMessage() }, { status: 429 });
    }
  } catch {
    console.error("Reservation cancellation protection failed");

    return NextResponse.json(
      { message: "L'annulation n'a pas pu être effectuée. Merci de réessayer plus tard." },
      { status: 500 },
    );
  }

  const validation = validateReservationCancellationRequest(body);

  if (!validation.data) {
    return NextResponse.json({ message: validation.error }, { status: 400 });
  }

  try {
    const cancellationTokenHash = hashCancellationToken(validation.data.token);
    const reservation = await findReservationByCancellationTokenHash(cancellationTokenHash);

    if (!reservation) {
      return NextResponse.json({ message: "Ce lien d'annulation est invalide ou expiré." }, { status: 404 });
    }

    if (reservation.status === "cancelled") {
      return NextResponse.json({ message: "Cette réservation est déjà annulée." }, { status: 409 });
    }

    const cancellationWindow = validateReservationCancellationWindow({
      date: reservation.reservation_date,
      time: reservation.reservation_time,
    });

    if (!cancellationWindow.ok) {
      return NextResponse.json({ message: cancellationWindow.message }, { status: 409 });
    }

    const cancelledReservation = await cancelReservationByCancellationTokenHash(cancellationTokenHash);

    try {
      await sendReservationCancellationEmails({ reservation: cancelledReservation });
    } catch {
      console.error("Reservation cancellation email failed");
    }

    return NextResponse.json({ message: "Votre réservation a bien été annulée." });
  } catch {
    console.error("Reservation cancellation failed");

    return NextResponse.json(
      { message: "L'annulation n'a pas pu être effectuée. Merci de réessayer plus tard." },
      { status: 500 },
    );
  }
}