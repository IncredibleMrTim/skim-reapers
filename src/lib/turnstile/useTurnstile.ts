"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
const TOKEN_WAIT_TIMEOUT_MS = 30_000

interface TurnstileRenderOptions {
  sitekey: string
  theme: "light" | "dark" | "auto"
  /** "interaction-only" keeps the widget hidden unless a visitor must act. */
  appearance: "always" | "execute" | "interaction-only"
  callback: (token: string) => void
  "expired-callback": () => void
  "error-callback": () => void
  /** Fires when Cloudflare is about to ask the visitor to do something. */
  "before-interactive-callback": () => void
  "after-interactive-callback": () => void
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

interface TokenWaiter {
  resolve: (token: string) => void
  reject: (error: Error) => void
}

export interface UseTurnstileOptions {
  /** Defaults to NEXT_PUBLIC_TURNSTILE_SITE_KEY. Without a key the check is off. */
  siteKey?: string
  theme?: TurnstileRenderOptions["theme"]
}

export interface UseTurnstileResult {
  /**
   * Pass as the `ref` of an empty <div> where the widget should live. It's a
   * callback ref (not a ref object), so the widget attaches as soon as the div
   * exists. Deliberately not named `...Ref`: React's lint treats that suffix
   * as a ref object and rejects reading it during render.
   */
  attachWidget: (node: HTMLDivElement | null) => void
  /**
   * Resolves a fresh, single-use token to send with a request, or undefined
   * when no site key is configured. Call it once per request that needs
   * verifying: Cloudflare accepts each token only once.
   */
  getToken: () => Promise<string | undefined>
  /**
   * True while Cloudflare is showing its tick box and the visitor hasn't
   * completed it yet. Use it to keep a submit button disabled so nobody presses
   * send before they can possibly have a token. It's false whenever the check
   * runs invisibly, which is most of the time.
   */
  isInteractionRequired: boolean
  isEnabled: boolean
}

let scriptPromise: Promise<TurnstileApi> | undefined

/** Loads Cloudflare's script once per page, however many forms ask for it. */
function loadTurnstileScript(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error("useTurnstile: script loaded without turnstile"))
    script.onerror = () => {
      scriptPromise = undefined
      reject(new Error("useTurnstile: failed to load the Turnstile script"))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

/**
 * Cloudflare Turnstile bot check for any form. Drop this folder into a
 * project, put the returned `attachWidget` on an empty div's `ref`, and `await
 * getToken()` for each request you send to a server that verifies it (see
 * README.md).
 *
 * Tokens are single-use, so after one is handed out the widget resets itself
 * to have the next one ready before it's asked for.
 */
export function useTurnstile({
  siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  theme = "dark",
}: UseTurnstileOptions = {}): UseTurnstileResult {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [isInteractionRequired, setIsInteractionRequired] = useState(false)
  const widgetIdRef = useRef<string | undefined>(undefined)
  const readyTokenRef = useRef<string | undefined>(undefined)
  const waitersRef = useRef<TokenWaiter[]>([])

  const resetWidget = useCallback(() => {
    const widgetId = widgetIdRef.current
    if (widgetId) window.turnstile?.reset(widgetId)
  }, [])

  useEffect(() => {
    if (!siteKey || !container) return
    let isCancelled = false
    const waiters = waitersRef.current

    loadTurnstileScript()
      .then((turnstile) => {
        if (isCancelled) return
        widgetIdRef.current = turnstile.render(container, {
          sitekey: siteKey,
          theme,
          appearance: "interaction-only",
          "before-interactive-callback": () => setIsInteractionRequired(true),
          "after-interactive-callback": () => setIsInteractionRequired(false),
          callback: (token) => {
            setIsInteractionRequired(false)
            const waiter = waiters.shift()
            if (!waiter) {
              readyTokenRef.current = token
              return
            }
            waiter.resolve(token)
            // That token is spent; start fetching the next one.
            resetWidget()
          },
          "expired-callback": () => {
            readyTokenRef.current = undefined
            resetWidget()
          },
          "error-callback": () => {
            // An error offers the visitor nothing to tick, so don't leave the
            // form locked; the next send shows the bot-check message instead.
            setIsInteractionRequired(false)
            readyTokenRef.current = undefined
            waiters
              .splice(0)
              .forEach((waiter) =>
                waiter.reject(new Error("useTurnstile: the bot check failed")),
              )
          },
        })
      })
      .catch((error: Error) =>
        waiters.splice(0).forEach((waiter) => waiter.reject(error)),
      )

    return () => {
      isCancelled = true
      const widgetId = widgetIdRef.current
      if (widgetId) window.turnstile?.remove(widgetId)
      widgetIdRef.current = undefined
      readyTokenRef.current = undefined
    }
  }, [siteKey, theme, container, resetWidget])

  const getToken = useCallback(async (): Promise<string | undefined> => {
    if (!siteKey) return undefined

    const readyToken = readyTokenRef.current
    if (readyToken) {
      readyTokenRef.current = undefined
      resetWidget()
      return readyToken
    }

    return new Promise<string>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        waitersRef.current = waitersRef.current.filter(
          (waiter) => waiter !== entry,
        )
        reject(new Error("useTurnstile: timed out waiting for a token"))
      }, TOKEN_WAIT_TIMEOUT_MS)
      const entry: TokenWaiter = {
        resolve: (token) => {
          clearTimeout(timeoutId)
          resolve(token)
        },
        reject: (error) => {
          clearTimeout(timeoutId)
          reject(error)
        },
      }
      waitersRef.current.push(entry)
    })
  }, [siteKey, resetWidget])

  return {
    attachWidget: setContainer,
    getToken,
    isInteractionRequired,
    isEnabled: Boolean(siteKey),
  }
}
