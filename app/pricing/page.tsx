import Link from "next/link";
import Image from "next/image";
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
      "Community support",
    ],
    cta: "Get Started Free",
    href: "/widget/new",
    popular: false,
  },
  {
    name: "Pro",
    price: "$8",
    period: "/month",
    description: "Premium design for growing businesses",
    icon: Crown,
    features: [
      "3 widgets",
      "10,000 views/month",
      "All 10+ premium templates",
      "Animations & effects",
      "No Vissar branding",
      "Priority email support",
    ],
    cta: "Start Pro Trial",
    href: "/widget/new",
    popular: true,
  },
  {
    name: "Business",
    price: "$15",
    period: "/month",
    description: "For agencies & high-traffic sites",
    icon: Sparkles,
    features: [
      "9 widgets",
      "50,000 views/month",
      "All templates + future",
      "Custom CSS",
      "No branding",
      "Priority support",
      "API access",
    ],
    cta: "Start Business Trial",
    href: "/widget/new",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="Vissar" width={40} height={40} className="w-10 h-10 rounded-lg" />
            <span className="font-bold text-xl text-slate-900">vissar</span>
          </Link>
          <Button variant="outline" size="sm" asChild className="border-slate-300">
            <Link href="/landing">← Back to Home</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Start free, upgrade when you need more. Premium design without the premium price.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-white border-2 border-violet-600 shadow-xl shadow-violet-500/10"
                  : "bg-white border border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-violet-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
                  <plan.icon className={`w-6 h-6 ${plan.popular ? "text-violet-600" : "text-slate-600"}`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-600">
                    <Check className={`w-5 h-5 ${plan.popular ? "text-violet-600" : "text-emerald-500"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full ${
                  plan.popular
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Grand Opening Banner */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Grand Opening Special — Limited Time
            </div>
            <h3 className="text-2xl font-bold mb-2">Lifetime Access — $75</h3>
            <p className="text-violet-100 mb-6">
              One-time payment. 3 widgets, 10K views/month forever. 
              Only 200 spots available.
            </p>
            <Button asChild className="bg-white text-violet-700 hover:bg-slate-100">
              <Link href="/widget/new">Get Lifetime Access →</Link>
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                q: "What happens when I hit the view limit?",
                a: "On the free plan, your widget will gracefully disappear (become invisible) until your usage resets next month. Upgrade to keep it showing.",
              },
              {
                q: "Can I change plans later?",
                a: "Yes! You can upgrade or downgrade at any time. If you downgrade, you'll keep your current plan until the end of your billing period.",
              },
              {
                q: "What's included in Lifetime?",
                a: "Everything in Pro, forever. 3 widgets, 10K views/month, all templates, no branding. Limited to 200 customers only.",
              },
              {
                q: "Do I need a credit card for the free plan?",
                a: "Nope! The free plan is completely free, no credit card required.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">© 2026 Vissar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
