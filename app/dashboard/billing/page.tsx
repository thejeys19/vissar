"use client";

import { CheckoutButton } from "@/components/checkout-button";
import { Check, X } from "lucide-react";

const features = {
  free: ["200 views/month", "1 widget", "Basic layouts", "Community support"],
  pro: ["5,000 views/month", "10 widgets", "All layouts", "Priority support", "Custom branding", "Analytics"],
  business: ["Unlimited views", "Unlimited widgets", "All layouts", "Dedicated support", "Custom branding", "Advanced analytics", "API access", "White-label"],
};

const comparison = [
  { feature: "Monthly views", free: "200", pro: "5,000", business: "Unlimited" },
  { feature: "Widgets", free: "1", pro: "10", business: "Unlimited" },
  { feature: "Layouts", free: "Basic", pro: "All", business: "All" },
  { feature: "Custom branding", free: false, pro: true, business: true },
  { feature: "Analytics", free: false, pro: true, business: true },
  { feature: "API access", free: false, pro: false, business: true },
  { feature: "White-label", free: false, pro: false, business: true },
  { feature: "Support", free: "Community", pro: "Priority", business: "Dedicated" },
];

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Billing</h1>
        <p className="text-slate-400 mt-1">Manage your plan and usage</p>
      </div>

      {/* Current Plan */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Current Plan</h2>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-white">Free Plan</span>
          <span className="px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded-full">Active</span>
        </div>
        <ul className="space-y-2">
          {features.free.map((f) => (
            <li key={f} className="flex items-center gap-2 text-slate-400 text-sm">
              <Check className="w-4 h-4 text-emerald-400" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Usage Meter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Usage This Month</h2>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">147 / 200 views this month</span>
          <span className="text-slate-400">74%</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-[74%] bg-gradient-to-r from-violet-500 to-purple-600 rounded-full" />
        </div>
      </div>

      {/* Upgrade Cards */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Upgrade Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pro */}
          <div className="bg-slate-900 border border-violet-500/30 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-white">$8</span>
                <span className="text-slate-400">/mo</span>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              {features.pro.map((f) => (
                <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-violet-400" />
                  {f}
                </li>
              ))}
            </ul>
            <CheckoutButton
              planId="pro"
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            >
              Upgrade to Pro
            </CheckoutButton>
          </div>

          {/* Business */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">Business</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-white">$15</span>
                <span className="text-slate-400">/mo</span>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              {features.business.map((f) => (
                <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
            <CheckoutButton
              planId="business"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white"
            >
              Upgrade to Business
            </CheckoutButton>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Plan Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-6 py-3 text-sm font-medium text-slate-400">Feature</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-400">Free</th>
                <th className="px-6 py-3 text-sm font-medium text-violet-400">Pro</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-400">Business</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-slate-800/50">
                  <td className="px-6 py-3 text-white text-sm">{row.feature}</td>
                  {(["free", "pro", "business"] as const).map((plan) => (
                    <td key={plan} className="px-6 py-3 text-sm">
                      {typeof row[plan] === "boolean" ? (
                        row[plan] ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600" />
                        )
                      ) : (
                        <span className="text-slate-300">{row[plan]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
