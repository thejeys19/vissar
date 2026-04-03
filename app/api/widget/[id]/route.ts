import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserPlanAsync } from '@/lib/plans';
import { getWidget, deleteWidget, recordToApiShape } from '@/lib/services/widget.service';
import type { PlanTier } from '@/lib/types/plan';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as { id?: string })?.id || session.user.email;

    const { id } = await params;
    const record = await getWidget(id);

    if (!record) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }
    if (record.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const plan = await getUserPlanAsync(session.user.email);
    return NextResponse.json(recordToApiShape(record, plan.plan as PlanTier));
  } catch (error) {
    console.error('GET /api/widget/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as { id?: string })?.id || session.user.email;

    const { id } = await params;
    const record = await getWidget(id);

    if (!record) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }
    if (record.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = await deleteWidget(id, userId);
    if (!success) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/widget/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
