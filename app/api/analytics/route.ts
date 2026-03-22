import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWidgetsByUser } from '@/lib/db';
import { Redis } from '@upstash/redis';

export const dynamic = "force-dynamic";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Redis not configured');
  return new Redis({ url, token });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id || session.user.email;
    const widgets = await getWidgetsByUser(userId).catch(() => []);
    const redis = getRedis();

    // Get last 7 days dates
    const days: string[] = [];
    const dayLabels: string[] = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
      dayLabels.push(weekdays[d.getDay()]);
    }

    // Fetch per-widget stats
    const pipeline = redis.pipeline();
    for (const w of widgets) {
      pipeline.get(`analytics:${w.id}:views`);
      pipeline.get(`analytics:${w.id}:clicks`);
    }
    // Fetch daily breakdown for each day (across all user widgets)
    for (const day of days) {
      for (const w of widgets) {
        pipeline.get(`analytics:${w.id}:${day}:views`);
        pipeline.get(`analytics:${w.id}:${day}:clicks`);
      }
    }

    const results = await pipeline.exec();
    let idx = 0;

    // Parse per-widget totals
    let totalViews = 0;
    let totalClicks = 0;
    const widgetStats = widgets.map(w => {
      const views = Number(results[idx++]) || 0;
      const clicks = Number(results[idx++]) || 0;
      totalViews += views;
      totalClicks += clicks;
      const ctr = views > 0 ? Math.round((clicks / views) * 1000) / 10 : 0;
      return { id: w.id, name: w.name, views, clicks, ctr };
    });

    // Parse daily breakdown
    const daily = days.map((_, di) => {
      let dayViews = 0;
      let dayClicks = 0;
      for (let wi = 0; wi < widgets.length; wi++) {
        dayViews += Number(results[idx++]) || 0;
        dayClicks += Number(results[idx++]) || 0;
      }
      return { date: dayLabels[di], views: dayViews, clicks: dayClicks };
    });

    return NextResponse.json({
      totalViews,
      totalClicks,
      daily,
      widgets: widgetStats,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({
      totalViews: 0,
      totalClicks: 0,
      daily: [],
      widgets: [],
    });
  }
}
