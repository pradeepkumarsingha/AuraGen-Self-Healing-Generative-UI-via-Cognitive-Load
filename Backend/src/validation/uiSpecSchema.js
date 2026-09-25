// backend/src/validation/uiSpecSchema.js
import { z } from 'zod';

export const FieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'email', 'tel', 'date', 'select', 'radio', 'textarea']),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()])
  })).optional(),
  helperText: z.string().optional(),
  defaultValue: z.any().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  dependsOn: z.object({
    field: z.string(),
    value: z.any()
  }).optional()
});

export const StepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(FieldSchema)
});

export const UiSpecSchema = z.object({
  version: z.string().default('1.0'),
  layout: z.enum(['wizard', 'accordion', 'card', 'step-by-step']).default('step-by-step'),
  targetSection: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  aiReasoning: z.string().optional(),
  steps: z.array(StepSchema),
  actions: z.object({
    submitLabel: z.string().default('Save & Continue'),
    cancelLabel: z.string().default('Switch to Standard View')
  }).optional()
});

export function validateUiSpec(spec) {
  return UiSpecSchema.safeParse(spec);
}
