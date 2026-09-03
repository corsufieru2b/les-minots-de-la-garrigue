import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const CANCELLATION_TOKEN_BYTES = 32;

export function createCancellationToken() {
  const token = randomBytes(CANCELLATION_TOKEN_BYTES).toString("base64url");

  return {
    hash: hashCancellationToken(token),
    token,
  };
}

export function hashCancellationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function isCancellationTokenHashMatch(token: string, expectedHash: string) {
  const tokenHash = hashCancellationToken(token);
  const tokenHashBuffer = Buffer.from(tokenHash, "hex");
  const expectedHashBuffer = Buffer.from(expectedHash, "hex");

  if (tokenHashBuffer.byteLength !== expectedHashBuffer.byteLength) {
    return false;
  }

  return timingSafeEqual(tokenHashBuffer, expectedHashBuffer);
}