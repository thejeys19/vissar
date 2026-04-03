import { eq, and } from 'drizzle-orm';
import { getDb } from '@/lib/db/connection';
import { widgets } from '@/lib/db/schema/widgets';
import type { WidgetRecord, WidgetConfig, WidgetApiShape } from '@/lib/types/widget';
import type { PlanTier } from '@/lib/types/plan';

function rowToRecord(row: typeof widgets.$inferSelect): WidgetRecord {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    placeId: row.placeId,
    layout: row.layout,
    config: (row.config as WidgetConfig) ?? {},
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** Convert DB record to the legacy API shape the frontend expects */
export function recordToApiShape(record: WidgetRecord, tier: PlanTier = 'free'): WidgetApiShape {
  const cfg = record.config as WidgetConfig;
  return {
    id: record.id,
    name: record.name,
    layout: record.layout,
    template: (cfg.template as string) ?? 'soft',
    maxReviews: (cfg.maxReviews as number) ?? 5,
    minRating: (cfg.minRating as number) ?? 1,
    autoStyle: (cfg.autoStyle as boolean) ?? true,
    animations: (cfg.animations as boolean) ?? true,
    placeId: record.placeId,
    userId: record.userId,
    tier,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : record.createdAt.toISOString(),
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : record.updatedAt.toISOString(),
  };
}

export async function getWidgetsByUser(userId: string): Promise<WidgetRecord[]> {
  const db = getDb();
  const rows = await db.select().from(widgets).where(eq(widgets.userId, userId));
  return rows.map(rowToRecord);
}

export async function getWidget(id: string): Promise<WidgetRecord | null> {
  const db = getDb();
  const [row] = await db.select().from(widgets).where(eq(widgets.id, id)).limit(1);
  return row ? rowToRecord(row) : null;
}

export async function getWidgetOwned(id: string, userId: string): Promise<WidgetRecord | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(widgets)
    .where(and(eq(widgets.id, id), eq(widgets.userId, userId)))
    .limit(1);
  return row ? rowToRecord(row) : null;
}

export async function createWidget(data: {
  userId: string;
  name: string;
  placeId?: string | null;
  layout: string;
  config: WidgetConfig;
}): Promise<WidgetRecord> {
  const db = getDb();
  const now = new Date();
  const id = `widget_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const [row] = await db
    .insert(widgets)
    .values({
      id,
      userId: data.userId,
      name: data.name,
      placeId: data.placeId ?? null,
      layout: data.layout,
      config: data.config,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return rowToRecord(row);
}

export async function updateWidget(
  id: string,
  userId: string,
  data: Partial<{
    name: string;
    placeId: string | null;
    layout: string;
    config: WidgetConfig;
  }>
): Promise<WidgetRecord | null> {
  const db = getDb();

  const [row] = await db
    .update(widgets)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(widgets.id, id), eq(widgets.userId, userId)))
    .returning();

  return row ? rowToRecord(row) : null;
}

export async function deleteWidget(id: string, userId: string): Promise<boolean> {
  const db = getDb();
  const result = await db
    .delete(widgets)
    .where(and(eq(widgets.id, id), eq(widgets.userId, userId)))
    .returning({ id: widgets.id });
  return result.length > 0;
}

export async function deleteAllUserWidgets(userId: string): Promise<void> {
  const db = getDb();
  await db.delete(widgets).where(eq(widgets.userId, userId));
}
