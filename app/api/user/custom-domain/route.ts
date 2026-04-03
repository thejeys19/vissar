import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserPlanAsync } from '@/lib/plans';
import { customDomainSchema } from '@/lib/validators/user';
import { Redis } from '@upstash/redis';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ domain: '' });

  const domain = await redis.get<string>(`customDomain:${session.user.email}`);
  return NextResponse.json({ domain: domain || '' });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const plan = await getUserPlanAsync(session.user.email);
  if (plan.plan !== 'pro' && plan.plan !== 'business') {
    return NextResponse.json({ error: 'Pro plan required' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = customDomainSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  let domain = parsed.data.domain;

  if (domain === '' || domain === null || domain === undefined) {
    const redis = getRedis();
    if (redis) await redis.set(`customDomain:${session.user.email}`, '');
    return NextResponse.json({ success: true, domain: '' });
  }

  // Strip protocol and path — keep only the hostname
  domain = String(domain)
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .trim()
    .toLowerCase();

  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 });
  }

  const redis = getRedis();
  if (redis) await redis.set(`customDomain:${session.user.email}`, domain);

  return NextResponse.json({ success: true, domain });
}
