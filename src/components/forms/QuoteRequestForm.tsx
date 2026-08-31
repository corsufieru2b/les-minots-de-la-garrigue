"use client";

import { useState } from "react";

import { Button } from "@/components/ui";
import {
  type QuoteRequestErrors,
  type QuoteRequestInput,
  validateQuoteRequest,
} from "@/lib/validation/quote-request";

import styles from "@/app/page.module.css";

type SubmitState = "idle" | "submitting" | "success" | "error";

const initialValues: QuoteRequestInput = {
  name: "",
  company: "",
  phone: "",
  email: "",
  description: "",
};

export function QuoteRequestForm() {
  const [values, setValues] = useState<QuoteRequestInput>(initialValues);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<QuoteRequestErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const updateField = (field: keyof QuoteRequestInput, value: string) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateQuoteRequest(values);

    if (!validation.data) {
      setErrors(validation.errors);
      setSubmitState("error");
      setStatusMessage("Merci de corriger les champs indiqués.");
      return;
    }

    setErrors({});
    setSubmitState("submitting");
    setStatusMessage(null);

    try {
      const response = await fetch("/api/quote-request", {
        body: JSON.stringify({ ...validation.data, honeypot }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const payload = (await response.json()) as { message?: string; errors?: QuoteRequestErrors };

      if (!response.ok) {
        setErrors(payload.errors ?? {});
        setSubmitState("error");
        setStatusMessage(payload.message ?? "Votre demande n'a pas pu être envoyée.");
        return;
      }

      setValues(initialValues);
      setSubmitState("success");
      setStatusMessage(payload.message ?? "Votre demande de devis a bien été envoyée.");
    } catch {
      setSubmitState("error");
      setStatusMessage("Votre demande n'a pas pu être envoyée. Merci de réessayer plus tard.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Honeypot: hidden from real visitors and assistive tech, only bots fill it in. */}
      <div aria-hidden="true" style={{ height: 0, left: "-9999px", overflow: "hidden", position: "absolute", width: 0 }}>
        <label htmlFor="quote-website">Ne pas remplir ce champ</label>
        <input
          id="quote-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <label className={styles.fieldLabel} htmlFor="quote-name">
        Nom
      </label>
      <input
        id="quote-name"
        name="name"
        className={styles.field}
        autoComplete="name"
        value={values.name}
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? "quote-name-error" : undefined}
        onChange={(event) => updateField("name", event.target.value)}
      />
      {errors.name ? <p id="quote-name-error" className={styles.fieldError}>{errors.name}</p> : null}

      <label className={styles.fieldLabel} htmlFor="quote-company">
        Entreprise
      </label>
      <input
        id="quote-company"
        name="company"
        className={styles.field}
        autoComplete="organization"
        value={values.company}
        onChange={(event) => updateField("company", event.target.value)}
      />

      <label className={styles.fieldLabel} htmlFor="quote-phone">
        Telephone
      </label>
      <input
        id="quote-phone"
        name="phone"
        className={styles.field}
        autoComplete="tel"
        value={values.phone}
        aria-invalid={Boolean(errors.phone)}
        aria-describedby={errors.phone ? "quote-phone-error" : undefined}
        onChange={(event) => updateField("phone", event.target.value)}
      />
      {errors.phone ? <p id="quote-phone-error" className={styles.fieldError}>{errors.phone}</p> : null}

      <label className={styles.fieldLabel} htmlFor="quote-email">
        Mail
      </label>
      <input
        id="quote-email"
        name="email"
        type="email"
        className={styles.field}
        autoComplete="email"
        value={values.email}
        aria-invalid={Boolean(errors.email)}
        aria-describedby={errors.email ? "quote-email-error" : undefined}
        onChange={(event) => updateField("email", event.target.value)}
      />
      {errors.email ? <p id="quote-email-error" className={styles.fieldError}>{errors.email}</p> : null}

      <label className={styles.fieldLabel} htmlFor="quote-description">
        Description
      </label>
      <textarea
        id="quote-description"
        name="description"
        className={styles.fieldArea}
        rows={5}
        value={values.description}
        aria-invalid={Boolean(errors.description)}
        aria-describedby={errors.description ? "quote-description-error" : undefined}
        onChange={(event) => updateField("description", event.target.value)}
      />
      {errors.description ? (
        <p id="quote-description-error" className={styles.fieldError}>{errors.description}</p>
      ) : null}

      {statusMessage ? (
        <p
          className={submitState === "success" ? styles.formSuccess : styles.formError}
          role={submitState === "success" ? "status" : "alert"}
        >
          {statusMessage}
        </p>
      ) : null}

      <Button variant="secondary" size="lg" type="submit" loading={submitState === "submitting"}>
        Demander un devis
      </Button>
    </form>
  );
}