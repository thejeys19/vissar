export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-slate-700 border-t-violet-500 rounded-full animate-spin" />
      <p className="text-slate-400 mt-4 text-sm">Loading...</p>
    </div>
  );
}
