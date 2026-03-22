import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { saveUser, getUserByEmail } from '@/lib/db';

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
