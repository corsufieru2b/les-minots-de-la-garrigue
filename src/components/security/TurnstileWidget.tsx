"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

const TURNSTILE_RESPONSE_FIELD_NAME = "cf-turnstile-response";

type TurnstileRenderOptions = {
  "response-field-name": string;
  sitekey: string;
};

type TurnstileApi = {
  remove: (widgetId: string) => void;
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string | undefined;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    const turnstile = window.turnstile;
    const container = containerRef.current;

    // Guards against double render: script already loaded from a prior client navigation,
    // or onReady firing more than once for the same mounted widget.
    if (!turnstile || !container || !siteKey || widgetIdRef.current) {
      return;
    }

    widgetIdRef.current =
      turnstile.render(container, {
        "response-field-name": TURNSTILE_RESPONSE_FIELD_NAME,
        sitekey: siteKey,
      }) ?? null;
  }, [siteKey]);

  useEffect(() => {
    return () => {
      const turnstile = window.turnstile;

      if (turnstile && widgetIdRef.current) {
        turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  if (!siteKey) {
    return null;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        async
        defer
        onReady={renderWidget}
      />
      <div ref={containerRef} />
    </>
  );
}
