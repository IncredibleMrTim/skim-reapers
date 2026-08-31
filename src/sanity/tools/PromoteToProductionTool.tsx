"use client";

import { useState } from "react";
import { Button, Card, Flex, Text } from "@sanity/ui";
import { useClient } from "sanity";

const DEPLOY_TRIGGER_ID = "deployTrigger";

type Status = "idle" | "confirming" | "loading" | "done";

export default function PromoteToProductionTool() {
  const client = useClient({ apiVersion: "2026-01-01" });
  const [status, setStatus] = useState<Status>("idle");

  if (status === "confirming") {
    return (
      <Flex height="fill" align="center" justify="center">
        <Card padding={4} radius={2} shadow={1}>
          <Flex direction="column" gap={4} align="center">
            <Text size={2} weight="semibold">
              Deploy the current live content to production?
            </Text>
            <Text size={1} muted>
              This makes skimreapers.co.uk match what&apos;s currently
              published — visible to real visitors right away.
            </Text>
            <Flex gap={3}>
              <Button text="Cancel" mode="ghost" onClick={() => setStatus("idle")} />
              <Button
                text="Confirm & Promote"
                tone="critical"
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
          </Flex>
        </Card>
      </Flex>
    );
  }

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
            onClick={() => setStatus("confirming")}
          />
        </Flex>
      </Card>
    </Flex>
  );
}
