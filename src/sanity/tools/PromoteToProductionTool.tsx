"use client";

import { useState } from "react";
import { Button, Card, Flex, Text } from "@sanity/ui";
import { useClient } from "sanity";

const DEPLOY_TRIGGER_ID = "deployTrigger";

export default function PromoteToProductionTool() {
  const client = useClient({ apiVersion: "2026-01-01" });
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  return (
    <Flex height="fill" align="center" justify="center">
      <Card padding={4} radius={2} shadow={1}>
        <Flex direction="column" gap={4} align="center">
          <Text size={2}>Publishes the current live content to production.</Text>
          <Button
            text={
              status === "done"
                ? "Promoted!"
                : status === "loading"
                  ? "Promoting…"
                  : "🚀 Promote to Production"
            }
            tone="positive"
            disabled={status !== "idle"}
            onClick={async () => {
              setStatus("loading");
              await client.createOrReplace({
                _id: DEPLOY_TRIGGER_ID,
                _type: "deployTrigger",
                triggeredAt: new Date().toISOString(),
              });
              setStatus("done");
              setTimeout(() => setStatus("idle"), 3000);
            }}
          />
        </Flex>
      </Card>
    </Flex>
  );
}
