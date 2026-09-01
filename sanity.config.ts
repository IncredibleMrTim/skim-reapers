import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"

import { apiVersion, dataset, projectId } from "./src/sanity/env"
import { schema } from "./src/sanity/schemaTypes"
import { structure } from "./src/sanity/structure"

export default defineConfig({
  basePath: "/admin",
  title: "Skim Reapers Ltd.",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  // Google as the primary sign-in, with Sanity's own email/password as a
  // fallback if Google is unavailable — drops GitHub/Vercel from the
  // default provider list. Only invited project members can actually sign
  // in either way (managed in manage.sanity.io), so this is about which
  // sign-in methods show up, not who's allowed in.
  auth: {
    providers: (prev) =>
      prev.filter(
        (provider) => provider.name === "google" || provider.name === "sanity",
      ),
  },
})
