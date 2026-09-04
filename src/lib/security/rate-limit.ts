import { serverEnv } from "@/config/env";

type RateLimitOptions = {
  identifier: string;
  limit: number;
  name: string;
  windowSeconds: number;
};

type UpstashPipelineResult = Array<{ result?: number }>;

export async function checkRateLimit({ identifier, limit, name, windowSeconds }: RateLimitOptions) {
  // Temporary diagnostic: confirms whether Upstash REST credentials are present at runtime, without logging their value.
  console.error("Rate limit check", {
    hasUpstashToken: Boolean(serverEnv.UPSTASH_REDIS_REST_TOKEN),
    hasUpstashUrl: Boolean(serverEnv.UPSTASH_REDIS_REST_URL),
    name,
  });

  if (!serverEnv.UPSTASH_REDIS_REST_URL || !serverEnv.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("RATE_LIMIT_CONFIG_MISSING");
  }

  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const key = `rate-limit:${name}:${bucket}:${identifier}`;
  let response: Response;

  try {
    response = await fetch(`${serverEnv.UPSTASH_REDIS_REST_URL}/pipeline`, {
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSeconds + 60],
      ]),
      headers: {
        Authorization: `Bearer ${serverEnv.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch {
    throw new Error("RATE_LIMIT_NETWORK_ERROR");
  }

  if (!response.ok) {
    throw new Error(`RATE_LIMIT_HTTP_NOT_OK:${response.status}`);
  }

  const [increment] = (await response.json()) as UpstashPipelineResult;
  const count = Number(increment?.result ?? 0);

  return {
    allowed: count <= limit,
    limit,
  };
}

export function rateLimitExceededResponseMessage() {
  return "Trop de demandes ont été envoyées. Merci de réessayer dans quelques minutes.";
}