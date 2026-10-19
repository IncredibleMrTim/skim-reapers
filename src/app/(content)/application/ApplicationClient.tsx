"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { PageContainer } from "@/components/PageContainer"
import { CtaButtons } from "@/components/CtaButtons"
import { PhotoPicker } from "@/components/application/PhotoPicker"
import { sendApplication } from "@/components/application/sendApplication"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { Button } from "@/components/ui/button"
import {
  applicationFormSchema,
  type IApplicationFormValues,
} from "@/lib/applicationFormSchema"
import { VACANCY_QUERY_PARAM } from "@/lib/applicationLinks"
import { portableTextToPlainText } from "@/lib/applicationEmailHtml"
import { useTurnstile } from "@/lib/turnstile"
import { useLiveSanityData } from "@/sanity/live"
import { applicationPageQuery } from "@/sanity/queries"
import type { ApplicationPageQueryResult } from "@/sanity/types"

interface ApplicationClientProps {
  initialData: ApplicationPageQueryResult
}

// Shown until the Application Page document is filled in in the Studio,
// so the page is never blank. Content added in the Studio replaces these.
const DEFAULT_PHOTOS_HEADING = "Show us your work"
const DEFAULT_PHOTOS_DESCRIPTION =
  "Upload photographs of previous work, ideally showing finish quality, attention to detail and range of skills."
const DEFAULT_WHAT_HAPPENS_NEXT_HEADING = "What happens next?"
const DEFAULT_WHAT_HAPPENS_NEXT =
  "Applications are reviewed on experience, previous work, availability and suitability for the team. Where appropriate we'll contact you to discuss your experience and may ask for further examples of work before considering you for a project."
const DEFAULT_SUCCESS_MESSAGE =
  "Thanks for applying to Skim Reapers. We'll be in touch if your application is a good fit."

type TApplicationFieldId = Exclude<keyof IApplicationFormValues, "message">

interface IApplicationFormField {
  id: TApplicationFieldId
  label: string
  type: string
  placeholder: string
}

const INITIAL_FORM_VALUES: IApplicationFormValues = {
  name: "",
  phone: "",
  email: "",
  location: "",
  trade: "",
  yearsOfExperience: "",
  skills: "",
  message: "",
}

const NUMERIC_FIELD_IDS: TApplicationFieldId[] = ["phone", "yearsOfExperience"]

const APPLICATION_FORM_FIELDS: IApplicationFormField[] = [
  { id: "name", label: "Name", type: "text", placeholder: "John Smith" },
  {
    id: "phone",
    label: "Phone number",
    type: "tel",
    placeholder: "07700 000000",
  },
  {
    id: "email",
    label: "Email address",
    type: "email",
    placeholder: "myname@gmail.com",
  },
  { id: "location", label: "Location", type: "text", placeholder: "Leeds" },
  {
    id: "trade",
    label: "Trade / role",
    type: "text",
    placeholder: "Plasterer",
  },
  {
    id: "yearsOfExperience",
    label: "Years of experience",
    type: "text",
    placeholder: "10",
  },
]

