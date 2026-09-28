import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Content is fetched from Sanity at build time and Krystal serves
  // the output as plain static files — no Node.js process on the
  // server at all (see docs/deploy-krystal.md), which also sidesteps
  // the account's Next.js compiler memory limits since the build only
  // ever runs in CI.
  output: "export",
  images: { unoptimized: true },
  // Lets the dev server hydrate client components when loaded from a phone
  // on the same wifi network (e.g. http://192.168.4.29:3000) instead of
  // localhost — Next.js blocks cross-origin requests to dev assets otherwise.
  allowedDevOrigins: ["192.168.4.29"],
};

export default nextConfig;
