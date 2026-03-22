"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Users, Plus, X, Copy, Link as LinkIcon, Check } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  widgetCount: number;
  plan: string;
  createdAt: string;
}

export default function ClientsPage() {
  useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState<Client | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    if (!newName.trim() || !newEmail.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), email: newEmail.trim() }),
      });
      if (res.ok) {
        setNewName("");
        setNewEmail("");
        setShowAddModal(false);
        fetchClients();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const copyShareLink = (client: Client) => {
    const link = `https://www.vissar.com/shared/${client.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Clients</h1>
          <p className="text-slate-400 mt-1">Manage your client accounts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Client List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No clients yet</p>
            <p className="text-slate-500 text-sm mt-1">Add your first client to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-5 py-3 text-sm font-medium text-slate-400">Name</th>
                  <th className="px-5 py-3 text-sm font-medium text-slate-400">Email</th>
                  <th className="px-5 py-3 text-sm font-medium text-slate-400">Widgets</th>
                  <th className="px-5 py-3 text-sm font-medium text-slate-400">Plan</th>
                  <th className="px-5 py-3 text-sm font-medium text-slate-400">Created</th>
                  <th className="px-5 py-3 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 text-white text-sm font-medium">{client.name}</td>
                    <td className="px-5 py-4 text-slate-300 text-sm">{client.email}</td>
                    <td className="px-5 py-4 text-slate-300 text-sm">{client.widgetCount || 0}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 capitalize">
                        {client.plan || "free"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-sm">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setShowShareModal(client)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        Share Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Add Client</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Client name"
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <button
                onClick={handleAddClient}
                disabled={saving || !newName.trim() || !newEmail.trim()}
                className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
              >
                {saving ? "Adding..." : "Add Client"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Access Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowShareModal(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Share Access</h2>
              <button onClick={() => setShowShareModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Share this link with <span className="text-white font-medium">{showShareModal.name}</span> to give them access to their dashboard.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`https://www.vissar.com/shared/${showShareModal.id}`}
                className="flex-1 px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm font-mono"
              />
              <button
                onClick={() => copyShareLink(showShareModal)}
                className="px-3 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              This link provides read-only access to the client&apos;s widget dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
