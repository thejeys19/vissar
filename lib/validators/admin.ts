import { z } from 'zod';

export const setPlanSchema = z.object({
  secret: z.string().min(1),
  email: z.string().email(),
  plan: z.enum(['free', 'pro', 'business']),
});

export type SetPlanInput = z.infer<typeof setPlanSchema>;
