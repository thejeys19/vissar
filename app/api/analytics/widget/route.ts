import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWidget } from '@/lib/db';

export const dynamic = "force-dynamic";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as { id?: string })?.id || session.user.email;

    const widgetId = request.nextUrl.searchParams.get('id');
    if (!widgetId) return NextResponse.json({ error: 'id required' }, { status: 400 });

    // Verify the requesting user owns this widget
    const widget = await getWidget(widgetId);
    if (!widget) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }
    if (widget.userId && widget.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const redis = getRedis();
    if (!redis) return NextResponse.json({ views: 0, clicks: 0 });

    const [views, clicks] = await Promise.all([
      redis.get<number>(`analytics:${widgetId}:views`),
      redis.get<number>(`analytics:${widgetId}:clicks`),
    ]);

    return NextResponse.json({
      views: views || 0,
      clicks: clicks || 0,
    });
  } catch (error) {
    console.error('GET /api/analytics/widget error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
