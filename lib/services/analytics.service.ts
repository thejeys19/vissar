/**
 * Analytics Service — Redis-backed (intentional: counters & time-series belong in Redis)
 */
import { Redis } from '@upstash/redis';

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function trackEvent(widgetId: string, event: 'view' | 'click'): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const today = new Date().toISOString().slice(0, 10);
  const pipeline = redis.pipeline();
  pipeline.incr(`analytics:${widgetId}:${event}s`);
  pipeline.incr(`analytics:${widgetId}:${today}:${event}s`);
  pipeline.incr(`analytics:${today}:${event}s`);
  await pipeline.exec();
}

export interface WidgetStats {
  id: string;
  name: string;
  views: number;
  clicks: number;
  ctr: number;
}

export interface DailyStats {
  date: string;
  views: number;
  clicks: number;
}

export async function getWidgetAnalytics(
  widgetId: string
): Promise<{ views: number; clicks: number }> {
  const redis = getRedis();
  if (!redis) return { views: 0, clicks: 0 };

  const [views, clicks] = await Promise.all([
    redis.get<number>(`analytics:${widgetId}:views`),
    redis.get<number>(`analytics:${widgetId}:clicks`),
  ]);

  return { views: views || 0, clicks: clicks || 0 };
}

export async function getDashboardAnalytics(
  widgets: Array<{ id: string; name: string }>
): Promise<{
  totalViews: number;
  totalClicks: number;
  daily: DailyStats[];
  widgets: WidgetStats[];
}> {
  const redis = getRedis();

  if (!redis || widgets.length === 0) {
    return { totalViews: 0, totalClicks: 0, daily: [], widgets: [] };
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days: string[] = [];
  const dayLabels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
    dayLabels.push(weekdays[d.getDay()]);
  }

  const pipeline = redis.pipeline();
  for (const w of widgets) {
    pipeline.get(`analytics:${w.id}:views`);
    pipeline.get(`analytics:${w.id}:clicks`);
  }
  for (const day of days) {
    for (const w of widgets) {
      pipeline.get(`analytics:${w.id}:${day}:views`);
      pipeline.get(`analytics:${w.id}:${day}:clicks`);
    }
  }

  const results = await pipeline.exec();
  let idx = 0;
  let totalViews = 0;
  let totalClicks = 0;

  const widgetStats: WidgetStats[] = widgets.map(w => {
    const views = Number(results[idx++]) || 0;
    const clicks = Number(results[idx++]) || 0;
    totalViews += views;
    totalClicks += clicks;
    const ctr = views > 0 ? Math.round((clicks / views) * 1000) / 10 : 0;
    return { id: w.id, name: w.name, views, clicks, ctr };
  });

  const daily: DailyStats[] = days.map((_, di) => {
    let dayViews = 0;
    let dayClicks = 0;
    for (let wi = 0; wi < widgets.length; wi++) {
      dayViews += Number(results[idx++]) || 0;
      dayClicks += Number(results[idx++]) || 0;
    }
    return { date: dayLabels[di], views: dayViews, clicks: dayClicks };
  });

  return { totalViews, totalClicks, daily, widgets: widgetStats };
}
