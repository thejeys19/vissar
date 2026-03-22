import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { saveUser, getUserByEmail, getWidgetsByUser, deleteWidget } from '@/lib/db';
import { Redis } from '@upstash/redis';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name } = body;

  const existing = await getUserByEmail(session.user.email);
  await saveUser({
    ...existing,
    id: existing?.id || session.user.email,
    email: session.user.email,
    name: name || session.user.name || 'User',
  });

  return NextResponse.json({ success: true, name });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const email = session.user.email;
  const userId = (session.user as { id?: string }).id || email;

  try {
    // Delete all user widgets
    const widgets = await getWidgetsByUser(userId).catch(() => []);
    for (const w of widgets) {
      await deleteWidget(w.id);
    }

    // Remove user plan from Redis
    const redis = getRedis();
    if (redis) {
      await redis.hdel('plans', email);
      await redis.del(`notifications:${email}`);
      await redis.del(`customDomain:${email}`);
    }

    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
