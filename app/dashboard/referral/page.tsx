"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Gift, Copy, Check, Users, Zap, CreditCard } from "lucide-react";

export default function ReferralPage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const userId = (session?.user as { id?: string })?.id || session?.user?.email || "";
  const referralLink = `https://www.vissar.com/?ref=${encodeURIComponent(userId)}`;

  useEffect(() => {
    fetch("/api/referral")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.count !== undefined) setReferralCount(data.count);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      icon: Copy,
      title: "Share your link",
      description: "Copy your unique referral link and share it with friends or colleagues.",
    },
    {
      icon: Users,
      title: "They sign up",
      description: "When someone signs up using your link, they get tracked as your referral.",
    },
    {
      icon: Zap,
      title: "You get rewarded",
      description: "For each successful referral, you get 1 month of Pro for free.",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Referral Program</h1>
        <p className="text-slate-400 mt-1">Refer a friend, get 1 month free</p>
      </div>

      {/* Referral Link Card */}
      <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 border border-violet-500/30 rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-6 h-6 text-violet-400" />
          <h2 className="text-xl font-bold text-white">Your Referral Link</h2>
        </div>
        <p className="text-slate-300 text-sm mb-5">
          Share this link. When someone signs up, you both benefit.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 text-sm font-mono"
          />
          <button
            onClick={copyLink}
            className="px-4 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Your Referrals</h2>
        </div>
        {loading ? (
          <p className="text-slate-500 text-sm">Loading...</p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-white">{referralCount}</div>
            <div>
              <p className="text-slate-300 text-sm font-medium">
                {referralCount === 1 ? "Referral" : "Referrals"}
              </p>
              <p className="text-slate-500 text-xs">
                {referralCount > 0
                  ? `${referralCount} free month${referralCount === 1 ? "" : "s"} earned`
                  : "Start sharing to earn free months"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* How it Works */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">How it Works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center mb-3">
                <step.icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">
                {i + 1}. {step.title}
              </h3>
              <p className="text-slate-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
