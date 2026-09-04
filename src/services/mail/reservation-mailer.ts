import { Resend } from "resend";

import { publicEnv, serverEnv } from "@/config/env";
import { PARIS_TIME_ZONE } from "@/lib/reservation/reservation-rules";
import type { ReservationRecord } from "@/services/reservations/reservation-repository";

const defaultFromEmail = "Les Minots de la Garrigue <onboarding@resend.dev>";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  timeZone: PARIS_TIME_ZONE,
  weekday: "long",
  year: "numeric",
});

const receivedAtFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  month: "long",
  timeZone: PARIS_TIME_ZONE,
  weekday: "long",
  year: "numeric",
});

type ReservationEmailPayload = {
  cancellationToken: string;
  receivedAt: Date;
  reservation: ReservationRecord;
};

type ReservationCancellationEmailPayload = {
  reservation: ReservationRecord;
};

export async function sendReservationEmails(payload: ReservationEmailPayload) {
  if (!serverEnv.RESEND_API_KEY || !serverEnv.RESERVATIONS_RECIPIENT_EMAIL || !publicEnv.NEXT_PUBLIC_SITE_URL) {
    console.error("Reservation email configuration is missing");
    throw new Error("Reservation email configuration is missing.");
  }

  const resend = new Resend(serverEnv.RESEND_API_KEY);
  const from = serverEnv.RESEND_FROM_EMAIL ?? defaultFromEmail;
  const customerEmail = buildCustomerReservationEmail(payload.reservation, payload.cancellationToken);
  const restaurantEmail = buildRestaurantReservationEmail(payload);

  await sendReservationEmail("customer", resend, {
    from,
    html: customerEmail.html,
    subject: "Votre réservation aux Minots de la Garrigue",
    text: customerEmail.text,
    to: payload.reservation.email,
  });

  await sendReservationEmail("restaurant", resend, {
    from,
    html: restaurantEmail.html,
    replyTo: payload.reservation.email,
    subject: "Nouvelle réservation",
    text: restaurantEmail.text,
    to: serverEnv.RESERVATIONS_RECIPIENT_EMAIL,
  });
}

export async function sendReservationCancellationEmails(payload: ReservationCancellationEmailPayload) {
  if (!serverEnv.RESEND_API_KEY || !serverEnv.RESERVATIONS_RECIPIENT_EMAIL) {
    console.error("Reservation email configuration is missing");
    throw new Error("Reservation email configuration is missing.");
  }

  const resend = new Resend(serverEnv.RESEND_API_KEY);
  const from = serverEnv.RESEND_FROM_EMAIL ?? defaultFromEmail;
  const customerEmail = buildCustomerCancellationEmail(payload.reservation);
  const restaurantEmail = buildRestaurantCancellationEmail(payload.reservation);

  await sendReservationEmail("customer", resend, {
    from,
    html: customerEmail.html,
    subject: "Annulation de votre réservation",
    text: customerEmail.text,
    to: payload.reservation.email,
  });

  await sendReservationEmail("restaurant", resend, {
    from,
    html: restaurantEmail.html,
    replyTo: payload.reservation.email,
    subject: "Réservation annulée",
    text: restaurantEmail.text,
    to: serverEnv.RESERVATIONS_RECIPIENT_EMAIL,
  });
}

async function sendReservationEmail(
  recipientType: "customer" | "restaurant",
  resend: Resend,
  payload: {
    from: string;
    html: string;
    replyTo?: string;
    subject: string;
    text: string;
    to: string;
  },
) {
  const result = await resend.emails.send(payload);

  if (result.error || !result.data?.id) {
    console.error(`Reservation ${recipientType} email failed`);
    throw new Error("Reservation email delivery was rejected.");
  }

  return result.data;
}

