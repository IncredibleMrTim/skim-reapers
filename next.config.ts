import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Krystal deploys the traced standalone output rather than building
  // on the server (see docs/deploy-krystal.md) — its Next.js compiler
  // (Turbopack and webpack/SWC alike) OOMs under the account's memory
  // limits.
  output: "standalone",
};

export default nextConfig;
