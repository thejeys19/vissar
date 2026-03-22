"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Plus, Settings, CreditCard, User, BarChart2, Menu, X } from "lucide-react";

// Demo user for when auth is not configured
const demoUser = {
  name: "Demo User",
  email: "demo@vissar.app",
  initial: "D"
};

const navLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/widget/new", icon: Plus, label: "Create Widget" },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

// Logo text component that adapts to background
function LogoText({ darkMode = false, className = "" }: { darkMode?: boolean; className?: string }) {
  return (
    <span className={`font-bold ${className} ${darkMode ? 'text-white' : 'bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent'}`}>
      vissar
    </span>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = demoUser;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile, icon-only on tablet, full on desktop */}
      <aside
        className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 z-50
          hidden md:flex md:flex-col md:w-16 lg:w-64 transition-all duration-200`}
      >
        <div className="p-4 lg:p-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-icon.png" alt="Vissar" width={44} height={44} className="w-11 h-11 rounded-2xl" />
            <LogoText darkMode className="text-2xl hidden lg:inline" />
          </Link>
        </div>

        <nav className="px-2 lg:px-4 space-y-2 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              title={link.label}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-2 lg:p-4">
          <div className="flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg bg-slate-800/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-medium">
                {user?.name?.[0] || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0 hidden lg:block">
              <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
              <p className="text-xs text-slate-500">Free Plan</p>
            </div>
            <User className="w-4 h-4 text-slate-500 hidden lg:block" />
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <Image src="/logo-icon.png" alt="Vissar" width={44} height={44} className="w-11 h-11 rounded-2xl" />
            <LogoText darkMode className="text-2xl" />
          </Link>
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">{user?.name?.[0] || "U"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
              <p className="text-xs text-slate-500">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar with hamburger */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center px-4 z-30 md:hidden">
        <button onClick={() => setMobileOpen(true)} className="text-slate-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center gap-2.5 ml-3">
          <Image src="/logo-icon.png" alt="Vissar" width={36} height={36} className="w-9 h-9 rounded-xl" />
          <LogoText darkMode className="text-xl" />
        </Link>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around z-30 md:hidden">
        {navLinks.slice(0, 4).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-violet-400 transition-colors"
          >
            <link.icon className="w-5 h-5" />
            <span className="text-[10px]">{link.label.split(" ")[0]}</span>
          </Link>
        ))}
      </div>

      {/* Main content */}
      <main className="ml-0 md:ml-16 lg:ml-64 transition-all duration-200 pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
