export default function AnalyticsPage() {
  const stats = [
    { label: "Total Views", value: "1,247", color: "text-violet-400" },
    { label: "This Month", value: "847", color: "text-emerald-400" },
    { label: "Growth", value: "+36%", color: "text-amber-400" },
    { label: "Best Widget", value: "Main Site", color: "text-blue-400" },
  ];

  const daily = [
    { date: "Mon", views: 89 },
    { date: "Tue", views: 134 },
    { date: "Wed", views: 112 },
    { date: "Thu", views: 201 },
    { date: "Fri", views: 178 },
    { date: "Sat", views: 67 },
    { date: "Sun", views: 66 },
  ];

  const maxViews = Math.max(...daily.map((d) => d.views));

  const widgets = [
    { id: "w1", name: "Main Site Widget", views: 623, clicks: 41, ctr: 6.6 },
    { id: "w2", name: "Homepage Reviews", views: 224, clicks: 18, ctr: 8.0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Track your widget performance and engagement</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Views — Last 7 Days</h2>
        <div className="flex items-end gap-3 h-48">
          {daily.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-slate-400">{d.views}</span>
              <div
                className="w-full bg-gradient-to-t from-violet-600 to-purple-500 rounded-t-md transition-all"
                style={{ height: `${(d.views / maxViews) * 100}%` }}
              />
              <span className="text-xs text-slate-500">{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Widget Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Per-Widget Breakdown</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 text-left">
              <th className="px-6 py-3 text-sm font-medium text-slate-400">Widget</th>
              <th className="px-6 py-3 text-sm font-medium text-slate-400">Views</th>
              <th className="px-6 py-3 text-sm font-medium text-slate-400">Clicks</th>
              <th className="px-6 py-3 text-sm font-medium text-slate-400">CTR%</th>
            </tr>
          </thead>
          <tbody>
            {widgets.map((w) => (
              <tr key={w.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="px-6 py-4 text-white font-medium">{w.name}</td>
                <td className="px-6 py-4 text-slate-300">{w.views}</td>
                <td className="px-6 py-4 text-slate-300">{w.clicks}</td>
                <td className="px-6 py-4 text-violet-400">{w.ctr}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
