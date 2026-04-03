import { NextRequest, NextResponse } from 'next/server';
import { setUserPlan, planLimitForTier } from '@/lib/plans';
import { setPlanSchema } from '@/lib/validators/admin';
import { timingSafeEqual, randomBytes } from 'crypto';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';
import { updateUserPlan } from '@/lib/services/user.service';
import type { PlanTier } from '@/lib/types/plan';

export async function POST(request: NextRequest) {
  // Rate limit: 3 requests per minute per IP
  const ip = getClientIp(request);
  const { allowed, remaining } = await checkRateLimit(`admin:setplan:${ip}`, 3, 60);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': String(remaining) } }
    );
  }

  const body = await request.json();
  const parsed = setPlanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
  }

  const { secret, email, plan } = parsed.data;

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || !secret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Timing-safe comparison
  let secretsMatch = false;
  try {
    const secretBuf = Buffer.from(secret, 'utf8');
    const adminBuf = Buffer.from(adminSecret, 'utf8');
    const maxLen = Math.max(secretBuf.length, adminBuf.length);
    const a = Buffer.concat([secretBuf, randomBytes(maxLen)]).slice(0, maxLen);
    const b = Buffer.concat([adminBuf, randomBytes(maxLen)]).slice(0, maxLen);
    secretsMatch = timingSafeEqual(a, b) && secretBuf.length === adminBuf.length;
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!secretsMatch) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Update plan in Redis (for quota tracking) and Postgres (canonical record)
  await setUserPlan(email, { plan, views: 0, limit: planLimitForTier(plan) });
  // Best-effort Postgres update (user may not exist yet — no error)
  await updateUserPlan(email, plan as PlanTier).catch(() => null);

  return NextResponse.json({ success: true, email, plan });
}
