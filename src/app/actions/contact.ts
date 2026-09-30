"use server"

import nodemailer from "nodemailer"
import { contactFormSchema } from "@/lib/contactFormSchema"

export interface IContactFormValues {
  name: string
  email: string
  business: string
  phone: string
  message: string
}

export interface IContactSubmissionResult {
  isSuccess: boolean
  errorMessage?: string
}

const GENERIC_ERROR_MESSAGE =
  "Something went wrong sending your message. Please try again or call us directly."

function buildEmailBody(formValues: IContactFormValues): string {
  return [
    `Name: ${formValues.name}`,
    `Email: ${formValues.email}`,
    `Business: ${formValues.business}`,
    `Phone: ${formValues.phone}`,
    "",
    formValues.message,
  ].join("\n")
}

function buildConfirmationEmailBody(formValues: IContactFormValues): string {
  return [
    `Hi ${formValues.name},`,
    "",
    "Thanks for getting in touch with Skim Reapers — I've received your message and will come back to you within one working day, usually much sooner.",
    "",
    "Here's a copy of what you sent:",
    "",
    formValues.message,
    "",
    "Speak soon,",
    "Skim Reapers Ltd.",
  ].join("\n")
}

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

  const smtpHost = process.env.SMTP_HOST
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD

  if (!smtpHost || !smtpUser || !smtpPassword) {
    console.error(
      "sendContactMessage: missing SMTP_HOST, SMTP_USER, or SMTP_PASSWORD env vars",
    )
    return { isSuccess: false, errorMessage: GENERIC_ERROR_MESSAGE }
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  })

  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? smtpUser

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: process.env.CONTACT_TO_EMAIL ?? "hello@townsquaredigital.co.uk",
      replyTo: parsedFormValues.data.email,
      subject: `New quote request from ${parsedFormValues.data.name}`,
      text: buildEmailBody(parsedFormValues.data),
    })
  } catch (error) {
    console.error("sendContactMessage:", error)
    return { isSuccess: false, errorMessage: GENERIC_ERROR_MESSAGE }
  }

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: parsedFormValues.data.email,
      subject: "We've received your message — Town Square Digital",
      text: buildConfirmationEmailBody(parsedFormValues.data),
    })
  } catch (error) {
    console.error("sendContactMessage: confirmation email failed:", error)
  }

  return { isSuccess: true }
}
