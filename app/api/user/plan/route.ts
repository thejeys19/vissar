import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserPlanAsync } from '@/lib/plans';

// GET current plan
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const plan = await getUserPlanAsync(session.user.email);
  return NextResponse.json({ ...plan, email: session.user.email, name: session.user.name });
}

// POST disabled — plan changes must go through Stripe webhook (checkout.session.completed)
// or the admin endpoint (/api/admin/set-plan). Self-upgrading without payment is not allowed.
export async function POST() {
  return NextResponse.json(
    { error: 'Plan changes must be made through Stripe checkout.' },
    { status: 403 }
  );
}
