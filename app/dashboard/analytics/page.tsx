import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getWidgetsByUser } from "@/lib/db";
import { getUserPlanAsync } from "@/lib/plans";
import { Redis } from "@upstash/redis";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/signin");

  const userId = (session.user as { id?: string }).id || session.user.email;
  const userPlan = await getUserPlanAsync(session.user.email);
  const widgets = await getWidgetsByUser(userId).catch(() => []);

  // Fetch real analytics from Redis
  let totalViews = 0;
  let totalClicks = 0;
  const widgetStats: { id: string; name: string; views: number; clicks: number; ctr: number }[] = [];
  const days: string[] = [];
  const dayLabels: string[] = [];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
    dayLabels.push(weekdays[d.getDay()]);
  }

  let daily = dayLabels.map(label => ({ date: label, views: 0, clicks: 0 }));

  const redis = getRedis();
  if (redis && widgets.length > 0) {
    try {
      const pipeline = redis.pipeline();
      for (const w of widgets) {
        pipeline.get(`analytics:${w.id}:views`);
        pipeline.get(`analytics:${w.id}:clicks`);
      }
      for (const day of days) {
        for (const w of widgets) {
          pipeline.get(`analytics:${w.id}:${day}:views`);
          pipeline.get(`analytics:${w.id}:${day}:clicks`);
        }
      }
      const results = await pipeline.exec();
      let idx = 0;

      for (const w of widgets) {
        const views = Number(results[idx++]) || 0;
        const clicks = Number(results[idx++]) || 0;
        totalViews += views;
        totalClicks += clicks;
        const ctr = views > 0 ? Math.round((clicks / views) * 1000) / 10 : 0;
        widgetStats.push({ id: w.id, name: w.name, views, clicks, ctr });
      }

      daily = days.map((_, di) => {
        let dayViews = 0;
        let dayClicks = 0;
        for (let wi = 0; wi < widgets.length; wi++) {
          dayViews += Number(results[idx++]) || 0;
          dayClicks += Number(results[idx++]) || 0;
        }
        return { date: dayLabels[di], views: dayViews, clicks: dayClicks };
      });
    } catch (e) {
      console.error("Analytics fetch error:", e);
    }
  }

  const viewLimit = userPlan.limit || 200;

  const stats = [
    { label: "Total Views", value: totalViews.toLocaleString(), color: "text-violet-400" },
    { label: "Total Clicks", value: totalClicks.toLocaleString(), color: "text-emerald-400" },
    { label: "Widgets Active", value: widgets.length.toString(), color: "text-amber-400" },
    { label: "View Limit", value: viewLimit.toLocaleString(), color: "text-blue-400" },
  ];

  const maxViews = Math.max(...daily.map((d) => d.views), 1);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Track your widget performance and engagement</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6">
            <p className="text-slate-400 text-xs sm:text-sm">{s.label}</p>
            <p className={`text-xl sm:text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Views — Last 7 Days</h2>
        {totalViews === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-slate-500 text-sm">No views yet — embed your widget to start tracking</p>
          </div>
        ) : (
          <div className="flex items-end gap-2 sm:gap-3 h-40 sm:h-48">
            {daily.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs text-slate-400">{d.views}</span>
                <div
                  className="w-full bg-gradient-to-t from-violet-600 to-purple-500 rounded-t-md transition-all min-h-[4px]"
                  style={{ height: `${(d.views / maxViews) * 100}%` }}
                />
                <span className="text-[10px] sm:text-xs text-slate-500">{d.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Per-Widget Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-800">
          <h2 className="text-base sm:text-lg font-semibold text-white">Per-Widget Performance</h2>
        </div>
        {widgets.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No widgets yet. <a href="/dashboard/widget/new" className="text-violet-400 hover:text-violet-300">Create your first widget</a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-slate-400">Widget</th>
                  <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-slate-400">Views</th>
                  <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-slate-400">Clicks</th>
                  <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-slate-400">CTR</th>
                </tr>
              </thead>
              <tbody>
                {widgetStats.map((w) => (
                  <tr key={w.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="px-4 sm:px-6 py-3 text-white font-medium text-sm">{w.name}</td>
                    <td className="px-4 sm:px-6 py-3 text-slate-300 text-sm">{w.views.toLocaleString()}</td>
                    <td className="px-4 sm:px-6 py-3 text-slate-300 text-sm">{w.clicks.toLocaleString()}</td>
                    <td className="px-4 sm:px-6 py-3 text-violet-400 text-sm">{w.ctr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
