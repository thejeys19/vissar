import { NextRequest, NextResponse } from 'next/server';
import { setUserPlan, planLimitForTier } from '@/lib/plans';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { secret, email, plan } = body;

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!email || !['free', 'pro', 'business'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
  }

  await setUserPlan(email, {
    plan,
    views: 0,
    limit: planLimitForTier(plan),
  });

  return NextResponse.json({ success: true, email, plan });
}
