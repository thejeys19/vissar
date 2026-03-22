import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserPlan } from '@/lib/plans';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const plan = getUserPlan(session.user.email);
  return NextResponse.json({
    plan: plan.plan,
    views: plan.views,
    limit: plan.limit,
    email: session.user.email,
    name: session.user.name,
  });
}
