"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Settings, CreditCard, BarChart2, Menu, X, LogOut, Users, Gift, Plug, QrCode, Mail } from "lucide-react";

const navLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/widget/new", icon: Plus, label: "Create Widget" },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
  { href: "/dashboard/integrations", icon: Plug, label: "Integrations" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/referral", icon: Gift, label: "Referral" },
  { href: "/dashboard/qr", icon: QrCode, label: "QR Code" },
  { href: "/dashboard/review-request", icon: Mail, label: "Get Reviews" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

function LogoText({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold ${className} text-white`}>
      vissar
    </span>
  );
}

function UserSection({ compact = false }: { compact?: boolean }) {
  const { data: session } = useSession();
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    fetch("/api/user/plan").then(r => r.ok ? r.json() : null).then(d => {
      if (d?.plan) setPlan(d.plan);
    }).catch(() => {});
  }, []);

  const name = session?.user?.name || session?.user?.email || "User";
  const email = session?.user?.email || "";
  const initial = name[0]?.toUpperCase() || "U";
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800/30">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
          {session?.user?.image ? (
            <img src={session.user.image} alt={name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="text-white text-sm font-medium">{initial}</span>
          )}
        </div>
        <div className="flex-1 min-w-0 hidden lg:block">
          <p className="text-sm font-medium text-white truncate">{name}</p>
          <p className="text-xs text-slate-500">{planLabel} Plan</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="hidden lg:block text-slate-500 hover:text-slate-300 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-slate-800">
      <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800 transition-colors cursor-pointer">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
          {session?.user?.image ? (
            <img src={session.user.image} alt={name} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <span className="text-white text-sm font-semibold">{initial}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          <p className="text-xs text-slate-500 truncate">{email}</p>
          <p className="text-xs text-violet-400">{planLabel} Plan</p>
        </div>
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors text-sm"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const initial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U";

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 z-50 hidden md:flex md:flex-col md:w-16 lg:w-64">
        <div className="p-4 lg:p-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-icon.png" alt="Vissar" width={44} height={44} className="w-11 h-11 rounded-2xl" />
            <LogoText className="text-2xl hidden lg:inline" />
          </Link>
        </div>

        <nav className="px-2 lg:px-4 space-y-1 flex-1 overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-violet-600/20 text-violet-400 border border-violet-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
                title={link.label}
              >
                <link.icon className="w-5 h-5 shrink-0" />
                <span className="hidden lg:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 lg:p-0">
          <UserSection compact />
        </div>
      </aside>

      {/* Mobile Drawer */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-200 md:hidden flex flex-col ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 flex items-center justify-between border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <Image src="/logo-icon.png" alt="Vissar" width={40} height={40} className="w-10 h-10 rounded-xl" />
            <LogoText className="text-xl" />
          </Link>
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-3 space-y-1 flex-1 overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active
                    ? "bg-violet-600/20 text-violet-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <link.icon className="w-5 h-5 shrink-0" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <UserSection />
      </aside>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 z-30 md:hidden">
        <button onClick={() => setMobileOpen(true)} className="text-slate-400 hover:text-white p-1 -ml-1">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center gap-2 ml-3">
          <Image src="/logo-icon.png" alt="Vissar" width={32} height={32} className="w-8 h-8 rounded-lg" />
          <LogoText className="text-lg" />
        </Link>
        {/* Avatar in top bar */}
        <button
          onClick={() => setMobileOpen(true)}
          className="ml-auto w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
        >
          {session?.user?.image ? (
            <img src={session.user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="text-white text-sm font-semibold">{initial}</span>
          )}
        </button>
      </div>

      {/* Mobile Bottom Tab Bar — top 5 most used */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around z-30 md:hidden">
        {[navLinks[0], navLinks[1], navLinks[2], navLinks[3], navLinks[9]].map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 transition-colors py-2 ${active ? "text-violet-400" : "text-slate-500 hover:text-violet-400"}`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[9px]">{link.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="ml-0 md:ml-16 lg:ml-64 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
