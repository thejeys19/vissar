import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWidget } from '@/lib/services/widget.service';
import { getWidgetAnalytics } from '@/lib/services/analytics.service';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as { id?: string })?.id || session.user.email;

    const widgetId = request.nextUrl.searchParams.get('id');
    if (!widgetId) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const widget = await getWidget(widgetId);
    if (!widget) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }
    if (widget.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const stats = await getWidgetAnalytics(widgetId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('GET /api/analytics/widget error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
