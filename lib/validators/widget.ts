import { z } from 'zod';

export const createWidgetSchema = z.object({
  name: z.string().min(1).max(200).default('Untitled Widget'),
  layout: z.enum(['carousel', 'grid', 'list', 'badge', 'masonry']).default('carousel'),
  template: z.string().max(50).optional(),
  maxReviews: z.number().int().min(1).max(50).optional(),
  minRating: z.number().int().min(1).max(5).optional(),
  autoStyle: z.boolean().optional(),
  animations: z.boolean().optional(),
  placeId: z.string().max(500).optional().nullable(),
});

export const updateWidgetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  layout: z.enum(['carousel', 'grid', 'list', 'badge', 'masonry']).optional(),
  template: z.string().max(50).optional(),
  maxReviews: z.number().int().min(1).max(50).optional(),
  minRating: z.number().int().min(1).max(5).optional(),
  autoStyle: z.boolean().optional(),
  animations: z.boolean().optional(),
  placeId: z.string().max(500).optional().nullable(),
});

export type CreateWidgetInput = z.infer<typeof createWidgetSchema>;
export type UpdateWidgetInput = z.infer<typeof updateWidgetSchema>;
