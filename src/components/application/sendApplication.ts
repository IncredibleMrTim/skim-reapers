"use client"

import {
  applicationFormSchema,
  type IApplicationFormValues,
} from "@/lib/applicationFormSchema"
import { buildRoleSectionHtml } from "@/lib/applicationEmailHtml"
import { compressPhotosForEmail } from "@/lib/compressPhotos"
import {
  BOT_CHECK_ERROR_MESSAGE,
  BotCheckError,
  escapeHtmlPreservingLineBreaks,
  isMailProxyConfigured,
  renderEmailTemplate,
  sendViaProxy,
  type IEmailAttachment,
  type IProxyConfirmationEmail,
  type TGetTurnstileToken,
} from "@/lib/mailProxy"

/** The vacancy being applied for; `description` is plain text for the email. */
export interface IApplicationVacancy {
  title: string
  description?: string
}

export interface IApplicationSubmissionResult {
  isSuccess: boolean
  errorMessage?: string
}

const GENERIC_ERROR_MESSAGE =
  "Something went wrong sending your application. Please try again or call us directly."
const PHOTO_ERROR_MESSAGE =
  "We couldn't read one of your photos. Please remove it and try a JPEG, PNG or WebP image."

const NOTIFICATION_TEMPLATE_PATH = "/applicationNotificationEmailTemplate.html"
const CONFIRMATION_TEMPLATE_PATH = "/applicationConfirmationEmailTemplate.html"
const NOTIFICATION_TO_EMAIL = "info@skimreapers.co.uk"

/** Built here from photo count only — never from visitor-typed text. */
function buildPhotosSectionHtml(
  photos: IEmailAttachment[],
  heading: string,
): string {
  if (photos.length === 0) {
    return '<p style="color: #6b6460;">No photos were attached.</p><br />'
  }
  const imageTags = photos
    .map(
      (photo, index) =>
        // Padding on a wrapper, not margin on the <img>: Apple Mail and
        // Outlook apply image margins inconsistently, but all respect padding.
        `<div style="padding: 0 0 16px 0;"><img src="cid:${photo.contentId}" alt="${escapeHtmlPreservingLineBreaks(`Photo ${index + 1} of previous work`)}" style="display: block; width: 100%; max-width: 560px; height: auto;" /></div>`,
    )
    .join("")
  return `<div style="border: 1px solid #e5e5e5; border-radius: 4px;"><h2 style="font-size: 18px; border-bottom: 1px solid #e5e5e5; background: #AF7C3C; color: #ffffff; margin: 0; padding: 10px;">${heading} (${photos.length})</h2><div style="padding: 10px;">${imageTags}</div></div><br />`
}

/**
 * Emails a subcontractor application, with the applicant's photos shown
 * inline, to Skim Reapers. Photos are shrunk in the browser first so the
 * whole request fits the mail proxy's size limit.
 */
export async function sendApplication(
  formValues: IApplicationFormValues,
  photoFiles: File[],
  honeypot?: string,
  vacancy?: IApplicationVacancy,
  getTurnstileToken?: TGetTurnstileToken,
): Promise<IApplicationSubmissionResult> {
  if (honeypot) {
    return { isSuccess: true }
  }

  const parsedFormValues = applicationFormSchema.safeParse(formValues)
  if (!parsedFormValues.success) {
    return {
      isSuccess: false,
      errorMessage:
        parsedFormValues.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    }
  }

  if (!isMailProxyConfigured) {
    console.error("sendApplication: missing NEXT_PUBLIC_MAIL_PROXY_URL env var")
    return { isSuccess: false, errorMessage: GENERIC_ERROR_MESSAGE }
  }

  let photos: IEmailAttachment[]
  try {
    photos = await compressPhotosForEmail(photoFiles)
  } catch (error) {
    console.error("sendApplication: photo compression failed:", error)
    return { isSuccess: false, errorMessage: PHOTO_ERROR_MESSAGE }
  }

  const {
    name,
    phone,
    email,
    location,
    trade,
    yearsOfExperience,
    skills,
    message,
  } = parsedFormValues.data

  // The reply is optional: if its template can't be built the application
  // still goes through without it. It's sent in the same request as the
  // notification, reusing the photos, so one bot-check token covers both.
  let confirmation: IProxyConfirmationEmail | undefined
  try {
    confirmation = {
      to: email,
      subject: "We've received your application — Skim Reapers",
      html: await renderEmailTemplate(
        CONFIRMATION_TEMPLATE_PATH,
        {
          vacancy: vacancy?.title || "General application",
          name,
          applied_for: vacancy
            ? `the ${vacancy.title} vacancy`
            : "a subcontractor position",
          location,
          trade,
          years_of_experience: yearsOfExperience,
          skills,
          message: message.trim() || "—",
          photos_received:
            photos.length === 0
              ? "No photos attached"
              : `${photos.length} ${photos.length === 1 ? "photo" : "photos"} received`,
        },
        {
          // Skipped when empty: the details box already says "No photos attached".
          photos_section: photos.length
            ? buildPhotosSectionHtml(photos, "Your photos")
            : "",
          role_section: vacancy
            ? buildRoleSectionHtml(vacancy.title, vacancy.description)
            : "",
        },
      ),
      replyTo: NOTIFICATION_TO_EMAIL,
      includeAttachments: true,
    }
  } catch (error) {
    console.error("sendApplication: confirmation email skipped:", error)
  }

  try {
    const notificationHtml = await renderEmailTemplate(
      NOTIFICATION_TEMPLATE_PATH,
      {
        vacancy: vacancy?.title || "General application",
        name,
        phone,
        email,
        location,
        trade,
        years_of_experience: yearsOfExperience,
        skills,
        message: message.trim() || "—",
      },
      { photos_section: buildPhotosSectionHtml(photos, "Previous work") },
    )
    const result = await sendViaProxy(
      {
        to: NOTIFICATION_TO_EMAIL,
        subject: `New application from ${name}${vacancy ? ` for ${vacancy.title}` : ""}`,
        html: notificationHtml,
        replyTo: email,
        attachments: photos,
        confirmation,
      },
      getTurnstileToken,
    )
    if (result.confirmationSent === false) {
      console.error("sendApplication: confirmation email failed")
    }
  } catch (error) {
    console.error("sendApplication:", error)
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
