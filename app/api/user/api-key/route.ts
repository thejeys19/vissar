import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserPlanAsync } from '@/lib/plans';
import { createHash } from 'crypto';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const plan = await getUserPlanAsync(session.user.email);
  if (plan.plan !== 'pro' && plan.plan !== 'business') {
    return NextResponse.json({ apiKey: null, plan: plan.plan });
  }

  const salt = process.env.ADMIN_SECRET || 'vissar-default-salt';
  const hash = createHash('sha256')
    .update(session.user.email + salt)
    .digest('hex');

  const apiKey = `vsk_${hash.slice(0, 32)}`;

  return NextResponse.json({ apiKey, plan: plan.plan });
}
