import { NextResponse } from 'next/server';
import { getWidget } from '@/lib/db';

const usageStore = new Map();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const widgetId = searchParams.get('widgetId');

    if (!widgetId) {
      return NextResponse.json(
        { error: 'Widget ID required' },
        { status: 400 }
      );
    }

    const widget = await getWidget(widgetId);
    
    if (!widget) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    const usageKey = `${widgetId}:${monthKey}`;

    const usage = usageStore.get(usageKey) || {
      count: 0,
      tier: widget.tier || 'free',
      limit: widget.tier === 'free' ? 200 : widget.tier === 'pro' ? 10000 : Infinity
    };

    return NextResponse.json({
      widgetId,
      count: usage.count,
      tier: usage.tier,
      limit: usage.limit,
      allowed: usage.count <= usage.limit,
      remaining: Math.max(0, usage.limit - usage.count),
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
    });
  } catch (error) {
    console.error('Usage check error:', error);
    return NextResponse.json(
      { error: 'Check failed' },
      { status: 500 }
    );
  }
}
