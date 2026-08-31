import type { NextConfig } from "next";

// CSP notes (see security audit report for full rationale):
// - script-src needs 'unsafe-inline' because Next.js App Router injects inline
//   hydration/streaming scripts and this project's JSON-LD tag is also inline.
//   A stricter nonce-based CSP requires middleware + headers() and would force
//   every page to render dynamically, which is out of scope for this hardening
//   pass (all pages are currently statically prerendered).
// - style-src needs 'unsafe-inline' because several UI components (Grid, Loader,
//   AspectRatio) use React inline `style` attributes; removing it breaks layout.
// - frame-src allows https://www.google.com for the Contact page's Google Maps embed.
const isProduction = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // CSP and HSTS are production-only: React dev tooling relies on eval(), which
  // a strict script-src would otherwise block during local development.
  ...(isProduction
    ? [
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "Strict-Transport-Security", value: "max-age=31536000" },
      ]
    : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/devis",
        destination: "/traiteur",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
