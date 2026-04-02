import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserPlanAsync, setUserPlan, planLimitForTier } from '@/lib/plans';

// GET current plan
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const plan = await getUserPlanAsync(session.user.email);
  return NextResponse.json({ ...plan, email: session.user.email, name: session.user.name });
}

// POST to update plan — users can only modify their own plan
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { plan } = body;

  // Always use the authenticated user's email — never accept email from client
  const targetEmail = session.user.email;

  if (!['free', 'pro', 'business'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const current = await getUserPlanAsync(targetEmail);
  await setUserPlan(targetEmail, {
    plan,
    views: current.views,
    limit: planLimitForTier(plan),
  });

  return NextResponse.json({ success: true, plan, email: targetEmail });
}
