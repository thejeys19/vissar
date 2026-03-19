// Simple file-based storage for MVP
// In production, replace with proper database

import { promises as fs } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'widgets.json');

export interface Widget {
  id: string;
  name: string;
  layout: 'carousel' | 'grid' | 'list' | 'badge';
  maxReviews: number;
  minRating: number;
  autoStyle: boolean;
  placeId?: string;
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
}

export async function getWidgets(): Promise<Widget[]> {
  await ensureDbExists();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
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
    maxReviews: widget.maxReviews || 5,
    minRating: widget.minRating || 1,
    autoStyle: widget.autoStyle !== false,
    placeId: widget.placeId,
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
