import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notificationsSchema } from '@/lib/validators/user';
import { Redis } from '@upstash/redis';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ notifications: { weekly: true, performance: true, updates: true } });

  const data = await redis.get<{ weekly: boolean; performance: boolean; updates: boolean }>(
    `notifications:${session.user.email}`
  );
  return NextResponse.json({ notifications: data || { weekly: true, performance: true, updates: true } });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = notificationsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const redis = getRedis();
  if (redis) {
    await redis.set(`notifications:${session.user.email}`, parsed.data.notifications);
  }

  return NextResponse.json({ success: true });
}
