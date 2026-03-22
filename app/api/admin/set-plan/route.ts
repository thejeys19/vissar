import { NextRequest, NextResponse } from 'next/server';
import { setUserPlan, planLimitForTier } from '@/lib/plans';

// Temporary admin endpoint - delete after use
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { secret, email, plan } = body;

  if (secret !== process.env.NEXTAUTH_SECRET?.substring(0, 16)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await setUserPlan(email, {
    plan,
    views: 0,
    limit: planLimitForTier(plan),
  });

  return NextResponse.json({ success: true, email, plan });
}
