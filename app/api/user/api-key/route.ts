import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserPlanAsync } from '@/lib/plans';
import { randomBytes } from 'crypto';
import { Redis } from '@upstash/redis';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';
import { NextRequest } from 'next/server';

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET(request: NextRequest) {
  // Rate limit: 3 requests per minute per IP
  const ip = getClientIp(request);
  const { allowed, remaining } = await checkRateLimit(`apikey:${ip}`, 3, 60);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': String(remaining) },
      }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const plan = await getUserPlanAsync(session.user.email);
  if (plan.plan !== 'pro' && plan.plan !== 'business') {
    return NextResponse.json({ apiKey: null, plan: plan.plan });
  }

  const redis = getRedis();

  if (redis) {
    // Try to return existing key from Redis
    const existingKey = await redis.get<string>(`apikey:${session.user.email}`);
    if (existingKey) {
      return NextResponse.json({ apiKey: existingKey, plan: plan.plan });
    }
  }

  // Generate a new cryptographically random API key (not derived from email/secret)
  const keyBytes = randomBytes(32).toString('hex');
  const apiKey = `vsk_${keyBytes}`;

  if (redis) {
    // Store per-user API key in Redis
    await redis.set(`apikey:${session.user.email}`, apiKey);
  }

  return NextResponse.json({ apiKey, plan: plan.plan });
}

// Allow regenerating the API key
export async function POST(request: NextRequest) {
  // Rate limit: 3 requests per minute per IP
  const ip = getClientIp(request);
  const { allowed, remaining } = await checkRateLimit(`apikey:regen:${ip}`, 3, 60);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': String(remaining) },
      }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const plan = await getUserPlanAsync(session.user.email);
  if (plan.plan !== 'pro' && plan.plan !== 'business') {
    return NextResponse.json({ error: 'Pro plan required' }, { status: 403 });
  }

  // Generate a new cryptographically random API key
  const keyBytes = randomBytes(32).toString('hex');
  const apiKey = `vsk_${keyBytes}`;

  const redis = getRedis();
  if (redis) {
    await redis.set(`apikey:${session.user.email}`, apiKey);
  }

  return NextResponse.json({ apiKey, plan: plan.plan });
}
