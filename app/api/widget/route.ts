import { NextResponse } from 'next/server';
import { getWidgets, getWidget, saveWidget, deleteWidget } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserPlanAsync } from '@/lib/plans';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as { id?: string })?.id || session.user.email;

    const widgets = await getWidgets();
    // Return only widgets owned by this user — no fallback for anonymous widgets
    const filtered = widgets.filter(w => w.userId === userId);
    return NextResponse.json(filtered);
  } catch (error) {
    console.error('GET /api/widget error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as { id?: string })?.id || session.user.email;

    const body = await request.json();

    // Get tier from user's actual plan, never trust client-supplied tier
    const plan = await getUserPlanAsync(session.user.email);
    const tier = plan.plan;

    // Whitelist allowed fields — do NOT spread entire body
    const widget = await saveWidget({
      // No client-supplied `id` for creation — server generates it
      name: body.name,
      layout: body.layout,
      template: body.template,
      maxReviews: body.maxReviews,
      minRating: body.minRating,
      autoStyle: body.autoStyle,
      animations: body.animations,
      placeId: body.placeId,
      userId,
      tier, // from server-side plan, not client
    });
    return NextResponse.json(widget);
  } catch (error) {
    console.error('POST /api/widget error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as { id?: string })?.id || session.user.email;

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Widget ID required for update' }, { status: 400 });
    }

    // Verify ownership before updating
    const existing = await getWidget(id);
    if (!existing) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }
    if (existing.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get tier from server — never trust client
    const plan = await getUserPlanAsync(session.user.email);
    const tier = plan.plan;

    // Whitelist fields for update
    const widget = await saveWidget({
      id: existing.id, // use existing id
      name: body.name,
      layout: body.layout,
      template: body.template,
      maxReviews: body.maxReviews,
      minRating: body.minRating,
      autoStyle: body.autoStyle,
      animations: body.animations,
      placeId: body.placeId,
      userId: existing.userId, // preserve original owner
      tier, // from server-side plan
      createdAt: existing.createdAt, // preserve creation time
    });
    return NextResponse.json(widget);
  } catch (error) {
    console.error('PUT /api/widget error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as { id?: string })?.id || session.user.email;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    // Verify ownership before deleting
    const existing = await getWidget(id);
    if (!existing) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }
    if (existing.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = await deleteWidget(id);
    if (!success) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/widget error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
