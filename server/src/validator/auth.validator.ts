import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters long"),
  email: z
    .email("Invalid email address")
    .toLowerCase()
    .trim()
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long"),
});

export const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .toLowerCase()
    .trim()
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long"),
});

export type RegisterType = z.infer<typeof registerSchema>;
export type LoginType = z.infer<typeof loginSchema>;
