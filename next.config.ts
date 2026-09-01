import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Content is fetched from Sanity at build time and Krystal serves
  // the output as plain static files — no Node.js process on the
  // server at all (see docs/deploy-krystal.md), which also sidesteps
  // the account's Next.js compiler memory limits since the build only
  // ever runs in CI.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
