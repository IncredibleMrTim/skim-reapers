import { z } from "zod"

export interface IApplicationFormValues {
  name: string
  phone: string
  email: string
  location: string
  trade: string
  yearsOfExperience: string
  skills: string
  message: string
}

export const applicationFormSchema: z.ZodType<IApplicationFormValues> =
  z.object({
    name: z.string().trim().min(1, "Please enter your name"),
    phone: z
      .string()
      .min(1, "Please enter your phone number")
      .regex(/^\d*$/, "Phone number can only contain numbers"),
    email: z
      .string()
      .trim()
      .min(1, "Please enter your email")
      .email("Please enter a valid email address"),
    location: z.string().trim().min(1, "Please tell us where you are based"),
    trade: z.string().trim().min(1, "Please tell us your trade or role"),
    yearsOfExperience: z
      .string()
      .trim()
      .min(1, "Please enter your years of experience")
      .regex(/^\d{1,2}$/, "Please enter a whole number of years"),
    skills: z.string().trim().min(1, "Please tell us your main skills"),
    message: z.string(),
  })
