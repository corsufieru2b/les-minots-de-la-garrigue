import { serverEnv } from "@/config/env";

type TurnstileResponse = {
  success?: boolean;
};

export async function verifyTurnstileToken(token: string, remoteIp: string) {
  if (!serverEnv.TURNSTILE_SECRET_KEY) {
    throw new Error("Turnstile configuration is missing.");
  }

  if (!token) {
    return false;
  }

  const formData = new FormData();

  formData.set("secret", serverEnv.TURNSTILE_SECRET_KEY);
  formData.set("response", token);

  if (remoteIp !== "unknown") {
    formData.set("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    body: formData,
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Turnstile verification failed.");
  }

  const payload = (await response.json()) as TurnstileResponse;

  return payload.success === true;
}

export function turnstileErrorMessage() {
  return "La vérification anti-abus a échoué. Merci de réessayer.";
}