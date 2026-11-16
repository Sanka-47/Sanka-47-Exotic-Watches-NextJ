import { z } from "zod";

/**
 * Server-side environment validation. Fails fast during boot/build with a
 * readable list of missing variables instead of undefined values leaking into
 * Stripe, Cloudinary or Prisma calls.
 *
 * Set SKIP_ENV_VALIDATION=1 for tooling that does not need real credentials.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(16, "NEXTAUTH_SECRET must be at least 16 characters"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  CLOUDINARY_UPLOAD_FOLDER: z.string().min(1).default("exotica-watches"),

  STRIPE_SECRET_KEY: z.string().startsWith("sk_", "STRIPE_SECRET_KEY must be a secret key"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),

  ADMIN_EMAILS: z.string().optional().default(""),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success && process.env.SKIP_ENV_VALIDATION !== "1") {
  const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment variables:\n${issues.join("\n")}`);
}

export const env: ServerEnv = parsed.success
  ? parsed.data
  : {
      DATABASE_URL: "",
      NEXTAUTH_SECRET: "",
      GOOGLE_CLIENT_ID: "",
      GOOGLE_CLIENT_SECRET: "",
      CLOUDINARY_CLOUD_NAME: "",
      CLOUDINARY_API_KEY: "",
      CLOUDINARY_API_SECRET: "",
      CLOUDINARY_UPLOAD_FOLDER: "exotica-watches",
      STRIPE_SECRET_KEY: "",
      STRIPE_WEBHOOK_SECRET: undefined,
      ADMIN_EMAILS: "",
    };

export const adminEmails: ReadonlySet<string> = new Set(
  env.ADMIN_EMAILS.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);
