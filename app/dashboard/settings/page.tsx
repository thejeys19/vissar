"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Shield, Bell, Key, AlertTriangle, Check } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    weekly: true,
    performance: true,
    updates: true,
  });

  const email = session?.user?.email || "";

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      await update({ name: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
            <div className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 text-sm">
              {email || "Loading..."}
            </div>
            <p className="text-xs text-slate-600 mt-1">Managed by Google — cannot be changed here</p>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              placeholder="Your name"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <button
            onClick={handleSaveName}
            disabled={saving || !name.trim()}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              saved
                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"
                : "bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
            }`}
          >
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: "weekly", label: "Weekly usage summary", desc: "Get a weekly report of your widget views" },
            { key: "performance", label: "Widget performance alerts", desc: "Be notified when approaching your view limit" },
            { key: "updates", label: "Product updates & tips", desc: "New features and best practices" },
          ].map((item) => (
            <div key={item.key} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
              <button
                onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5 ${
                  notifications[item.key as keyof typeof notifications] ? "bg-violet-600" : "bg-slate-600"
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  notifications[item.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"
                }`} />
              </button>
              <div>
                <p className="text-sm font-medium text-slate-300">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Access */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Key className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">API Access</h2>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <p className="text-sm text-white font-medium">API key available on Business plan</p>
            <p className="text-xs text-slate-500 mt-0.5">Upgrade to Business to access the Vissar API and embed widgets programmatically</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-900 border border-red-500/20 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Permanently delete your account and all widgets. This cannot be undone.
        </p>
        <button
          onClick={() => {
            if (confirm("Are you sure? This will delete your account and all widgets permanently.")) {
              alert("Please contact support@vissar.com to delete your account.");
            }
          }}
          className="px-4 py-2.5 bg-red-600/10 border border-red-500/30 text-red-400 text-sm rounded-lg hover:bg-red-600/20 transition-colors font-medium"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
