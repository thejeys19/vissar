import { Redis } from '@upstash/redis';
import { promises as fs } from 'fs';
import { join } from 'path';

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = join(process.cwd(), 'data');

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

async function redisGet<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  return redis.get<T>(key);
}

async function redisSet(key: string, value: unknown): Promise<void> {
  const redis = getRedis();
  await redis.set(key, value);
}

async function fileGet<T>(path: string, defaultVal: T): Promise<T> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = await fs.readFile(path, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultVal;
  }
}

async function fileSet(path: string, value: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path, JSON.stringify(value, null, 2));
}

export interface Widget {
  id: string;
  name: string;
  layout: string;
  template: string;
  maxReviews: number;
  minRating: number;
  autoStyle: boolean;
  animations: boolean;
  placeId?: string;
  userId?: string;
  tier: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  tier: string;
  createdAt: string;
  updatedAt: string;
}

export async function getWidgets(): Promise<Widget[]> {
  if (IS_VERCEL) return (await redisGet<Widget[]>('widgets')) || [];
  return fileGet<Widget[]>(join(DATA_DIR, 'widgets.json'), []);
}

export async function getWidgetsByUser(userId: string): Promise<Widget[]> {
  const widgets = await getWidgets();
  return widgets.filter(w => w.userId === userId);
}

export async function getWidget(id: string): Promise<Widget | null> {
  const widgets = await getWidgets();
  return widgets.find(w => w.id === id) || null;
}

export async function saveWidget(widget: Partial<Widget>): Promise<Widget> {
  const widgets = await getWidgets();
  const now = new Date().toISOString();

  const newWidget: Widget = {
    id: widget.id || `widget_${Date.now()}`,
    name: widget.name || 'Untitled Widget',
    layout: widget.layout || 'carousel',
    template: widget.template || 'soft',
    maxReviews: widget.maxReviews || 5,
    minRating: widget.minRating || 1,
    autoStyle: widget.autoStyle !== false,
    animations: widget.animations !== false,
    placeId: widget.placeId,
    userId: widget.userId,
    tier: widget.tier || 'free',
    createdAt: widget.createdAt || now,
    updatedAt: now,
    ...widget,
  };

  const existingIndex = widgets.findIndex(w => w.id === newWidget.id);
  if (existingIndex >= 0) widgets[existingIndex] = newWidget;
  else widgets.push(newWidget);

  if (IS_VERCEL) await redisSet('widgets', widgets);
  else await fileSet(join(DATA_DIR, 'widgets.json'), widgets);
  return newWidget;
}

export async function deleteWidget(id: string): Promise<boolean> {
  const widgets = await getWidgets();
  const filtered = widgets.filter(w => w.id !== id);
  if (filtered.length === widgets.length) return false;
  if (IS_VERCEL) await redisSet('widgets', filtered);
  else await fileSet(join(DATA_DIR, 'widgets.json'), filtered);
  return true;
}

export async function getUsers(): Promise<User[]> {
  if (IS_VERCEL) return (await redisGet<User[]>('users')) || [];
  return fileGet<User[]>(join(DATA_DIR, 'users.json'), []);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(u => u.email === email) || null;
}

export async function saveUser(user: Partial<User>): Promise<User> {
  const users = await getUsers();
  const now = new Date().toISOString();

  const newUser: User = {
    id: user.id || `user_${Date.now()}`,
    email: user.email || '',
    name: user.name,
    tier: user.tier || 'free',
    createdAt: user.createdAt || now,
    updatedAt: now,
    ...user,
  };

  const existingIndex = users.findIndex(u => u.id === newUser.id || u.email === newUser.email);
  if (existingIndex >= 0) users[existingIndex] = newUser;
  else users.push(newUser);

  if (IS_VERCEL) await redisSet('users', users);
  else await fileSet(join(DATA_DIR, 'users.json'), users);
  return newUser;
}
