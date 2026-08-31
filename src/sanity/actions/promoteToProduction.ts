import { useState } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import { useClient } from "sanity";

const DEPLOY_TRIGGER_ID = "deployTrigger";

// Writes to a dedicated deployTrigger singleton (via the editor's own
// authenticated Studio session — no token in the browser). A Sanity
// webhook watches that document and calls GitHub's API server-side to
// fire the production deploy. See docs/deploy-krystal.md.
export const promoteToProductionAction: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  // Sanity's DocumentActionComponent API renders this like a component
  // and expects hooks inside it (per Sanity's own docs) — eslint's
  // react-hooks rule just doesn't recognize the camelCase name as one.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const client = useClient({ apiVersion: "2026-01-01" });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  return {
    label: status === "done" ? "Promoted!" : "Promote to Production",
    icon: () => "🚀",
    disabled: status !== "idle",
    onHandle: async () => {
      setStatus("loading");
      await client.createOrReplace({
        _id: DEPLOY_TRIGGER_ID,
        _type: "deployTrigger",
        triggeredAt: new Date().toISOString(),
      });
      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
      props.onComplete();
    },
  };
};
