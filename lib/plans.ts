// In-memory plan store (replaced by DB in Run 4)
const userPlans = new Map<string, { plan: string; views: number; limit: number }>();

export function getUserPlan(email: string) {
  return userPlans.get(email) || { plan: "free", views: 0, limit: 200 };
}

export function setUserPlan(email: string, data: { plan: string; views: number; limit: number }) {
  userPlans.set(email, data);
}

export function planLimitForTier(plan: string): number {
  switch (plan) {
    case "business": return 50000;
    case "pro": return 10000;
    default: return 200;
  }
}
