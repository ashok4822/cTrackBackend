import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const googleLoginSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Google token is required"),
  }),
});

export const signupSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().optional(),
    companyName: z.string().optional(),
  }),
});
