export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    totalViews: 1247,
    thisMonth: 847,
    lastMonth: 621,
    growth: 36.4,
    daily: [
      { date: "Mon", views: 89 },
      { date: "Tue", views: 134 },
      { date: "Wed", views: 112 },
      { date: "Thu", views: 201 },
      { date: "Fri", views: 178 },
      { date: "Sat", views: 67 },
      { date: "Sun", views: 66 },
    ],
    widgets: [
      { id: "w1", name: "Main Site Widget", views: 623, clicks: 41, ctr: 6.6 },
      { id: "w2", name: "Homepage Reviews", views: 224, clicks: 18, ctr: 8.0 },
    ],
  });
}
