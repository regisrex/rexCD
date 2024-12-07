import { z } from "zod";

// App model validation
export const appSchema = z.object({
  name: z.string(),
  webhookId: z.string(),
  repository: z.string(),
  githubToken: z.string(),
  branch: z.string(),
  commands: z.string(),
  workDir: z.string(),
});

// Env model validation
export const envSchema = z.object({
  filename: z.string(),
  content: z.string(),
  path: z.string(),
  appId: z.string(),
});

// Update validation schemas (optional fields)
export const appUpdateSchema = appSchema.partial();
export const envUpdateSchema = envSchema.partial();
