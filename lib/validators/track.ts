import { z } from 'zod';

export const trackEventSchema = z.object({
  widgetId: z
    .string()
    .min(1)
    .max(128)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid widgetId format'),
  event: z.enum(['view', 'click']),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;