function buildCustomerReservationEmail(reservation: ReservationRecord, cancellationToken: string) {
  const date = formatReservationDate(reservation.reservation_date);
  const time = formatReservationTime(reservation.reservation_time);
  const guestLabel = formatGuestCount(reservation.party_size);
  const cancellationUrl = buildCancellationUrl(cancellationToken);
  const text = [
    "Bonjour,",
    "",
    "Votre réservation a bien été prise en compte.",
    "",
    `Nous vous donnons rendez-vous le ${date} à ${time} et espérons que vous passerez un agréable moment.`,
    "",
    "Récapitulatif :",
    `Date : ${date}`,
    `Heure : ${time}`,
    `Nombre de personnes : ${guestLabel}`,
    "",
    "Vous pouvez annuler votre réservation jusqu'à 24 h avant l'horaire prévu.",
    `Annuler ma réservation : ${cancellationUrl}`,
    "",
    "Les Minots de la Garrigue",
  ].join("\n");

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #1f1a17; line-height: 1.6;">
      <p>Bonjour,</p>
      <p>Votre réservation a bien été prise en compte.</p>
      <p>Nous vous donnons rendez-vous le <strong>${escapeHtml(date)}</strong> à <strong>${escapeHtml(time)}</strong> et espérons que vous passerez un agréable moment.</p>
      <div style="margin: 24px 0; padding: 18px; border: 1px solid #ded6cb; border-radius: 8px; background: #fbf8f2;">
        <p style="margin: 0 0 8px; font-weight: 700;">Récapitulatif</p>
        <p style="margin: 0;">Date : ${escapeHtml(date)}</p>
        <p style="margin: 0;">Heure : ${escapeHtml(time)}</p>
        <p style="margin: 0;">Nombre de personnes : ${escapeHtml(guestLabel)}</p>
      </div>
      <p>Vous pouvez annuler votre réservation jusqu'à 24 h avant l'horaire prévu.</p>
      <p><a href="${escapeHtml(cancellationUrl)}" style="display: inline-block; padding: 12px 18px; border-radius: 8px; background: #1f1a17; color: #ffffff; text-decoration: none;">Annuler ma réservation</a></p>
      <p>Les Minots de la Garrigue</p>
    </div>
  `;

  return { html, text };
}

function buildRestaurantReservationEmail({ receivedAt, reservation }: ReservationEmailPayload) {
  const date = formatReservationDate(reservation.reservation_date);
  const time = formatReservationTime(reservation.reservation_time);
  const receivedAtText = receivedAtFormatter.format(receivedAt);
  const textLines = [
    "Nouvelle réservation",
    "",
    `Nom : ${reservation.name}`,
    `Téléphone : ${reservation.phone}`,
    `E-mail : ${reservation.email}`,
    `Nombre de personnes : ${formatGuestCount(reservation.party_size)}`,
    `Date : ${date}`,
    `Heure : ${time}`,
  ];

  if (reservation.comment) {
    textLines.push("", "Commentaire :", reservation.comment);
  }

  textLines.push("", `Date et heure de réception : ${receivedAtText}`);

  const commentHtml = reservation.comment
    ? `<p><strong>Commentaire :</strong><br>${escapeHtml(reservation.comment)}</p>`
    : "";
  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #1f1a17; line-height: 1.6;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">Nouvelle réservation</h1>
      <p><strong>Nom :</strong> ${escapeHtml(reservation.name)}</p>
      <p><strong>Téléphone :</strong> ${escapeHtml(reservation.phone)}</p>
      <p><strong>E-mail :</strong> ${escapeHtml(reservation.email)}</p>
      <p><strong>Nombre de personnes :</strong> ${escapeHtml(formatGuestCount(reservation.party_size))}</p>
      <p><strong>Date :</strong> ${escapeHtml(date)}</p>
      <p><strong>Heure :</strong> ${escapeHtml(time)}</p>
      ${commentHtml}
      <p><strong>Date et heure de réception :</strong> ${escapeHtml(receivedAtText)}</p>
    </div>
  `;

  return { html, text: textLines.join("\n") };
}

function buildCustomerCancellationEmail(reservation: ReservationRecord) {
  const date = formatReservationDate(reservation.reservation_date);
  const time = formatReservationTime(reservation.reservation_time);
  const text = [
    "Bonjour,",
    "",
    `Votre réservation du ${date} à ${time} a bien été annulée.`,
    "",
    "Les Minots de la Garrigue",
  ].join("\n");
  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #1f1a17; line-height: 1.6;">
      <p>Bonjour,</p>
      <p>Votre réservation du <strong>${escapeHtml(date)}</strong> à <strong>${escapeHtml(time)}</strong> a bien été annulée.</p>
      <p>Les Minots de la Garrigue</p>
    </div>
  `;

  return { html, text };
}

function buildRestaurantCancellationEmail(reservation: ReservationRecord) {
  const date = formatReservationDate(reservation.reservation_date);
  const time = formatReservationTime(reservation.reservation_time);
  const text = [
    "Réservation annulée",
    "",
    `Nom : ${reservation.name}`,
    `Téléphone : ${reservation.phone}`,
    `E-mail : ${reservation.email}`,
    `Nombre de personnes : ${formatGuestCount(reservation.party_size)}`,
    `Date : ${date}`,
    `Heure : ${time}`,
  ].join("\n");
  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #1f1a17; line-height: 1.6;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">Réservation annulée</h1>
      <p><strong>Nom :</strong> ${escapeHtml(reservation.name)}</p>
      <p><strong>Téléphone :</strong> ${escapeHtml(reservation.phone)}</p>
      <p><strong>E-mail :</strong> ${escapeHtml(reservation.email)}</p>
      <p><strong>Nombre de personnes :</strong> ${escapeHtml(formatGuestCount(reservation.party_size))}</p>
      <p><strong>Date :</strong> ${escapeHtml(date)}</p>
      <p><strong>Heure :</strong> ${escapeHtml(time)}</p>
    </div>
  `;

  return { html, text };
}

function buildCancellationUrl(cancellationToken: string) {
  const url = new URL("/reservation/annulation", publicEnv.NEXT_PUBLIC_SITE_URL);

  url.searchParams.set("token", cancellationToken);

  return url.toString();
}

function formatReservationDate(date: string) {
  const [year = 1970, month = 1, day = 1] = date.split("-").map(Number);

  return dateFormatter.format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function formatReservationTime(time: string) {
  return time.slice(0, 5);
}

function formatGuestCount(guestCount: number) {
  return `${guestCount} ${guestCount > 1 ? "personnes" : "personne"}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}