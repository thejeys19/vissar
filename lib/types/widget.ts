import type { PlanTier } from './plan';

export interface WidgetConfig {
  template?: string;
  maxReviews?: number;
  minRating?: number;
  autoStyle?: boolean;
  animations?: boolean;
  [key: string]: unknown;
}

export interface WidgetRecord {
  id: string;
  userId: string;
  name: string;
  placeId?: string | null;
  layout: string;
  config: WidgetConfig;
  tier?: PlanTier;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Shape returned by API (matches existing frontend expectations)
export interface WidgetApiShape {
  id: string;
  name: string;
  layout: string;
  template: string;
  maxReviews: number;
  minRating: number;
  autoStyle: boolean;
  animations: boolean;
  placeId?: string | null;
  userId: string;
  tier: string;
  createdAt: string;
  updatedAt: string;
}
