import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserPlanAsync } from '@/lib/plans';
import { createWidgetSchema, updateWidgetSchema } from '@/lib/validators/widget';
import {
  getWidgetsByUser,
  getWidget,
  createWidget,
  updateWidget,
  deleteWidget,
  recordToApiShape,
} from '@/lib/services/widget.service';
import type { PlanTier } from '@/lib/types/plan';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as { id?: string })?.id || session.user.email;

    const plan = await getUserPlanAsync(session.user.email);
    const records = await getWidgetsByUser(userId);
    const widgets = records.map(r => recordToApiShape(r, plan.plan as PlanTier));
    return NextResponse.json(widgets);
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
    const parsed = createWidgetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const plan = await getUserPlanAsync(session.user.email);
    const tier = plan.plan as PlanTier;
    const { name, layout, placeId, template, maxReviews, minRating, autoStyle, animations } = parsed.data;

    const record = await createWidget({
      userId,
      name: name ?? 'Untitled Widget',
      placeId: placeId ?? null,
      layout: layout ?? 'carousel',
      config: { template, maxReviews, minRating, autoStyle, animations },
    });

    return NextResponse.json(recordToApiShape(record, tier));
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
    const parsed = updateWidgetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { id, name, layout, placeId, template, maxReviews, minRating, autoStyle, animations } = parsed.data;

    const existing = await getWidget(id);
    if (!existing) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }
    if (existing.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const plan = await getUserPlanAsync(session.user.email);
    const tier = plan.plan as PlanTier;

    const updatedConfig = {
      ...((existing.config as object) ?? {}),
      ...(template !== undefined ? { template } : {}),
      ...(maxReviews !== undefined ? { maxReviews } : {}),
      ...(minRating !== undefined ? { minRating } : {}),
      ...(autoStyle !== undefined ? { autoStyle } : {}),
      ...(animations !== undefined ? { animations } : {}),
    };

    const record = await updateWidget(id, userId, {
      ...(name !== undefined ? { name } : {}),
      ...(layout !== undefined ? { layout } : {}),
      ...(placeId !== undefined ? { placeId } : {}),
      config: updatedConfig,
    });

    if (!record) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    return NextResponse.json(recordToApiShape(record, tier));
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

    const existing = await getWidget(id);
    if (!existing) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }
    if (existing.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = await deleteWidget(id, userId);
    if (!success) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/widget error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
