// backend/src/validation/uiSpecSchema.js
import { z } from 'zod';

export const FieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'email', 'tel', 'date', 'select', 'radio', 'textarea']).default('text'),
  placeholder: z.string().optional().nullable(),
  required: z.boolean().default(false).optional().nullable(),
  options: z.array(z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()])
  })).optional().nullable(),
  helperText: z.string().optional().nullable(),
  defaultValue: z.any().optional().nullable(),
  min: z.number().optional().nullable(),
  max: z.number().optional().nullable(),
  step: z.number().optional().nullable(),
  dependsOn: z.object({
    field: z.string(),
    value: z.any()
  }).optional().nullable()
});

export const StepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  fields: z.array(FieldSchema)
});

export const UiSpecSchema = z.object({
  version: z.string().default('1.0').optional().nullable(),
  layout: z.enum(['wizard', 'accordion', 'card', 'step-by-step']).default('step-by-step').optional().nullable(),
  targetSection: z.string().default('existingLoansAndCredit').optional().nullable(),
  title: z.string(),
  subtitle: z.string().optional().nullable(),
  aiReasoning: z.string().optional().nullable(),
  steps: z.array(StepSchema),
  actions: z.object({
    submitLabel: z.string().default('Apply & Return to Application').optional().nullable(),
    cancelLabel: z.string().default('Switch to Standard View').optional().nullable()
  }).optional().nullable()
});

export function validateUiSpec(spec) {
  return UiSpecSchema.safeParse(spec);
}
