import { serverEnv } from "@/config/env";

type TurnstileResponse = {
  "error-codes"?: string[];
  hostname?: string;
  success?: boolean;
};

export async function verifyTurnstileToken(token: string, remoteIp: string) {
  // Temporary diagnostic: confirms whether the secret is actually present at runtime, without ever logging its value.
  console.error("Turnstile check", { hasTurnstileSecret: Boolean(serverEnv.TURNSTILE_SECRET_KEY) });

  if (!serverEnv.TURNSTILE_SECRET_KEY) {
    throw new Error("TURNSTILE_CONFIG_MISSING");
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

  let response: Response;

  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      body: formData,
      method: "POST",
    });
  } catch {
    throw new Error("TURNSTILE_NETWORK_ERROR");
  }

  if (!response.ok) {
    throw new Error(`TURNSTILE_HTTP_NOT_OK:${response.status}`);
  }

  const payload = (await response.json()) as TurnstileResponse;

  // Temporary diagnostic: Cloudflare's own success/error-codes, never the secret or the user token.
  console.error("Turnstile siteverify result", {
    errorCodes: payload["error-codes"],
    hostname: payload.hostname,
    success: payload.success,
  });

  return payload.success === true;
}

export function turnstileErrorMessage() {
  return "La vérification anti-abus a échoué. Merci de réessayer.";
}