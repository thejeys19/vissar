import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for trying out Vissar",
    icon: Zap,
    features: [
      "1 widget",
      "200 views/month",
      "3 basic templates",
      "Vissar branding",
      "Email support",
    ],
    cta: "Get Started",
    href: "/widget/new",
    popular: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    description: "For growing businesses",
    icon: Crown,
    features: [
      "Unlimited widgets",
      "10,000 views/month",
      "All 10+ templates",
      "No Vissar branding",
      "Priority support",
      "Custom CSS",
    ],
    cta: "Upgrade to Pro",
    href: "/api/checkout?plan=pro",
    popular: false,
  },
  {
    name: "Lifetime",
    price: "$50",
    period: "",
    description: "Grand Opening Special",
    badge: "WAS $399",
    icon: Sparkles,
    features: [
      "Unlimited widgets",
      "Unlimited views",
      "All templates + future",
      "No Vissar branding",
      "Priority support",
      "Custom CSS",
      "Lifetime updates",
      "Max 10 locations",
    ],
    cta: "Get Lifetime Access",
    href: "/api/checkout?plan=lifetime",
    popular: true,
    limited: "Only 200 spots",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-white">Vissar</span>
          </Link>
          <Button variant="outline" asChild className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Grand Opening Special
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Start free, upgrade when you need more. Lock in lifetime access during our grand opening.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-b from-violet-600/20 to-purple-600/20 border-2 border-violet-500"
                  : "bg-slate-900/50 border border-slate-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className="text-slate-500 line-through text-sm">{plan.badge}</span>
                </div>
              )}

              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
                  <plan.icon className={`w-6 h-6 ${plan.popular ? "text-violet-400" : "text-slate-400"}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-300">
                    <Check className={`w-5 h-5 ${plan.popular ? "text-violet-400" : "text-emerald-400"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full ${
                  plan.popular
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

              {plan.limited && (
                <p className="text-center text-sm text-violet-400 mt-4">{plan.limited}</p>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                q: "What happens when I hit the view limit?",
                a: "On the free plan, your widget will gracefully disappear (become invisible) until your usage resets next month. Upgrade to keep it showing.",
              },
              {
                q: "Can I change plans later?",
                a: "Yes! You can upgrade or downgrade at any time. If you downgrade, you'll keep Pro features until the end of your billing period.",
              },
              {
                q: "What's included in Lifetime?",
                a: "Everything we ever build, forever. All future templates, features, and updates. Limited to 10 business locations.",
              },
              {
                q: "Do I need a credit card for the free plan?",
                a: "Nope! The free plan is completely free, no credit card required.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
