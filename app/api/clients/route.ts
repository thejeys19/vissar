import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error(`Redis not configured`);
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

const createClientSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
});

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

    const body = await request.json();
    const parsed = createClientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email } = parsed.data;
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
