import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = "force-dynamic";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Redis not configured');
  return new Redis({ url, token });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { widgetId, event } = body;

    if (!widgetId || !event) {
      return NextResponse.json({ error: 'widgetId and event required' }, { status: 400, headers: corsHeaders });
    }

    // Validate widgetId format — alphanumeric, underscores, hyphens only
    const widgetIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!widgetIdRegex.test(widgetId) || widgetId.length > 128) {
      return NextResponse.json({ error: 'Invalid widgetId format' }, { status: 400, headers: corsHeaders });
    }

    if (event !== 'view' && event !== 'click') {
      return NextResponse.json({ error: 'event must be "view" or "click"' }, { status: 400, headers: corsHeaders });
    }

    const redis = getRedis();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const pipeline = redis.pipeline();

    // Per-widget totals
    pipeline.incr(`analytics:${widgetId}:${event}s`);

    // Daily breakdown
    pipeline.incr(`analytics:${widgetId}:${today}:${event}s`);

    // Global daily (across all widgets)
    pipeline.incr(`analytics:${today}:${event}s`);

    await pipeline.exec();

    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500, headers: corsHeaders });
  }
}
