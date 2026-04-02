import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error(`Redis not configured: url=${!!url} token=${!!token}`);
  return new Redis({ url, token });
}

interface Client {
  id: string;
  name: string;
  email: string;
  widgetCount: number;
  plan: string;
  createdAt: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || session?.user?.email;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const redis = getRedis();
    const clients = await redis.get<Client[]>(`clients:${userId}`) || [];
    return NextResponse.json({ clients });
  } catch (error) {
    console.error('GET /api/clients error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || session?.user?.email;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, email } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    }

    const redis = getRedis();
    const clients = await redis.get<Client[]>(`clients:${userId}`) || [];

    const newClient: Client = {
      id: `client_${Date.now()}`,
      name,
      email,
      widgetCount: 0,
      plan: 'free',
      createdAt: new Date().toISOString(),
    };

    clients.push(newClient);
    await redis.set(`clients:${userId}`, clients);

    return NextResponse.json(newClient);
  } catch (error) {
    console.error('POST /api/clients error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
