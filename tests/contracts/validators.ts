import type { ZodSchema } from "zod";

export function assertValid<T>(schema: ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export function isValid<T>(schema: ZodSchema<T>, data: unknown): boolean {
  return schema.safeParse(data).success;
}

export function validationErrors<T>(schema: ZodSchema<T>, data: unknown): string[] {
  const result = schema.safeParse(data);
  if (result.success) return [];
  return result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
}
