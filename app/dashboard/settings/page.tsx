import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Shield, Bell, Key, AlertTriangle } from "lucide-react";

export default async function SettingsPage() {
  let email = "demo@vissar.app";
  let name = "Demo User";

  try {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      email = session.user.email || email;
      name = session.user.name || name;
    }
  } catch {
    // Auth not configured — use defaults
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Profile</h2>
        </div>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <div className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm">
              {email}
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Display Name</label>
            <input
              type="text"
              defaultValue={name}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
          <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-lg transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-4 max-w-md">
          {["Weekly usage summary", "Widget performance alerts", "Product updates & tips"].map((label) => (
            <label key={label} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500"
              />
              <span className="text-sm text-slate-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* API Access */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">API Access</h2>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
            <Key className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <p className="text-sm text-white font-medium">API key available on Pro plan</p>
            <p className="text-xs text-slate-500">Upgrade to access the Vissar API</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-900 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="px-4 py-2 bg-red-600/10 border border-red-500/30 text-red-400 text-sm rounded-lg hover:bg-red-600/20 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
