import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db/connection';
import { users } from '@/lib/db/schema/users';
import type { UserRecord } from '@/lib/types/user';
import type { PlanTier } from '@/lib/types/plan';

function rowToUser(row: typeof users.$inferSelect): UserRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    plan: row.plan as PlanTier,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const db = getDb();
  const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return row ? rowToUser(row) : null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const db = getDb();
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ? rowToUser(row) : null;
}

export async function upsertUser(data: {
  id: string;
  email: string;
  name?: string | null;
  plan?: PlanTier;
}): Promise<UserRecord> {
  const db = getDb();
  const now = new Date();

  const [row] = await db
    .insert(users)
    .values({
      id: data.id,
      email: data.email,
      name: data.name ?? null,
      plan: data.plan ?? 'free',
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        name: data.name ?? undefined,
        plan: data.plan ?? undefined,
        updatedAt: now,
      },
    })
    .returning();

  return rowToUser(row);
}

export async function updateUserName(email: string, name: string): Promise<UserRecord | null> {
  const db = getDb();
  const [row] = await db
    .update(users)
    .set({ name, updatedAt: new Date() })
    .where(eq(users.email, email))
    .returning();
  return row ? rowToUser(row) : null;
}

export async function updateUserPlan(email: string, plan: PlanTier): Promise<UserRecord | null> {
  const db = getDb();
  const [row] = await db
    .update(users)
    .set({ plan, updatedAt: new Date() })
    .where(eq(users.email, email))
    .returning();
  return row ? rowToUser(row) : null;
}

export async function deleteUser(email: string): Promise<void> {
  const db = getDb();
  await db.delete(users).where(eq(users.email, email));
}
