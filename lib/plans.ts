import { Redis } from '@upstash/redis';
import { promises as fs } from 'fs';
import { join } from 'path';

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = join(process.cwd(), 'data');

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error(`Redis not configured`);
  return new Redis({ url, token });
}

interface UserPlan {
  plan: string;
  views: number;
  limit: number;
  updatedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getUserPlan(_email: string): { plan: string; views: number; limit: number } {
  return { plan: "free", views: 0, limit: 200 };
}

export async function getUserPlanAsync(email: string): Promise<{ plan: string; views: number; limit: number }> {
  if (IS_VERCEL) {
    const redis = getRedis();
    const plan = await redis.hget<UserPlan>('plans', email);
    return plan || { plan: "free", views: 0, limit: 200 };
  }
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = await fs.readFile(join(DATA_DIR, 'plans.json'), 'utf-8');
    const plans = JSON.parse(data);
    return plans[email] || { plan: "free", views: 0, limit: 200 };
  } catch {
    return { plan: "free", views: 0, limit: 200 };
  }
}

export async function setUserPlan(email: string, data: { plan: string; views: number; limit: number }): Promise<void> {
  const record: UserPlan = { ...data, updatedAt: new Date().toISOString() };
  if (IS_VERCEL) {
    const redis = getRedis();
    await redis.hset('plans', { [email]: record });
  } else {
    await fs.mkdir(DATA_DIR, { recursive: true });
    let plans: Record<string, UserPlan> = {};
    try {
      plans = JSON.parse(await fs.readFile(join(DATA_DIR, 'plans.json'), 'utf-8'));
    } catch {}
    plans[email] = record;
    await fs.writeFile(join(DATA_DIR, 'plans.json'), JSON.stringify(plans, null, 2));
  }
}

export function planLimitForTier(plan: string): number {
  switch (plan) {
    case "business": return 50000;
    case "pro": return 10000;
    default: return 200;
  }
}
