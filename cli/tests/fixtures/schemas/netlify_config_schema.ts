/**
 * Zod schema for validating Netlify configuration (netlify.toml)
 * Used to verify deployment-ready output from tutors CLI
 */

import { z } from "zod";

/**
 * Build settings schema
 */
export const BuildSchema = z.object({
  base: z.string().optional(),
  command: z.string().optional(),
  publish: z.string(),
  ignore: z.string().optional(),
  environment: z.record(z.string()).optional(),
});

/**
 * Redirect rule schema
 */
export const RedirectSchema = z.object({
  from: z.string(),
  to: z.string(),
  status: z.number().int().min(100).max(599).optional(),
  force: z.boolean().optional(),
  query: z.record(z.string()).optional(),
  conditions: z.record(z.string()).optional(),
});

/**
 * Header rule schema
 */
export const HeaderSchema = z.object({
  for: z.string(),
  values: z.record(z.string()),
});

/**
 * Netlify configuration schema
 */
export const NetlifyConfigSchema = z.object({
  build: BuildSchema.optional(),
  redirects: z.array(RedirectSchema).optional(),
  headers: z.array(HeaderSchema).optional(),
  functions: z
    .object({
      directory: z.string(),
      node_bundler: z.enum(["esbuild", "zisi"]).optional(),
    })
    .optional(),
  plugins: z
    .array(
      z.object({
        package: z.string(),
        inputs: z.record(z.any()).optional(),
      })
    )
    .optional(),
});

export type NetlifyConfig = z.infer<typeof NetlifyConfigSchema>;
export type BuildConfig = z.infer<typeof BuildSchema>;
export type RedirectRule = z.infer<typeof RedirectSchema>;
export type HeaderRule = z.infer<typeof HeaderSchema>;

