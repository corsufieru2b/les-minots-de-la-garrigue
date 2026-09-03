"use client";

import { useState } from "react";

import { Button } from "@/components/ui";

import styles from "@/app/page.module.css";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ReservationCancellationForm({ token }: { token: string | null }) {
  const [submitState, setSubmitState] = useState<SubmitState>(token ? "idle" : "error");
  const [statusMessage, setStatusMessage] = useState<string | null>(
    token ? null : "Le lien d'annulation est invalide.",
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || submitState === "submitting") {
      return;
    }

    try {
      setSubmitState("submitting");
      setStatusMessage(null);

      const response = await fetch("/api/reservations/cancel", {
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setSubmitState("error");
        setStatusMessage(payload.message ?? "L'annulation n'a pas pu être effectuée.");
        return;
      }

      setSubmitState("success");
      setStatusMessage(payload.message ?? "Votre réservation a bien été annulée.");
    } catch {
      setSubmitState("error");
      setStatusMessage("L'annulation n'a pas pu être effectuée. Merci de réessayer plus tard.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.fieldLabel}>
        Confirmez l&apos;annulation uniquement si vous souhaitez libérer ce créneau.
      </p>

      {statusMessage ? (
        <p
          className={submitState === "success" ? styles.formSuccess : styles.formError}
          role={submitState === "success" ? "status" : "alert"}
        >
          {statusMessage}
        </p>
      ) : null}

      <Button
        variant="primary"
        size="lg"
        type="submit"
        loading={submitState === "submitting"}
        disabled={!token || submitState === "success"}
      >
        Confirmer l&apos;annulation
      </Button>
    </form>
  );
}