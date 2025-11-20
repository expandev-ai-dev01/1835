import { z } from 'zod';

// Common Zod patterns for reuse

// Validators BEFORE nullable/optional
export const zNullableString = (maxLength?: number) => {
  let schema = z.string();
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema.nullable();
};

export const zNullableDescription = z.string().max(500).nullable();
export const zName = z.string().min(1).max(200);
export const zNullableFK = z.number().int().positive().nullable();
export const zFK = z.number().int().positive();
export const zBit = z.number().int().min(0).max(1);
export const zDateString = z.string().datetime();
