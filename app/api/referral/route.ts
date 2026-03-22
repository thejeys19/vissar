export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error(`Redis not configured: url=${!!url} token=${!!token}`);
  return new Redis({ url, token });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || session?.user?.email;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const redis = getRedis();
    const count = await redis.get<number>(`referrals:${userId}`) || 0;
    return NextResponse.json({ count });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('GET /api/referral error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
