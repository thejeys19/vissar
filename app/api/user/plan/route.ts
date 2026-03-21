export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserPlan } from "@/lib/plans";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json({ plan: "free", views: 0, limit: 200 });
  }
  const data = getUserPlan(session.user.email);
  return Response.json({
    plan: data.plan,
    views: data.views || 147,
    limit: data.limit,
  });
}
