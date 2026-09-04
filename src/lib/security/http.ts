import { NextResponse } from "next/server";

export function isJsonRequest(request: Request) {
  return request.headers.get("content-type")?.toLowerCase().includes("application/json") ?? false;
}

export function jsonContentTypeError() {
  return NextResponse.json({ message: "La demande doit être envoyée en JSON." }, { status: 415 });
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return forwardedFor || request.headers.get("x-real-ip") || "unknown";
}

export function getOptionalStringField(body: unknown, field: string) {
  if (!body || typeof body !== "object" || !(field in body)) {
    return "";
  }

  const value = (body as Record<string, unknown>)[field];

  return typeof value === "string" ? value : "";
}

export function omitFields(body: unknown, fields: string[]) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return body;
  }

  const entries = Object.entries(body).filter(([key]) => !fields.includes(key));

  return Object.fromEntries(entries);
}

// Temporary diagnostic: buckets the protection-check failure into a safe, non-secret category.
export function logProtectionFailure(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
  const [reason = "UNKNOWN_ERROR", statusCode] = message.split(":");

  const knownReasons = [
    "RATE_LIMIT_CONFIG_MISSING",
    "RATE_LIMIT_NETWORK_ERROR",
    "RATE_LIMIT_HTTP_NOT_OK",
    "TURNSTILE_CONFIG_MISSING",
    "TURNSTILE_NETWORK_ERROR",
    "TURNSTILE_HTTP_NOT_OK",
  ];

  console.error(`${scope} protection failed`, {
    cloudflareOrUpstashStatus: statusCode,
    reason: knownReasons.includes(reason) ? reason : "OTHER_EXCEPTION",
  });
}