export const ApplicationClient = ({ initialData }: ApplicationClientProps) => {
  const query = useLiveSanityData(applicationPageQuery, initialData)
  const vacancyKey = useSearchParams().get(VACANCY_QUERY_PARAM)
  const selectedVacancy = query?.vacancies?.find(
    (vacancy) => vacancy._key === vacancyKey,
  )
  const [formValues, setFormValues] =
    useState<IApplicationFormValues>(INITIAL_FORM_VALUES)
  const [photos, setPhotos] = useState<File[]>([])
  const [honeypot, setHoneypot] = useState("")
  const { attachWidget, getToken, isInteractionRequired } = useTurnstile()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof IApplicationFormValues, boolean>>
  >({})

  const validationResult = useMemo(
    () => applicationFormSchema.safeParse(formValues),
    [formValues],
  )

  const fieldErrors = useMemo(() => {
    const errors: Partial<Record<keyof IApplicationFormValues, string>> = {}
    if (!validationResult.success) {
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0] as keyof IApplicationFormValues
        if (!errors[fieldName]) errors[fieldName] = issue.message
      }
    }
    return errors
  }, [validationResult])

  function updateField(fieldId: keyof IApplicationFormValues, value: string) {
    setFormValues((previousValues) => ({ ...previousValues, [fieldId]: value }))
  }

  function handleFieldBlur(fieldId: keyof IApplicationFormValues) {
    setTouchedFields((previousTouchedFields) => ({
      ...previousTouchedFields,
      [fieldId]: true,
    }))
  }

  function getFieldInputClassName(fieldId: keyof IApplicationFormValues) {
    const isFieldInvalid = Boolean(
      touchedFields[fieldId] && fieldErrors[fieldId],
    )
    return `w-full rounded-lg border px-4 py-2.5 text-sm text-brand-foreground placeholder:text-brand-foreground/40 focus:outline-none ${
      isFieldInvalid ? "border-red-500 bg-red-500/10" : "border-[#d0c8b8]"
    }`
  }

  function renderFieldError(fieldId: keyof IApplicationFormValues) {
    if (!touchedFields[fieldId] || !fieldErrors[fieldId]) return null
    return (
      <p className="mt-1 text-xs text-brand-brick-dark">
        {fieldErrors[fieldId]}
      </p>
    )
  }

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault()
    setIsSending(true)
    setErrorMessage(null)

    const result = await sendApplication(
      formValues,
      photos,
      honeypot,
      selectedVacancy?.heading
        ? {
            title: selectedVacancy.heading,
            description: portableTextToPlainText(selectedVacancy.description),
          }
        : undefined,
      getToken,
    )

    setIsSending(false)
    if (result.isSuccess) {
      setIsSubmitted(true)
    } else {
      setErrorMessage(
        result.errorMessage ?? "Something went wrong. Please try again.",
      )
    }
  }

  return (
    <>
      <Header
        hero={query?.hero ?? undefined}
        showHeroImageOnMobile={false}
        showHeroTextOnMobile={false}
      />
      <PageContainer
        hero={query?.hero ?? undefined}
        heading={query?.heading}
        showHeading={query?.showHeading}
        pageDescription={query?.pageDescription}
        fillHeight
      >
        <div className="pr-8">
          {isSubmitted ? (
            <div className="rounded-2xl border border-line bg-white/2 backdrop-blur-lg p-8 shadow-sm">
              {query?.successMessage ? (
                <PortableText
                  value={query.successMessage}
                  components={PORTABLE_TEXT_COMPONENTS}
                />
              ) : (
                <h3 className="font-display text-xl font-semibold text-brand-accent">
                  {DEFAULT_SUCCESS_MESSAGE}
                </h3>
              )}
              {query?.successButtons && (
                <div className="mt-6">
                  <CtaButtons buttons={query.successButtons} />
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {selectedVacancy?.heading && (
                <p className="rounded border bg-white/2 p-4 text-sm backdrop-blur-lg">
                  Applying for:{" "}
                  <span className="font-bold text-brand-accent-light">
                    {selectedVacancy.heading}
                  </span>
                </p>
              )}
              <input
                type="text"
                name="company_website"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white/2 backdrop-blur-lg p-8 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-brand-accent">
                  Your details
                </h2>
                {APPLICATION_FORM_FIELDS.map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="mb-1.5 block text-sm font-medium text-brand-accent"
                    >
                      {field.label}
                      <span className="text-brand-brick"> *</span>
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      inputMode={
                        NUMERIC_FIELD_IDS.includes(field.id)
                          ? "numeric"
                          : undefined
                      }
                      placeholder={field.placeholder}
                      value={formValues[field.id]}
                      onChange={(event) =>
                        updateField(
                          field.id,
                          NUMERIC_FIELD_IDS.includes(field.id)
                            ? event.target.value.replace(/\D/g, "")
                            : event.target.value,
                        )
                      }
                      onBlur={() => handleFieldBlur(field.id)}
                      className={getFieldInputClassName(field.id)}
                    />
                    {renderFieldError(field.id)}
                  </div>
                ))}
                <div>
                  <label
                    htmlFor="skills"
                    className="mb-1.5 block text-sm font-medium text-brand-accent"
                  >
                    Main skills / specialisms
                    <span className="text-brand-brick"> *</span>
                  </label>
                  <textarea
                    id="skills"
                    rows={3}
                    value={formValues.skills}
                    onChange={(event) =>
                      updateField("skills", event.target.value)
                    }
                    onBlur={() => handleFieldBlur("skills")}
                    className={`resize-none ${getFieldInputClassName("skills")}`}
                  />
                  {renderFieldError("skills")}
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-brand-accent"
                  >
                    {`Anything else you'd like us to know?`}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formValues.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    className={`resize-none ${getFieldInputClassName("message")}`}
                  />
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h2 className="text-brand-accent text-lg font-bold">
                  {query?.photosHeading ?? DEFAULT_PHOTOS_HEADING}
                </h2>
                {query?.photosDescription ? (
                  <PortableText
                    value={query.photosDescription}
                    components={PORTABLE_TEXT_COMPONENTS}
                  />
                ) : (
                  <p className="text-sm">{DEFAULT_PHOTOS_DESCRIPTION}</p>
                )}
                <PhotoPicker
                  photos={photos}
                  onChange={setPhotos}
                  isDisabled={isSending}
                />
              </section>

              <div ref={attachWidget} />
              {errorMessage && (
                <p className="text-sm text-brand-accent">{errorMessage}</p>
              )}
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="rounded border p-4 text-sm md:max-w-md">
                  <p className="mb-2 font-bold text-brand-accent">
                    {query?.whatHappensNextHeading ??
                      DEFAULT_WHAT_HAPPENS_NEXT_HEADING}
                  </p>
                  {query?.whatHappensNext ? (
                    <PortableText
                      value={query.whatHappensNext}
                      components={PORTABLE_TEXT_COMPONENTS}
                    />
                  ) : (
                    <p>{DEFAULT_WHAT_HAPPENS_NEXT}</p>
                  )}
                </div>
                <div className="flex gap-4">
                  {query?.buttons && <CtaButtons buttons={query.buttons} />}
                  <Button
                    type="submit"
                    variant="default"
                    size="2xl"
                    disabled={
                      isSending ||
                      !validationResult.success ||
                      isInteractionRequired
                    }
                    className="w-full rounded md:w-auto"
                  >
                    {isSending ? "Sending…" : "Submit application"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </PageContainer>
    </>
  )
}
