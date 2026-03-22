"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { Shield, Bell, Key, AlertTriangle, Check, Copy, Globe, Lock } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const [apiKey, setApiKey] = useState("");
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [domainSaving, setDomainSaving] = useState(false);
  const [domainSaved, setDomainSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    weekly: true,
    performance: true,
    updates: true,
  });
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  const email = session?.user?.email || "";

  // Fetch user plan, notification prefs, API key, custom domain
  const loadData = useCallback(async () => {
    if (!email) return;
    try {
      const [planRes, notifRes, keyRes, domainRes] = await Promise.all([
        fetch("/api/user/plan").then(r => r.ok ? r.json() : null),
        fetch(`/api/user/notifications`).then(r => r.ok ? r.json() : null),
        fetch(`/api/user/api-key`).then(r => r.ok ? r.json() : null),
        fetch(`/api/user/custom-domain`).then(r => r.ok ? r.json() : null),
      ]);
      if (planRes?.plan) setUserPlan(planRes.plan);
      if (notifRes?.notifications) setNotifications(notifRes.notifications);
      if (keyRes?.apiKey) setApiKey(keyRes.apiKey);
      if (domainRes?.domain) setCustomDomain(domainRes.domain);
    } catch {}
  }, [email]);

  useEffect(() => { loadData(); }, [loadData]);

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

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This will permanently delete your account and all your widgets. This cannot be undone.")) return;
    if (!confirm("This is your last chance. Type 'delete' in the next prompt to confirm.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user/settings", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch {
      alert("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveNotifications = async () => {
    setNotifSaving(true);
    try {
      await fetch("/api/user/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications }),
      });
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 3000);
    } catch {
      alert("Failed to save notifications.");
    } finally {
      setNotifSaving(false);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const handleSaveDomain = async () => {
    setDomainSaving(true);
    try {
      await fetch("/api/user/custom-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: customDomain.trim() }),
      });
      setDomainSaved(true);
      setTimeout(() => setDomainSaved(false), 3000);
    } catch {
      alert("Failed to save domain.");
    } finally {
      setDomainSaving(false);
    }
  };

  const isPro = userPlan === "pro" || userPlan === "business";

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
        <button
          onClick={handleSaveNotifications}
          disabled={notifSaving}
          className={`mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            notifSaved
              ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"
              : "bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
          }`}
        >
          {notifSaved ? <><Check className="w-4 h-4" /> Saved!</> : notifSaving ? "Saving..." : "Save Notifications"}
        </button>
      </div>

      {/* API Access */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Key className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">API Access</h2>
        </div>
        {isPro && apiKey ? (
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">Your API Key</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyApiKey}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  apiKeyCopied
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"
                    : "bg-violet-600 hover:bg-violet-700 text-white"
                }`}
              >
                {apiKeyCopied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
              </button>
            </div>
            <p className="text-xs text-slate-500">Use this key to authenticate API requests. Keep it secret.</p>
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm text-white font-medium">API key available on Pro plan</p>
              <p className="text-xs text-slate-500 mt-0.5">Upgrade to Pro or Business to access the Vissar API and embed widgets programmatically</p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Domain */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Custom Domain</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">PRO</span>
        </div>
        {isPro ? (
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">Your custom widget domain</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="reviews.yourdomain.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
              <button
                onClick={handleSaveDomain}
                disabled={domainSaving}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  domainSaved
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"
                    : "bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                }`}
              >
                {domainSaved ? "Saved!" : domainSaving ? "Saving..." : "Save"}
              </button>
            </div>
            <p className="text-xs text-slate-500">Point a CNAME record to widget.vissar.com, then enter your domain above.</p>
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm text-white font-medium">Custom domain available on Pro plan</p>
              <p className="text-xs text-slate-500 mt-0.5">Upgrade to serve widgets from your own domain for a white-label experience</p>
            </div>
          </div>
        )}
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
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="px-4 py-2.5 bg-red-600/10 border border-red-500/30 text-red-400 text-sm rounded-lg hover:bg-red-600/20 transition-colors font-medium disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
}
