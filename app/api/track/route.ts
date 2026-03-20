import { NextResponse } from 'next/server';
import { getWidget } from '@/lib/db';

// In-memory usage store (replace with Redis/DB in production)
const usageStore = new Map();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { widgetId, timestamp, url, referrer } = body;

    if (!widgetId) {
      return NextResponse.json(
        { error: 'Widget ID required' },
        { status: 400 }
      );
    }

    // Get widget to check tier
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

    // Get or create usage record
    let usage = usageStore.get(usageKey) || {
      count: 0,
      tier: widget.tier || 'free',
      limit: widget.tier === 'free' ? 200 : widget.tier === 'pro' ? 10000 : Infinity
    };

    // Increment count
    usage.count++;
    usageStore.set(usageKey, usage);

    // Check if over limit
    const allowed = usage.count <= usage.limit;

    return NextResponse.json({
      widgetId,
      count: usage.count,
      tier: usage.tier,
      limit: usage.limit,
      allowed,
      remaining: Math.max(0, usage.limit - usage.count)
    });
  } catch (error) {
    console.error('Usage tracking error:', error);
    return NextResponse.json(
      { error: 'Tracking failed' },
      { status: 500 }
    );
  }
}
