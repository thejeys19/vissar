import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWidget } from '@/lib/services/widget.service';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as { id?: string })?.id || session.user.email;

    const { searchParams } = new URL(request.url);
    const widgetId = searchParams.get('widgetId');

    if (!widgetId) {
      return NextResponse.json({ error: 'Widget ID required' }, { status: 400 });
    }

    const widget = await getWidget(widgetId);
    if (!widget) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }
    if (widget.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    const usageKey = `usage:${widgetId}:${monthKey}`;

    const redis = getRedis();
    let count = 0;
    if (redis) {
      const stored = await redis.get<number>(usageKey);
      count = stored || 0;
    }

    const cfg = widget.config as { maxReviews?: number } ?? {};
    const tier = (cfg as { tier?: string }).tier || 'free';
    const limit = tier === 'free' ? 200 : tier === 'pro' ? 10000 : Infinity;

    return NextResponse.json({
      widgetId,
      count,
      tier,
      limit,
      allowed: count <= limit,
      remaining: Math.max(0, limit === Infinity ? Infinity : limit - count),
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
    });
  } catch (error) {
    console.error('Usage check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
