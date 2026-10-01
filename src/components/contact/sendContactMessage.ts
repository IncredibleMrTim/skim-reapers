"use client"

import {
  contactFormSchema,
  type IContactFormValues,
} from "@/lib/contactFormSchema"

export interface IContactSubmissionResult {
  isSuccess: boolean
  errorMessage?: string
}

const GENERIC_ERROR_MESSAGE =
  "Something went wrong sending your message. Please try again or call us directly."

const CONFIRMATION_TEMPLATE_PATH = "/emailTemplate.html"
const NOTIFICATION_TEMPLATE_PATH = "/notificationEmailTemplate.html"
const NOTIFICATION_TO_EMAIL = "info@skimreapers.co.uk"

const mailProxyUrl = process.env.NEXT_PUBLIC_MAIL_PROXY_URL
const mailProxySecret = process.env.NEXT_PUBLIC_MAIL_PROXY_SECRET

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

/**
 * Fetches a template from /public and fills in its {{token}} placeholders —
 * fetched at send time so the template files (editable and previewable
 * directly in a browser) stay the single source of truth. {{base_url}}
 * resolves to the current origin so the same file works in dev, the dev
 * site, and production.
 */
async function renderEmailTemplate(
  templatePath: string,
  tokens: Record<string, string>,
): Promise<string> {
  const response = await fetch(templatePath)
  if (!response.ok) {
    throw new Error(
      `renderEmailTemplate: failed to fetch ${templatePath} (${response.status})`,
    )
  }
  const templateHtml = await response.text()
  return Object.entries({ base_url: window.location.origin, ...tokens }).reduce(
    (html, [token, value]) =>
      html.replaceAll(`{{${token}}}`, escapeHtml(value)),
    templateHtml,
  )
}

/**
 * Sends one email through the Resend-backed proxy (a small Vercel function
 * in the separate skim-reapers-mail-proxy project) — this static export has
 * no server runtime to hold a Resend API key, so the key lives only in that
 * proxy's environment, never in this bundle.
 */
async function sendViaProxy(email: {
  to: string
  subject: string
  html: string
  replyTo?: string
}): Promise<void> {
  if (!mailProxyUrl) {
    throw new Error("sendViaProxy: missing NEXT_PUBLIC_MAIL_PROXY_URL env var")
  }
  const response = await fetch(mailProxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(mailProxySecret ? { "X-Proxy-Secret": mailProxySecret } : {}),
    },
    body: JSON.stringify(email),
  })
  if (!response.ok) {
    throw new Error(`sendViaProxy: proxy responded ${response.status}`)
  }
}

/**
 * Sends the quote-request notification to Skim Reapers and a confirmation
 * email back to the enquirer.
 */
export async function sendContactMessage(
  formValues: IContactFormValues,
  honeypot?: string,
): Promise<IContactSubmissionResult> {
  if (honeypot) {
    return { isSuccess: true }
  }

  const parsedFormValues = contactFormSchema.safeParse(formValues)
  if (!parsedFormValues.success) {
    return {
      isSuccess: false,
      errorMessage:
        parsedFormValues.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    }
  }

  if (!mailProxyUrl) {
    console.error("sendContactMessage: missing NEXT_PUBLIC_MAIL_PROXY_URL env var")
    return { isSuccess: false, errorMessage: GENERIC_ERROR_MESSAGE }
  }

  const { name, email, business, phone, message } = parsedFormValues.data

  try {
    const notificationHtml = await renderEmailTemplate(
      NOTIFICATION_TEMPLATE_PATH,
      { name, email, business, phone, message },
    )
    await sendViaProxy({
      to: NOTIFICATION_TO_EMAIL,
      subject: `New quote request from ${name}`,
      html: notificationHtml,
      replyTo: email,
    })
  } catch (error) {
    console.error("sendContactMessage:", error)
    return { isSuccess: false, errorMessage: GENERIC_ERROR_MESSAGE }
  }

  try {
    const confirmationHtml = await renderEmailTemplate(
      CONFIRMATION_TEMPLATE_PATH,
      { name, message },
    )
    await sendViaProxy({
      to: email,
      subject: "We've received your message — Skim Reapers",
      html: confirmationHtml,
      replyTo: NOTIFICATION_TO_EMAIL,
    })
  } catch (error) {
    console.error("sendContactMessage: confirmation email failed:", error)
  }

  return { isSuccess: true }
}
