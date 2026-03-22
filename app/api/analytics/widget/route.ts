import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = "force-dynamic";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET(request: NextRequest) {
  const widgetId = request.nextUrl.searchParams.get('id');
  if (!widgetId) return NextResponse.json({ error: 'id required' }, { status: 400 });

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
}
