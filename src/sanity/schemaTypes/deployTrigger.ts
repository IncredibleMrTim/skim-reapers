import { defineField, defineType } from "sanity";

// Not user-facing content — writing to this document is how the
// "Promote to Production" Studio action signals a production deploy.
// A Sanity webhook filtered on this type calls GitHub's API when it
// changes (see docs/deploy-krystal.md).
export const deployTrigger = defineType({
  name: "deployTrigger",
  title: "Deploy Trigger",
  type: "document",
  fields: [
    defineField({
      name: "triggeredAt",
      title: "Triggered at",
      type: "datetime",
      readOnly: true,
    }),
  ],
});
