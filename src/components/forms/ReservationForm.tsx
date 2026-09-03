"use client";

import { useState } from "react";

import { TurnstileWidget } from "@/components/security/TurnstileWidget";
import { Button, Flex } from "@/components/ui";
import {
  formatParisDateInputValue,
  getAvailableReservationTimes,
  getReservationTimesForDate,
} from "@/lib/reservation/reservation-rules";
import {
  type ReservationRequestErrors,
  validateReservationRequest,
} from "@/lib/validation/reservation";

import styles from "@/app/page.module.css";

type ReservationFormValues = {
  comment: string;
  date: string;
  email: string;
  guests: string;
  name: string;
  phone: string;
  time: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const initialValues: ReservationFormValues = {
  comment: "",
  date: "",
  email: "",
  guests: "",
  name: "",
  phone: "",
  time: "",
};

function parseGuestCount(guests: string) {
  const value = Number(guests);

  return Number.isInteger(value) && value >= 1 ? value : undefined;
}

export function ReservationForm() {
  const [values, setValues] = useState<ReservationFormValues>(initialValues);
  const [errors, setErrors] = useState<ReservationRequestErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const guestCount = parseGuestCount(values.guests);
  const availableTimes = values.date
    ? getAvailableReservationTimes({ date: values.date, ...(guestCount ? { guests: guestCount } : {}) })
    : [];
  const dayTimes = values.date ? getReservationTimesForDate(values.date) : [];
  const isTimeDisabled = availableTimes.length === 0;
  const noAvailableTimeMessage = values.date && values.guests && dayTimes.length > 0 && availableTimes.length === 0
    ? "Aucun créneau ne respecte le délai minimum pour cette date. Réservation en ligne : 24 h d'avance, ou 48 h à partir de 16 personnes. Contactez directement le restaurant au 04 23 14 32 61."
    : null;

  const updateField = (field: keyof ReservationFormValues, value: string) => {
    setValues((currentValues) => {
      const nextValues = { ...currentValues, [field]: value };

      if (field === "date" || field === "guests") {
        const nextGuests = parseGuestCount(nextValues.guests);
        const nextAvailableTimes = nextValues.date
          ? getAvailableReservationTimes({ date: nextValues.date, ...(nextGuests ? { guests: nextGuests } : {}) })
          : [];

        if (nextValues.time && !nextAvailableTimes.some((time) => time === nextValues.time)) {
          nextValues.time = "";
        }
      }

      return nextValues;
    });
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setSubmitState("idle");
    setStatusMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitState === "submitting") {
      return;
    }

    const validation = validateReservationRequest({
      comment: values.comment,
      date: values.date,
      email: values.email,
      guests: values.guests,
      name: values.name,
      phone: values.phone,
      time: values.time,
    });

    if (!validation.data) {
      setErrors(validation.errors);
      setSubmitState("error");
      setStatusMessage("Merci de corriger les champs indiqués.");
      return;
    }

    setErrors({});

    try {
      setSubmitState("submitting");
      setStatusMessage(null);

      const response = await fetch("/api/reservations", {
        body: JSON.stringify({
          ...validation.data,
          turnstileToken: new FormData(event.currentTarget).get("cf-turnstile-response") ?? "",
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as { message?: string; errors?: ReservationRequestErrors };

      if (!response.ok) {
        setErrors(payload.errors ?? {});
        setSubmitState("error");
        setStatusMessage(payload.message ?? "Votre réservation n'a pas pu être envoyée.");
        return;
      }

      setValues(initialValues);
      setSubmitState("success");
      setStatusMessage(payload.message ?? "Votre réservation a bien été prise en compte.");
    } catch {
      setSubmitState("error");
      setStatusMessage("Votre réservation n'a pas pu être envoyée. Merci de réessayer plus tard.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label className={styles.fieldLabel} htmlFor="resa-name">
        Nom
      </label>
      <input
        id="resa-name"
        name="name"
        className={styles.field}
        autoComplete="name"
        required
        value={values.name}
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? "resa-name-error" : undefined}
        onChange={(event) => updateField("name", event.target.value)}
      />
      {errors.name ? <p id="resa-name-error" className={styles.fieldError}>{errors.name}</p> : null}

      <label className={styles.fieldLabel} htmlFor="resa-phone">
        Telephone
      </label>
      <input
        id="resa-phone"
        name="phone"
        type="tel"
        className={styles.field}
        autoComplete="tel"
        required
        value={values.phone}
        aria-invalid={Boolean(errors.phone)}
        aria-describedby={errors.phone ? "resa-phone-error" : undefined}
        onChange={(event) => updateField("phone", event.target.value)}
      />
      {errors.phone ? <p id="resa-phone-error" className={styles.fieldError}>{errors.phone}</p> : null}

      <label className={styles.fieldLabel} htmlFor="resa-email">
        Mail
      </label>
      <input
        id="resa-email"
        name="email"
        type="email"
        className={styles.field}
        autoComplete="email"
        required
        value={values.email}
        aria-invalid={Boolean(errors.email)}
        aria-describedby={errors.email ? "resa-email-error" : undefined}
        onChange={(event) => updateField("email", event.target.value)}
      />
      {errors.email ? <p id="resa-email-error" className={styles.fieldError}>{errors.email}</p> : null}

      <label className={styles.fieldLabel} htmlFor="resa-guests">
        Nombre de personnes
      </label>
      <input
        id="resa-guests"
        name="guests"
        type="number"
        min={1}
        className={styles.field}
        required
        value={values.guests}
        aria-invalid={Boolean(errors.guests)}
        aria-describedby={errors.guests ? "resa-guests-error" : undefined}
        onChange={(event) => updateField("guests", event.target.value)}
      />
      {errors.guests ? <p id="resa-guests-error" className={styles.fieldError}>{errors.guests}</p> : null}

      <Flex gap="md" wrap>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="resa-date">
            Date
          </label>
          <input
            id="resa-date"
            name="date"
            type="date"
            className={styles.field}
            min={formatParisDateInputValue()}
            required
            value={values.date}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "resa-date-error" : undefined}
            onChange={(event) => updateField("date", event.target.value)}
          />
          {errors.date ? <p id="resa-date-error" className={styles.fieldError}>{errors.date}</p> : null}
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="resa-time">
            Heure
          </label>
          <select
            id="resa-time"
            name="time"
            className={styles.field}
            required
            disabled={!values.date || isTimeDisabled}
            value={values.time}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? "resa-time-error" : noAvailableTimeMessage ? "resa-time-help" : undefined}
            onChange={(event) => updateField("time", event.target.value)}
          >
            <option value="">Choisir un horaire</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.time ? <p id="resa-time-error" className={styles.fieldError}>{errors.time}</p> : null}
          {noAvailableTimeMessage ? <p id="resa-time-help" className={styles.fieldError}>{noAvailableTimeMessage}</p> : null}
        </div>
      </Flex>

      <label className={styles.fieldLabel} htmlFor="resa-message">
        Message
      </label>
      <textarea
        id="resa-message"
        name="message"
        className={styles.fieldArea}
        rows={4}
        maxLength={5000}
        value={values.comment}
        onChange={(event) => updateField("comment", event.target.value)}
      />
      {errors.comment ? <p className={styles.fieldError}>{errors.comment}</p> : null}

      {statusMessage ? (
        <p
          className={submitState === "success" ? styles.formSuccess : styles.formError}
          role={submitState === "success" ? "status" : "alert"}
        >
          {statusMessage}
        </p>
      ) : null}

      <TurnstileWidget />

      <Button variant="primary" size="lg" type="submit" loading={submitState === "submitting"}>
        Envoyer
      </Button>
    </form>
  );
}