// Rename this to sanity.config.ts at your new project's root once the
// TODOs below are filled in — it's a .ts file (not .tsx), so JSX syntax
// isn't valid here; use createElement if you need to pass a component
// (e.g. for a custom `icon`).
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
// TODO: point these at your project's own schema/structure. This
// template doesn't include schemaTypes/structure.ts — those are
// inherently specific to what content you're modeling, not part of the
// admin/auth/branding piece.
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/admin",
  title: "TODO: Your Brand Name", // shown in the login card header
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  // Google as the primary sign-in, with Sanity's own email/password as a
  // fallback if Google is unavailable — drops GitHub/Vercel from the
  // default provider list. Only invited project members can actually
  // sign in either way (managed per-project in manage.sanity.io — this
  // needs setting up fresh for each new Sanity project), so this is
  // about which sign-in methods show up, not who's allowed in.
  //
  // TODO: adjust the provider names here if you want a different set
  // (e.g. add "github", or drop "sanity" to force SSO-only).
  auth: {
    providers: (prev) =>
      prev.filter(
        (provider) => provider.name === "google" || provider.name === "sanity",
      ),
  },
});
