import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getWidgetsByUser } from "@/lib/db";
import { getUserPlan } from "@/lib/plans";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/signin");

  const userId = (session.user as { id?: string }).id || session.user.email;
  const userPlan = getUserPlan(session.user.email);
  const widgets = await getWidgetsByUser(userId).catch(() => []);

  const totalViews = userPlan.views || 0;
  const viewLimit = userPlan.limit || 200;

  const stats = [
    { label: "Total Views", value: totalViews.toLocaleString(), color: "text-violet-400" },
    { label: "View Limit", value: viewLimit.toLocaleString(), color: "text-emerald-400" },
    { label: "Widgets Active", value: widgets.length.toString(), color: "text-amber-400" },
    { label: "Plan", value: userPlan.plan.charAt(0).toUpperCase() + userPlan.plan.slice(1), color: "text-blue-400" },
  ];

  // Mock 7-day distribution of views
  const daily = totalViews > 0 ? [
    { date: "Mon", views: Math.floor(totalViews * 0.12) },
    { date: "Tue", views: Math.floor(totalViews * 0.18) },
    { date: "Wed", views: Math.floor(totalViews * 0.14) },
    { date: "Thu", views: Math.floor(totalViews * 0.20) },
    { date: "Fri", views: Math.floor(totalViews * 0.16) },
    { date: "Sat", views: Math.floor(totalViews * 0.11) },
    { date: "Sun", views: Math.floor(totalViews * 0.09) },
  ] : [
    { date: "Mon", views: 0 },
    { date: "Tue", views: 0 },
    { date: "Wed", views: 0 },
    { date: "Thu", views: 0 },
    { date: "Fri", views: 0 },
    { date: "Sat", views: 0 },
    { date: "Sun", views: 0 },
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
          <h2 className="text-base sm:text-lg font-semibold text-white">Your Widgets</h2>
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
                  <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-slate-400">Layout</th>
                  <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-slate-400">Reviews</th>
                  <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-slate-400">Template</th>
                </tr>
              </thead>
              <tbody>
                {widgets.map((w) => (
                  <tr key={w.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="px-4 sm:px-6 py-3 text-white font-medium text-sm">{w.name}</td>
                    <td className="px-4 sm:px-6 py-3 text-slate-300 text-sm capitalize">{w.layout}</td>
                    <td className="px-4 sm:px-6 py-3 text-slate-300 text-sm">{w.maxReviews}</td>
                    <td className="px-4 sm:px-6 py-3 text-violet-400 text-sm capitalize">{w.template}</td>
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
