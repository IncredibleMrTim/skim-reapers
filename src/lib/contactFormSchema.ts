import { z } from "zod"

export interface IContactFormValues {
  name: string
  email: string
  business: string
  phone: string
  message: string
}

export const contactFormSchema: z.ZodType<IContactFormValues> = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email")
    .email("Please enter a valid email address"),
  business: z.string(),
  phone: z.string().regex(/^\d*$/, "Phone number can only contain numbers"),
  message: z.string().trim().min(1, "Please tell us a bit about what you need"),
})
