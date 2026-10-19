import type { NextConfig } from "next";

/*
 * Security headers on every response.
 *
 * - The site cannot be shown inside another site's frame (clickjacking).
 * - Browsers must not guess content types.
 * - Other sites only see our origin, never full URLs, in the Referer.
 * - HTTPS only (Render serves HTTPS).
 * - Camera, location etc. are off; the microphone stays allowed for
 *   voice role-play.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), geolocation=(), payment=(), usb=(), microphone=(self)",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.20.144.1"],

  // Do not advertise the framework in an X-Powered-By header.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
