"use client"

export interface IEmailAttachment {
  filename: string
  contentType: string
  /** Base64 text without a data: URL prefix. */
  content: string
  /** When set, the HTML can show the file inline with src="cid:<contentId>". */
  contentId?: string
}

/**
 * A second email sent in the same request, e.g. a reply to the person who
 * filled in the form. One request means one bot-check token covers both
 * emails, and `includeAttachments` reuses the first email's attachments
 * rather than uploading them twice.
 */
export interface IProxyConfirmationEmail {
  to: string
  subject: string
  html: string
  replyTo?: string
  includeAttachments?: boolean
}

export interface IProxyEmail {
  to: string
  subject: string
  html: string
  replyTo?: string
  attachments?: IEmailAttachment[]
  confirmation?: IProxyConfirmationEmail
}

export interface IProxyResult {
  /** Present only when a confirmation was requested. */
  confirmationSent?: boolean
}

/** Thrown when the bot check couldn't be completed or the proxy refused it. */
export class BotCheckError extends Error {}

export const BOT_CHECK_ERROR_MESSAGE =
  "We couldn't confirm you're human. If a 'Verify you are human' box is showing, please tick it, then try again."

/** Resolves a fresh bot-check token, or undefined when the check is off. */
export type TGetTurnstileToken = () => Promise<string | undefined>

const mailProxyUrl = process.env.NEXT_PUBLIC_MAIL_PROXY_URL
const mailProxySecret = process.env.NEXT_PUBLIC_MAIL_PROXY_SECRET

/**
 * Escapes a value for safe HTML insertion, then converts line breaks to
 * <br /> — CSS white-space: pre-line isn't reliably honoured by Outlook's
 * Word-based rendering engine, but every email client respects a literal
 * <br /> tag.
 */
export function escapeHtmlPreservingLineBreaks(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("\n", "<br />")
}

/**
 * Fetches a template from /public and fills in its {{token}} placeholders —
 * fetched at send time so the template files (editable and previewable
 * directly in a browser) stay the single source of truth. {{base_url}}
 * resolves to the current origin so the same file works in dev, the dev
 * site, and production.
 *
 * `tokens` are escaped. `trustedHtmlTokens` are inserted as-is, so only pass
 * markup this code built itself — never anything a visitor typed.
 */
export async function renderEmailTemplate(
  templatePath: string,
  tokens: Record<string, string>,
  trustedHtmlTokens: Record<string, string> = {},
): Promise<string> {
  const response = await fetch(templatePath)
  if (!response.ok) {
    throw new Error(
      `renderEmailTemplate: failed to fetch ${templatePath} (${response.status})`,
    )
  }
  const templateHtml = await response.text()
  const escapedHtml = Object.entries({
    base_url: window.location.origin,
    ...tokens,
  }).reduce(
    (html, [token, value]) =>
      html.replaceAll(`{{${token}}}`, escapeHtmlPreservingLineBreaks(value)),
    templateHtml,
  )
  return Object.entries(trustedHtmlTokens).reduce(
    (html, [token, value]) => html.replaceAll(`{{${token}}}`, value),
    escapedHtml,
  )
}

/**
 * Sends one email through the Resend-backed proxy (a small Vercel function
 * in the separate skim-reapers-mail-proxy project) — this static export has
 * no server runtime to hold a Resend API key, so the key lives only in that
 * proxy's environment, never in this bundle.
 */
export async function sendViaProxy(
  email: IProxyEmail,
  getTurnstileToken?: TGetTurnstileToken,
): Promise<IProxyResult> {
  if (!mailProxyUrl) {
    throw new Error("sendViaProxy: missing NEXT_PUBLIC_MAIL_PROXY_URL env var")
  }
  // One token per request: Cloudflare accepts each token only once.
  let turnstileToken: string | undefined
  try {
    turnstileToken = await getTurnstileToken?.()
  } catch (error) {
    throw new BotCheckError(
      error instanceof Error ? error.message : "bot check failed",
    )
  }
  const response = await fetch(mailProxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(mailProxySecret ? { "X-Proxy-Secret": mailProxySecret } : {}),
    },
    body: JSON.stringify({
      ...email,
      ...(turnstileToken ? { turnstileToken } : {}),
    }),
  })
  if (response.status === 403) {
    throw new BotCheckError("sendViaProxy: the proxy refused the bot check")
  }
  if (!response.ok) {
    throw new Error(`sendViaProxy: proxy responded ${response.status}`)
  }
  return (await response.json().catch(() => ({}))) as IProxyResult
}

export const isMailProxyConfigured = Boolean(mailProxyUrl)
