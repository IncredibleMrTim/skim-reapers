"use client"

import { useSyncExternalStore } from "react"

const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)"

function subscribe(onChange: () => void): () => void {
  const mediaQueryList = window.matchMedia(MOBILE_BREAKPOINT_QUERY)
  mediaQueryList.addEventListener("change", onChange)
  return () => mediaQueryList.removeEventListener("change", onChange)
}

function getSnapshot(): boolean {
  return window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches
}

function getServerSnapshot(): boolean {
  return false
}

/**
 * Reports whether the viewport currently matches a mobile-width media
 * query. Backed by `useSyncExternalStore` rather than effect state so it
 * stays correct under concurrent rendering; returns `false` during SSR and
 * static export (this project has no server-side viewport to detect).
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
