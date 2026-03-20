// Simple file-based storage for MVP
// In production, replace with proper database

import { promises as fs } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'widgets.json');
const USERS_PATH = join(process.cwd(), 'data', 'users.json');

export interface Widget {
  id: string;
  name: string;
  layout: 'carousel' | 'grid' | 'list' | 'badge';
  template: string;
  maxReviews: number;
  minRating: number;
  autoStyle: boolean;
  animations: boolean;
  placeId?: string;
  userId?: string;
  tier: 'free' | 'pro' | 'lifetime';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  tier: 'free' | 'pro' | 'lifetime';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

async function ensureDbExists() {
  try {
    await fs.mkdir(join(process.cwd(), 'data'), { recursive: true });
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify([]));
  }
  try {
    await fs.access(USERS_PATH);
  } catch {
    await fs.writeFile(USERS_PATH, JSON.stringify([]));
  }
}

export async function getWidgets(): Promise<Widget[]> {
  await ensureDbExists();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
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
  };

  const existingIndex = widgets.findIndex(w => w.id === newWidget.id);
  if (existingIndex >= 0) {
    widgets[existingIndex] = newWidget;
  } else {
    widgets.push(newWidget);
  }

  await fs.writeFile(DB_PATH, JSON.stringify(widgets, null, 2));
  return newWidget;
}

export async function deleteWidget(id: string): Promise<boolean> {
  const widgets = await getWidgets();
  const filtered = widgets.filter(w => w.id !== id);
  
  if (filtered.length === widgets.length) {
    return false;
  }

  await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
  return true;
}

// User management
export async function getUsers(): Promise<User[]> {
  await ensureDbExists();
  const data = await fs.readFile(USERS_PATH, 'utf-8');
  return JSON.parse(data);
}

export async function getUser(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(u => u.id === id) || null;
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
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
    createdAt: user.createdAt || now,
    updatedAt: now,
  };

  const existingIndex = users.findIndex(u => u.id === newUser.id);
  if (existingIndex >= 0) {
    users[existingIndex] = newUser;
  } else {
    users.push(newUser);
  }

  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
  return newUser;
}
