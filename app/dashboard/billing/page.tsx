import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserPlan } from "@/lib/plans";
import { CheckoutButton } from "@/components/checkout-button";
import { Check, X, CreditCard, Zap } from "lucide-react";


export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/signin");

  const userPlan = getUserPlan(session.user.email);
  const planName = userPlan.plan;
  const viewUsage = userPlan.views || 0;
  const viewLimit = userPlan.limit || 200;
  const usagePct = Math.min(Math.round((viewUsage / viewLimit) * 100), 100);

  const planFeatures: Record<string, string[]> = {
    free: ["200 views/month", "1 widget", "3 layouts", "Vissar branding", "Community support"],
    pro: ["10,000 views/month", "3 widgets", "All 9 layouts", "All 10+ templates", "No branding", "Priority support"],
    business: ["50,000 views/month", "9 widgets", "All layouts & templates", "Custom CSS", "No branding", "API access", "Priority support"],
  };

  const comparison = [
    { feature: "Monthly views", free: "200", pro: "10,000", business: "50,000" },
    { feature: "Widgets", free: "1", pro: "3", business: "9" },
    { feature: "Templates", free: "3", pro: "All 10+", business: "All 10+" },
    { feature: "Remove branding", free: false, pro: true, business: true },
    { feature: "Analytics", free: true, pro: true, business: true },
    { feature: "API access", free: false, pro: false, business: true },
    { feature: "Custom CSS", free: false, pro: false, business: true },
    { feature: "Support", free: "Community", pro: "Priority", business: "Priority" },
  ];

  const plans = [
    { id: "pro" as const, name: "Pro", price: "$8", period: "/mo", color: "from-violet-500 to-purple-600" },
    { id: "business" as const, name: "Business", price: "$15", period: "/mo", color: "from-slate-700 to-slate-800" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Billing</h1>
        <p className="text-slate-400 mt-1">Manage your plan and usage</p>
      </div>

      {/* Current Plan */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Current Plan</h2>
        </div>
        <div className="flex items-center gap-3 mt-3 mb-4">
          <span className="text-2xl font-bold text-white capitalize">{planName} Plan</span>
          <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">Active</span>
        </div>
        <ul className="space-y-2">
          {(planFeatures[planName] || planFeatures.free).map((f) => (
            <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        {planName !== "free" && (
          <p className="text-xs text-slate-500 mt-4">To manage or cancel your subscription, contact <a href="mailto:support@vissar.com" className="text-violet-400 hover:text-violet-300">support@vissar.com</a></p>
        )}
      </div>

      {/* Usage */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Usage This Month</h2>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">{viewUsage.toLocaleString()} / {viewLimit.toLocaleString()} views</span>
          <span className={`font-medium ${usagePct > 80 ? 'text-amber-400' : 'text-slate-400'}`}>{usagePct}%</span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${usagePct > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-violet-500 to-purple-600'}`}
            style={{ width: `${usagePct}%` }}
          />
        </div>
        {usagePct > 80 && (
          <p className="text-xs text-amber-400 mt-2">Running low — upgrade for more views</p>
        )}
      </div>

      {/* Upgrade section — only show plans above current */}
      {planName !== "business" && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            {planName === "free" ? "Upgrade Your Plan" : "Upgrade to Business"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {plans
              .filter(p => {
                if (planName === "pro") return p.id === "business";
                return true;
              })
              .map((plan) => (
                <div key={plan.id} className={`bg-slate-900 border ${plan.id === "pro" ? "border-violet-500/40" : "border-slate-800"} rounded-xl p-5 sm:p-6`}>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {planFeatures[plan.id].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                        <Check className="w-4 h-4 text-violet-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <CheckoutButton
                    planId={plan.id}
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold`}
                  >
                    Upgrade to {plan.name}
                  </CheckoutButton>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Plan Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-4 sm:px-6 py-3 text-sm font-medium text-slate-400">Feature</th>
                <th className="px-4 sm:px-6 py-3 text-sm font-medium text-slate-400">Free</th>
                <th className="px-4 sm:px-6 py-3 text-sm font-medium text-violet-400">Pro</th>
                <th className="px-4 sm:px-6 py-3 text-sm font-medium text-slate-400">Business</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-slate-800/50">
                  <td className="px-4 sm:px-6 py-3 text-white text-sm">{row.feature}</td>
                  {(["free", "pro", "business"] as const).map((p) => (
                    <td key={p} className={`px-4 sm:px-6 py-3 text-sm ${p === planName ? "font-semibold" : ""}`}>
                      {typeof row[p] === "boolean" ? (
                        row[p] ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />
                      ) : (
                        <span className={p === planName ? "text-violet-400" : "text-slate-300"}>{row[p]}</span>
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
