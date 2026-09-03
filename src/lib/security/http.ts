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