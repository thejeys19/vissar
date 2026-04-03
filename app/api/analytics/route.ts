import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWidgetsByUser } from '@/lib/services/widget.service';
import { getDashboardAnalytics } from '@/lib/services/analytics.service';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id || session.user.email;
    const widgetRecords = await getWidgetsByUser(userId).catch(() => []);
    const widgets = widgetRecords.map(w => ({ id: w.id, name: w.name }));

    const result = await getDashboardAnalytics(widgets);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ totalViews: 0, totalClicks: 0, daily: [], widgets: [] });
  }
}
