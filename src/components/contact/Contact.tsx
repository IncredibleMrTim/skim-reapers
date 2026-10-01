"use client"

import { useMemo, useState } from "react"
import { sendContactMessage } from "@/components/contact/sendContactMessage"

import { contactFormSchema, type IContactFormValues } from "@/lib/contactFormSchema"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

export interface IContactDetail {
  icon: string
  label: string
  value: string
}

export interface IContactFormField {
  id: "name" | "email" | "business" | "phone"
  label: string
  type: string
  placeholder: string
  isRequired: boolean
}

export const INITIAL_FORM_VALUES: IContactFormValues = {
  name: "",
  email: "",
  business: "",
  phone: "",
  message: "",
}

export const CONTACT_DETAILS: IContactDetail[] = [
  { icon: "📞", label: "Phone", value: "+44 (0)7914 025 843" },
  { icon: "✉️", label: "Email", value: "info@skimreapers.co.uk" },
  { icon: "🕐", label: "Hours", value: "Mon–Fri, 8am–6pm" },
]

export const CONTACT_FORM_FIELDS: IContactFormField[] = [
  {
    id: "name",
    label: "Your name",
    type: "text",
    placeholder: "John Smith",
    isRequired: true,
  },
  {
    id: "email",
    label: "Your email",
    type: "email",
    placeholder: "myname@gmail.com",
    isRequired: true,
  },
  {
    id: "business",
    label: "Business Name (optional)",
    type: "text",
    placeholder: "John Smith",
    isRequired: false,
  },
  {
    id: "phone",
    label: "Phone number",
    type: "tel",
    placeholder: "07700 000000",
    isRequired: false,
  },
]

export default function Contact() {
  const [formValues, setFormValues] =
    useState<IContactFormValues>(INITIAL_FORM_VALUES)
  const [honeypot, setHoneypot] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof IContactFormValues, boolean>>
  >({})

  const validationResult = useMemo(
    () => contactFormSchema.safeParse(formValues),
    [formValues],
  )
  const isFormValid = validationResult.success

  const fieldErrors = useMemo(() => {
    const errors: Partial<Record<keyof IContactFormValues, string>> = {}
    if (!validationResult.success) {
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0] as keyof IContactFormValues
        if (!errors[fieldName]) {
          errors[fieldName] = issue.message
        }
      }
    }
    return errors
  }, [validationResult])

  function handleFieldBlur(fieldId: keyof IContactFormValues) {
    setTouchedFields((previousTouchedFields) => ({
      ...previousTouchedFields,
      [fieldId]: true,
    }))
  }

  function getFieldInputClassName(fieldId: keyof IContactFormValues) {
    const isFieldInvalid = Boolean(
      touchedFields[fieldId] && fieldErrors[fieldId],
    )
    return `w-full rounded-lg border px-4 py-2.5 text-sm text-accent-foreground focus:outline-none ${
      isFieldInvalid ? "border-red-500 bg-red-50" : "border-[#d0c8b8]"
    }`
  }

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault()
    setIsSending(true)
    setErrorMessage(null)

    const result = await sendContactMessage(formValues, honeypot)

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
    <section id="contact" className="bg-cream-dark py-20">
      <div className="grid pr-4 items-start gap-16 md:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-4xl font-bold text-brand-navy">
            {`Let's talk about your project.`}
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-stone">
            {`Send us a message and I'll come back to you within one working day — usually much sooner.`}
          </p>
          <div className="flex flex-col space-y-5 justify-center">
            {CONTACT_DETAILS.map((detail) => (
              <div
                key={detail.label}
                className="grid grid-cols-[40px_1fr] my-auto  items-start pb-4"
              >
                <div className="">{detail.icon}</div>
                <div>
                  <div className="text-xs tracking-wide uppercase">
                    {detail.label}
                  </div>
                  <div className="font-medium flex items-center ">
                    {detail.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <p className="text-brand-accent-light italic text-xl">
              {`EXCEPTIONAL WORKMANSHIP, WITHOUT THE HASSLE.`}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
          {isSubmitted ? (
            <div className=" text-center">
              <h3 className="mb-2 font-display text-xl font-semibold text-brand-accent">
                {`Thanks for contacting Skim Reapers.  We'll be in touch shortly to discuss your project.`}
              </h3>
              <Separator
                className="from-brand-content via-black to-brand-content opacity-40 hidden md:block my-4"
                variant="linear"
              />
              <div className="w-full text-left">
                <p className="text-sm text-brand-muted font-bold pb-4">{`What Happens Next?`}</p>
                <p className="text-sm text-brand-muted">{`Our team will review your project and get back to you as soon as possible to help build your quote.`}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="mb-6 font-display text-xl font-semibold text-brand-accent">
                Get your free quote
              </h3>
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
              {CONTACT_FORM_FIELDS.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="mb-1.5 block text-sm font-medium text-brand-accent"
                  >
                    {field.label}
                    {field.isRequired && (
                      <span className="text-brand-brick"> *</span>
                    )}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    inputMode={field.id === "phone" ? "numeric" : undefined}
                    placeholder={field.placeholder}
                    value={formValues[field.id]}
                    onChange={(event) =>
                      setFormValues({
                        ...formValues,
                        [field.id]:
                          field.id === "phone"
                            ? event.target.value.replace(/\D/g, "")
                            : event.target.value,
                      })
                    }
                    onBlur={() => handleFieldBlur(field.id)}
                    className={getFieldInputClassName(field.id)}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-brand-accent"
                >
                  Tell us about your project.
                  <span className="text-brand-brick"> *</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="e.g. I would like to re-plaster my office..."
                  value={formValues.message}
                  onChange={(event) =>
                    setFormValues({
                      ...formValues,
                      message: event.target.value,
                    })
                  }
                  onBlur={() => handleFieldBlur("message")}
                  className={`resize-none ${getFieldInputClassName("message")}`}
                />
              </div>
              {errorMessage && (
                <p className="text-sm text-brand-brick-dark">{errorMessage}</p>
              )}
              <div className="w-full flex justify-end">
                <Button
                  type="submit"
                  variant="default"
                  size="2xl"
                  disabled={isSending || !isFormValid}
                  className="text-white w-full md:w-auto"
                >
                  {isSending ? "Sending…" : "Send my free quote request →"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
