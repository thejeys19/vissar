import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Plus, Settings, CreditCard, LogOut, User } from "lucide-react";

// Demo user for when auth is not configured
const demoUser = {
  name: "Demo User",
  email: "demo@vissar.app",
  initial: "D"
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  let isDemoMode = false;

  try {
    session = await getServerSession(authOptions);
  } catch {
    // Auth not configured - use demo mode
    isDemoMode = true;
  }

  const user = session?.user || (isDemoMode ? demoUser : null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
          <p className="text-sm text-amber-400">
            Demo Mode — <Link href="/landing" className="underline hover:text-amber-300">Sign in</Link> to save your widgets
          </p>
        </div>
      )}

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="Vissar" width={40} height={40} className="w-10 h-10 rounded-lg" />
            <span className="font-bold text-xl">vissar</span>
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link
            href="/widget/new"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Widget</span>
          </Link>
          
          <Link
            href="/billing"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span>Billing</span>
          </Link>
          
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.[0] || user?.email?.[0] || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
              <p className="text-xs text-slate-500">Free Plan</p>
            </div>
            {session ? (
              <Link href="/api/auth/signout">
                <LogOut className="w-4 h-4 text-slate-500 hover:text-slate-300" />
              </Link>
            ) : (
              <User className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`ml-64 ${isDemoMode ? 'pt-10' : ''}`}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
