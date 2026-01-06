import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  SESSION_SECRET: z.string().min(1, "SESSION_SECRET is required"),
  SESSION_EXPIRY: z.string().min(1, "SESSION_EXPIRY is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_CALLBACK_URL: z.string().min(1, "GOOGLE_CALLBACK_URL is required"),
  FRONTEND_ORIGIN: z.string().min(1, "FRONTEND_ORIGIN is required"),
  FRONTEND_GOOGLE_CALLBACK_URL: z
    .string()
    .min(1, "FRONTEND_GOOGLE_CALLBACK_URL is required"),
});

export type EnvVariables = z.infer<typeof envSchema>;
