import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type { ReservationRequestInput } from "@/lib/validation/reservation";

export type ReservationStatus = "confirmed" | "cancelled";

export type ReservationRecord = {
  cancellation_token_hash: string | null;
  cancelled_at: string | null;
  comment: string | null;
  created_at: string;
  email: string;
  id: string;
  name: string;
  party_size: number;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  status: ReservationStatus;
};

const reservationSelect = "id,name,phone,email,party_size,reservation_date,reservation_time,comment,status,created_at,cancellation_token_hash,cancelled_at";

export async function createReservation(input: ReservationRequestInput, cancellationTokenHash: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      cancellation_token_hash: cancellationTokenHash,
      comment: input.comment || null,
      email: input.email,
      name: input.name,
      party_size: input.guests,
      phone: input.phone,
      reservation_date: input.date,
      reservation_time: input.time,
      status: "confirmed" satisfies ReservationStatus,
    })
    .select(reservationSelect)
    .single<ReservationRecord>();

  if (error || !data) {
    console.error("Reservation persistence failed");
    throw new Error("Reservation persistence failed.");
  }

  return data;
}

export async function findReservationByCancellationTokenHash(cancellationTokenHash: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("reservations")
    .select(reservationSelect)
    .eq("cancellation_token_hash", cancellationTokenHash)
    .maybeSingle<ReservationRecord>();

  if (error) {
    throw new Error("Reservation lookup failed.");
  }

  return data;
}

export async function cancelReservationByCancellationTokenHash(cancellationTokenHash: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("reservations")
    .update({
      cancelled_at: new Date().toISOString(),
      status: "cancelled" satisfies ReservationStatus,
    })
    .eq("cancellation_token_hash", cancellationTokenHash)
    .eq("status", "confirmed")
    .select(reservationSelect)
    .single<ReservationRecord>();

  if (error || !data) {
    throw new Error("Reservation cancellation update failed.");
  }

  return data;
}