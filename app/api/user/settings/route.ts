import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateSettingsSchema } from '@/lib/validators/user';
import { getUserByEmail, updateUserName, deleteUser } from '@/lib/services/user.service';
import { deleteAllUserWidgets } from '@/lib/services/widget.service';
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
  const parsed = updateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { name } = parsed.data;
  if (name) {
    // Ensure user exists first
    const existing = await getUserByEmail(session.user.email);
    if (!existing) {
      // Auto-create user record on first settings update
      const { upsertUser } = await import('@/lib/services/user.service');
      await upsertUser({
        id: (session.user as { id?: string }).id || session.user.email,
        email: session.user.email,
        name,
      });
    } else {
      await updateUserName(session.user.email, name);
    }
  }

  return NextResponse.json({ success: true, name });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const email = session.user.email;
  const userId = (session.user as { id?: string }).id || email;

  try {
    // Delete all user widgets from Postgres (cascades to related data)
    await deleteAllUserWidgets(userId);

    // Delete user from Postgres
    await deleteUser(email);

    // Clean up Redis data (plans, notifications, custom domain, api key)
    const redis = getRedis();
    if (redis) {
      await redis.hdel('plans', email);
      await redis.del(`notifications:${email}`);
      await redis.del(`customDomain:${email}`);
      await redis.del(`apikey:${email}`);
    }

    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
