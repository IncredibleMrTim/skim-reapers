"use client"

import {
  contactFormSchema,
  type IContactFormValues,
} from "@/lib/contactFormSchema"
import {
  BOT_CHECK_ERROR_MESSAGE,
  BotCheckError,
  isMailProxyConfigured,
  renderEmailTemplate,
  sendViaProxy,
  type IProxyConfirmationEmail,
  type TGetTurnstileToken,
} from "@/lib/mailProxy"

export interface IContactSubmissionResult {
  isSuccess: boolean
  errorMessage?: string
}

const GENERIC_ERROR_MESSAGE =
  "Something went wrong sending your message. Please try again or call us directly."

const CONFIRMATION_TEMPLATE_PATH = "/emailTemplate.html"
const NOTIFICATION_TEMPLATE_PATH = "/notificationEmailTemplate.html"
const NOTIFICATION_TO_EMAIL = "info@skimreapers.co.uk"

/**
 * Sends the quote-request notification to Skim Reapers and a confirmation
 * email back to the enquirer.
 */
export async function sendContactMessage(
  formValues: IContactFormValues,
  honeypot?: string,
  getTurnstileToken?: TGetTurnstileToken,
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

  if (!isMailProxyConfigured) {
    console.error(
      "sendContactMessage: missing NEXT_PUBLIC_MAIL_PROXY_URL env var",
    )
    return { isSuccess: false, errorMessage: GENERIC_ERROR_MESSAGE }
  }

  const { name, email, business, phone, message } = parsedFormValues.data

  // The reply is optional: if its template can't be built the enquiry still
  // goes through without it.
  let confirmation: IProxyConfirmationEmail | undefined
  try {
    confirmation = {
      to: email,
      subject: "We've received your message — Skim Reapers",
      html: await renderEmailTemplate(CONFIRMATION_TEMPLATE_PATH, {
        name,
        message,
      }),
      replyTo: NOTIFICATION_TO_EMAIL,
    }
  } catch (error) {
    console.error("sendContactMessage: confirmation email skipped:", error)
  }

  try {
    const notificationHtml = await renderEmailTemplate(
      NOTIFICATION_TEMPLATE_PATH,
      { name, email, business, phone, message },
    )
    const result = await sendViaProxy(
      {
        to: NOTIFICATION_TO_EMAIL,
        subject: `New quote request from ${name}`,
        html: notificationHtml,
        replyTo: email,
        confirmation,
      },
      getTurnstileToken,
    )
    if (result.confirmationSent === false) {
      console.error("sendContactMessage: confirmation email failed")
    }
  } catch (error) {
    console.error("sendContactMessage:", error)
    return {
      isSuccess: false,
      errorMessage:
        error instanceof BotCheckError
          ? BOT_CHECK_ERROR_MESSAGE
          : GENERIC_ERROR_MESSAGE,
    }
  }

  return { isSuccess: true }
}
