export type PlanTier = 'free' | 'pro' | 'business' | 'lifetime';

export interface UserPlan {
  plan: PlanTier;
  views: number;
  limit: number;
  updatedAt?: string;
}

export interface PlanLimits {
  maxWidgets: number;
  monthlyViews: number;
  customDomain: boolean;
  apiAccess: boolean;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: { maxWidgets: 1, monthlyViews: 200, customDomain: false, apiAccess: false },
  pro: { maxWidgets: 10, monthlyViews: 10000, customDomain: true, apiAccess: true },
  business: { maxWidgets: 100, monthlyViews: 50000, customDomain: true, apiAccess: true },
  lifetime: { maxWidgets: Infinity, monthlyViews: Infinity, customDomain: true, apiAccess: true },
};
