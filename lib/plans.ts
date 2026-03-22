// File-based plan store - persists across requests
import { promises as fs } from 'fs';
import { join } from 'path';

const PLANS_PATH = join(process.cwd(), 'data', 'plans.json');

interface UserPlan {
  plan: string;
  views: number;
  limit: number;
  updatedAt: string;
}

async function ensureFile() {
  try {
    await fs.mkdir(join(process.cwd(), 'data'), { recursive: true });
    await fs.access(PLANS_PATH);
  } catch {
    await fs.writeFile(PLANS_PATH, JSON.stringify({}));
  }
}

async function readPlans(): Promise<Record<string, UserPlan>> {
  await ensureFile();
  try {
    const data = await fs.readFile(PLANS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writePlans(plans: Record<string, UserPlan>) {
  await ensureFile();
  await fs.writeFile(PLANS_PATH, JSON.stringify(plans, null, 2));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getUserPlan(_email: string): { plan: string; views: number; limit: number } {
  // Sync fallback - use getUserPlanAsync for real data
  return { plan: "free", views: 0, limit: 200 };
}

export async function getUserPlanAsync(email: string): Promise<{ plan: string; views: number; limit: number }> {
  const plans = await readPlans();
  return plans[email] || { plan: "free", views: 0, limit: 200 };
}

export async function setUserPlan(email: string, data: { plan: string; views: number; limit: number }) {
  const plans = await readPlans();
  plans[email] = { ...data, updatedAt: new Date().toISOString() };
  await writePlans(plans);
}

export function planLimitForTier(plan: string): number {
  switch (plan) {
    case "business": return 50000;
    case "pro": return 10000;
    default: return 200;
  }
}
