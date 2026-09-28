"use client"

import { useSyncExternalStore } from "react"

function subscribe(): () => void {
  return () => {}
}

function getSnapshot(): boolean {
  return true
}

function getServerSnapshot(): boolean {
  return false
}

/**
 * True once past the client's first render pass. Built on
 * `useSyncExternalStore` — the same trick `useIsMobile` uses — so it's
 * `false` on hydration's first client render too (matching the server
 * HTML), then flips `true` in the same corrective pass `useIsMobile`
 * settles in. Gating a JS-driven component choice (e.g. Tabs vs Accordion)
 * behind this means that first, briefly-wrong render (where `isMobile` is
 * still its server default) never actually paints as the wrong component —
 * `!hasMounted` masks it instead.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
