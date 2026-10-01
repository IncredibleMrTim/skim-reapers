"use client"

import emailjs from "@emailjs/browser"

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

const emailJsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
const emailJsNotificationTemplateId =
  process.env.NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE_ID
const emailJsConfirmationTemplateId =
  process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID
const emailJsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

/**
 * Renders /public/emailTemplate.html for the confirmation email — fetched
 * at send time so the template file (editable and previewable directly in
 * a browser) stays the single source of truth instead of a copy pasted
 * into the EmailJS dashboard. {{base_url}} resolves to the current origin
 * so the same file works in dev, the dev site, and production.
 */
async function buildConfirmationEmailHtml(
  name: string,
  message: string,
): Promise<string> {
  const response = await fetch(CONFIRMATION_TEMPLATE_PATH)
  if (!response.ok) {
    throw new Error(
      `buildConfirmationEmailHtml: failed to fetch ${CONFIRMATION_TEMPLATE_PATH} (${response.status})`,
    )
  }
  const templateHtml = await response.text()
  return templateHtml
    .replaceAll("{{base_url}}", window.location.origin)
    .replaceAll("{{name}}", escapeHtml(name))
    .replaceAll("{{message}}", escapeHtml(message))
}

/**
 * Sends the quote-request notification to Skim Reapers and a confirmation
 * email back to the enquirer, both via EmailJS (client-side — this is a
 * static export with no server runtime to hold SMTP credentials).
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

  if (
    !emailJsServiceId ||
    !emailJsNotificationTemplateId ||
    !emailJsConfirmationTemplateId ||
    !emailJsPublicKey
  ) {
    console.error(
      "sendContactMessage: missing NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID, or NEXT_PUBLIC_EMAILJS_PUBLIC_KEY env vars",
    )
    return { isSuccess: false, errorMessage: GENERIC_ERROR_MESSAGE }
  }

  const { name, email, business, phone, message } = parsedFormValues.data

  try {
    await emailjs.send(
      emailJsServiceId,
      emailJsNotificationTemplateId,
      { name, email, business, phone, message },
      { publicKey: emailJsPublicKey },
    )
  } catch (error) {
    console.error("sendContactMessage:", error)
    return { isSuccess: false, errorMessage: GENERIC_ERROR_MESSAGE }
  }

  try {
    const confirmationHtml = await buildConfirmationEmailHtml(name, message)
    await emailjs.send(
      emailJsServiceId,
      emailJsConfirmationTemplateId,
      { to_email: email, html: confirmationHtml },
      { publicKey: emailJsPublicKey },
    )
  } catch (error) {
    console.error("sendContactMessage: confirmation email failed:", error)
  }

  return { isSuccess: true }
}
