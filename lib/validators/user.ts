import { z } from 'zod';

export const updateSettingsSchema = z.object({
  name: z.string().min(1).max(200).optional(),
});

export const customDomainSchema = z.object({
  domain: z.string().max(253).optional().nullable(),
});

export const notificationsSchema = z.object({
  notifications: z.object({
    weekly: z.boolean(),
    performance: z.boolean(),
    updates: z.boolean(),
  }),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type CustomDomainInput = z.infer<typeof customDomainSchema>;
export type NotificationsInput = z.infer<typeof notificationsSchema>;
