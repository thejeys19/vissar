import type { PlanTier } from './plan';

export interface UserRecord {
  id: string;
  email: string;
  name?: string | null;
  plan: PlanTier;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UserSettings {
  name?: string;
}

export interface NotificationSettings {
  weekly: boolean;
  performance: boolean;
  updates: boolean;
}
