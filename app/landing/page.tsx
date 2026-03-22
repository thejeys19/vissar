"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/checkout-button";
import Image from "next/image";
import { Star, Check, ArrowRight, Zap, Shield, LayoutGrid, Palette, SlidersHorizontal, Globe, Timer, Sparkles, Lock } from "lucide-react";
import LiveDemo from "@/components/live-demo";

const reviews = [
  { 
    name: "Emma Williams", 
    role: "Marketing Director", 
    company: "TechFlow", 
    rating: 5, 
    text: "Our conversion rate went up 23% after adding Vissar. The widget blends in so perfectly that customers think it's part of our site.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
  },
  { 
    name: "James Clark", 
    role: "Co-Founder", 
    company: "Launchpad Co.", 
    rating: 5, 
    text: "Setup took 2 minutes. The auto-styling is scary good — matched our brand colors without any tweaking.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
  },
  { 
    name: "Lena Rodriguez", 
    role: "Head of E-Commerce", 
    company: "Verdant Shop", 
    rating: 5, 
    text: "We tried 4 other review widgets. Vissar is the only one that actually looks native. The difference is night and day.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face"
  },
  { 
    name: "David Lee", 
    role: "Agency Owner", 
    company: "Pixel & Co.", 
    rating: 5, 
    text: "I use Vissar across all 12 of my clients' sites. The Business plan pays for itself with the first client.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face"
  },
];

const logos = [
  "Shopify", "Webflow", "WordPress", "Squarespace", "Wix", "Framer"
];

const features = [
  { icon: Palette, title: "Auto-Styled", description: "Detects your site's colors, fonts & spacing. Renders reviews that look custom-built — zero configuration." },
  { icon: Zap, title: "Lightning Fast", description: "Under 30KB, zero dependencies. Loads in milliseconds without adding bloat to your site." },
  { icon: LayoutGrid, title: "Multiple Layouts", description: "Carousel, grid, list, floating badge. Pick what fits your design — or let Vissar decide." },
  { icon: Shield, title: "Privacy First", description: "No cookies, no tracking pixels, no GDPR headaches. Clean, compliant by default." },
  { icon: SlidersHorizontal, title: "Full Control", description: "Override any style with CSS custom properties when you need pixel-perfect precision." },
  { icon: Globe, title: "Works Everywhere", description: "Any website, any framework. Paste one script tag and you're live." },
];

const plans = [
  {
    name: "Free",
    planId: null as null,
    price: "$0",
    period: "/month",
    description: "Try it out, no card needed",
    features: ["1 widget", "200 views/month", "3 templates", "Vissar branding"],
    cta: "Get Started Free",
    href: "/widget/new",
    highlight: false,
  },
  {
    name: "Pro",
    planId: "pro" as const,
    price: "$8",
    period: "/month",
    description: "The full Vissar experience",
    features: ["3 widgets", "10,000 views/month", "All 10+ templates", "Animations & effects", "No Vissar branding", "Priority support"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Business",
    planId: "business" as const,
    price: "$15",
    period: "/month",
    description: "For agencies & high-traffic sites",
    features: ["9 widgets", "50,000 views/month", "All templates", "Custom CSS", "No branding", "API access", "Priority support"],
    cta: "Start Free Trial",
    highlight: false,
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      document.cookie = `vissar_ref=${encodeURIComponent(ref)};path=/;max-age=${60 * 60 * 24 * 30};SameSite=Lax`;
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image src="/logo-icon.png" alt="Vissar" width={48} height={48} className="w-12 h-12 rounded-2xl" />
              <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">vissar</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
              <a href="#reviews" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Reviews</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5">
                Sign In
              </Link>
              <Button size="sm" asChild className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm">
                <Link href="/widget/new">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/40" />
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-full text-xs font-semibold text-violet-700 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                New layouts just dropped — Free to get started
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.08] mb-6">
                Google Reviews that{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 bg-clip-text text-transparent">
                    actually fit
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5.5C47.6667 2.16667 154.4 -1.4 199 5.5" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#7C3AED"/>
                        <stop offset="1" stopColor="#9333EA"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                {" "}your site
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                Vissar auto-detects your website&apos;s design — colors, fonts, spacing — and renders Google Reviews that look native. No styling headaches. No mismatched widgets.
              </p>

              {/* Social proof micro */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex -space-x-2">
                  {["E", "J", "L", "D", "M"].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <StarRating />
                  <p className="text-sm text-slate-500 mt-0.5">Trusted by <strong className="text-slate-700">500+</strong> businesses</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild className="bg-violet-600 hover:bg-violet-700 text-white text-base px-8 h-12 shadow-lg shadow-violet-500/20">
                  <Link href="/widget/new">
                    Create Free Widget
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base px-8 h-12 border-slate-300 text-slate-700 hover:bg-slate-50">
                  <a href="#demo">See Live Demo</a>
                </Button>
              </div>
              <p className="text-sm text-slate-400 mt-4">No credit card required • Free forever plan</p>
            </div>

            {/* Right — Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/15 border border-slate-200/60 ring-1 ring-slate-900/5">
                <Image
                  src="/hero-laptop-v2.png"
                  alt="Vissar Google Reviews widget in action"
                  width={680}
                  height={460}
                  className="w-full h-auto"
                  priority
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg shadow-slate-200 border border-slate-100 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Avg. Rating Displayed</p>
                  <p className="text-lg font-bold text-slate-900 leading-none">4.9 ★</p>
                </div>
              </div>
              {/* Floating badge 2 */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg shadow-slate-200 border border-slate-100 px-4 py-2">
                <p className="text-xs text-slate-500">Setup time</p>
                <p className="text-sm font-bold text-violet-700 flex items-center gap-1">
                  <Timer className="w-4 h-4" /> Under 2 mins
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo bar */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-400 mb-8 uppercase tracking-widest">Works on any platform</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((logo) => (
              <span key={logo} className="text-slate-400 font-semibold text-lg tracking-tight hover:text-slate-600 transition-colors cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-sm font-medium text-violet-300 mb-4">Live Demo</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">See it live. Right now.</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Toggle layouts and styles below — this is the actual Vissar widget running live.</p>
          </div>

          <LiveDemo />

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "Businesses Using Vissar" },
              { number: "2 min", label: "Average Setup Time" },
              { number: "23%", label: "Avg. Conversion Lift" },
              { number: "4.9★", label: "Average Rating Displayed" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                <p className="text-3xl font-bold text-white mb-1">{stat.number}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-100 rounded-full text-sm font-semibold text-violet-700 mb-4">Why Vissar</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Built for people who care about design</h2>
            <p className="text-lg text-slate-600">Not another ugly embed. Vissar is the review widget that designers actually approve.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="group p-7 rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 bg-white">
                <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-violet-600 transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Layouts Showcase */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-sm font-medium text-violet-300 mb-4">14 Layouts</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">14 layouts. One widget. Infinite possibilities.</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">From scrolling tickers to cinematic spotlights. Pick the layout that fits your vibe.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Marquee */}
            <Link href="/widget/new" className="group">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="bg-slate-800 rounded-xl p-4 mb-4 overflow-hidden h-24 flex items-center">
                  <div className="flex gap-3 animate-pulse">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex-shrink-0 bg-slate-700 rounded-lg px-4 py-2 flex items-center gap-2">
                        <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><div key={s} className="w-1.5 h-1.5 rounded-full bg-amber-400"/>)}</div>
                        <div className="h-2 w-12 bg-slate-600 rounded"/>
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="font-semibold text-white text-sm">Marquee</h3>
                <p className="text-xs text-slate-500">Auto-scrolling horizontal ticker</p>
              </div>
            </Link>

            {/* Masonry */}
            <Link href="/widget/new" className="group">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="bg-slate-800 rounded-xl p-3 mb-4 h-24" style={{columnCount: 2, columnGap: '8px'}}>
                  <div className="bg-slate-700 rounded-lg p-2 mb-2 break-inside-avoid"><div className="h-2 w-full bg-slate-600 rounded mb-1"/><div className="h-2 w-3/4 bg-slate-600 rounded"/></div>
                  <div className="bg-slate-700 rounded-lg p-2 mb-2 break-inside-avoid"><div className="h-2 w-full bg-slate-600 rounded mb-1"/><div className="h-2 w-full bg-slate-600 rounded mb-1"/><div className="h-2 w-1/2 bg-slate-600 rounded"/></div>
                  <div className="bg-slate-700 rounded-lg p-2 mb-2 break-inside-avoid"><div className="h-2 w-full bg-slate-600 rounded"/></div>
                </div>
                <h3 className="font-semibold text-white text-sm">Masonry</h3>
                <p className="text-xs text-slate-500">Pinterest-style staggered grid</p>
              </div>
            </Link>

            {/* Wall of Love */}
            <Link href="/widget/new" className="group">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="bg-slate-800 rounded-xl p-3 mb-4 h-24 grid grid-cols-4 gap-1.5">
                  {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="bg-slate-700 rounded p-1.5">
                      <div className="flex gap-0.5 mb-1">{[1,2,3].map(s=><div key={s} className="w-1 h-1 rounded-full bg-amber-400"/>)}</div>
                      <div className="h-1 w-full bg-slate-600 rounded"/>
                    </div>
                  ))}
                </div>
                <h3 className="font-semibold text-white text-sm">Wall of Love</h3>
                <p className="text-xs text-slate-500">Dense mosaic of compact reviews</p>
              </div>
            </Link>

            {/* Spotlight */}
            <Link href="/widget/new" className="group">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="bg-slate-800 rounded-xl p-4 mb-4 h-24 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl text-violet-400 font-serif leading-none mb-1">&ldquo;</span>
                  <div className="h-2 w-3/4 bg-slate-600 rounded mb-1.5"/>
                  <div className="h-2 w-1/2 bg-slate-600 rounded mb-2"/>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><div key={s} className="w-2 h-2 rounded-full bg-amber-400"/>)}</div>
                </div>
                <h3 className="font-semibold text-white text-sm">Spotlight</h3>
                <p className="text-xs text-slate-500">One cinematic featured review</p>
              </div>
            </Link>

            {/* Summary */}
            <Link href="/widget/new" className="group">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="bg-slate-800 rounded-xl p-4 mb-4 h-24 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-white">4.9</span>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><div key={s} className="w-2.5 h-2.5 rounded-full bg-amber-400"/>)}</div>
                  </div>
                  {[5,4,3].map(n => (
                    <div key={n} className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] text-slate-500 w-3">{n}</span>
                      <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{width: n===5?'80%':n===4?'14%':'4%'}}/></div>
                    </div>
                  ))}
                </div>
                <h3 className="font-semibold text-white text-sm">Summary</h3>
                <p className="text-xs text-slate-500">Aggregate rating overview card</p>
              </div>
            </Link>
          </div>

          {/* Why teams choose Vissar stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { Icon: Zap, text: "Under 30KB" },
              { Icon: Palette, text: "10 Templates + 14 Layouts" },
              { Icon: Sparkles, text: "Auto-matches your brand" },
              { Icon: Lock, text: "No cookies" },
            ].map((stat) => (
              <div key={stat.text} className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-800">
                <stat.Icon className="w-6 h-6 mx-auto mb-2 text-violet-400" />
                <p className="text-sm font-medium text-slate-300">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Showcase */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-sm font-medium text-violet-300 mb-4">Templates</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Choose your style</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">10 premium templates. 14 layouts. Each one adapts to your brand.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Soft Shadow */}
            <Link href="/widget/new" className="group">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="bg-white rounded-xl p-5 shadow-lg shadow-slate-200/50 mb-4">
                  <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(i=><div key={i} className="w-3 h-3 rounded-full bg-amber-400"/>)}</div>
                  <div className="h-2 w-3/4 bg-slate-200 rounded mb-1.5"/>
                  <div className="h-2 w-1/2 bg-slate-100 rounded"/>
                  <div className="flex items-center gap-2 mt-3"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-500"/><div className="h-2 w-16 bg-slate-200 rounded"/></div>
                </div>
                <h3 className="font-semibold text-white text-sm">Soft Shadow</h3>
                <p className="text-xs text-slate-500">Gentle, elevated cards</p>
              </div>
            </Link>

            {/* Glassmorphism */}
            <Link href="/widget/new" className="group">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="bg-gradient-to-br from-violet-500/10 to-blue-500/10 backdrop-blur rounded-xl p-5 border border-white/10 mb-4">
                  <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(i=><div key={i} className="w-3 h-3 rounded-full bg-amber-400"/>)}</div>
                  <div className="h-2 w-3/4 bg-white/20 rounded mb-1.5"/>
                  <div className="h-2 w-1/2 bg-white/10 rounded"/>
                  <div className="flex items-center gap-2 mt-3"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-blue-400"/><div className="h-2 w-16 bg-white/20 rounded"/></div>
                </div>
                <h3 className="font-semibold text-white text-sm">Glassmorphism</h3>
                <p className="text-xs text-slate-500">Frosted glass blur effect</p>
              </div>
            </Link>

            {/* Minimal */}
            <Link href="/widget/new" className="group">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="bg-white rounded-xl p-5 border-2 border-slate-200 mb-4">
                  <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(i=><div key={i} className="w-3 h-3 rounded-full bg-amber-400"/>)}</div>
                  <div className="h-2 w-3/4 bg-slate-200 rounded mb-1.5"/>
                  <div className="h-2 w-1/2 bg-slate-100 rounded"/>
                  <div className="flex items-center gap-2 mt-3"><div className="w-6 h-6 rounded-full bg-slate-300"/><div className="h-2 w-16 bg-slate-200 rounded"/></div>
                </div>
                <h3 className="font-semibold text-white text-sm">Minimal</h3>
                <p className="text-xs text-slate-500">Clean, borderline elegance</p>
              </div>
            </Link>

            {/* Dark Elegant */}
            <Link href="/widget/new" className="group">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-4">
                  <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(i=><div key={i} className="w-3 h-3 rounded-full bg-amber-400"/>)}</div>
                  <div className="h-2 w-3/4 bg-slate-600 rounded mb-1.5"/>
                  <div className="h-2 w-1/2 bg-slate-700 rounded"/>
                  <div className="flex items-center gap-2 mt-3"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600"/><div className="h-2 w-16 bg-slate-600 rounded"/></div>
                </div>
                <h3 className="font-semibold text-white text-sm">Dark Elegant</h3>
                <p className="text-xs text-slate-500">Sophisticated dark mode</p>
              </div>
            </Link>

            {/* Gradient Border */}
            <Link href="/widget/new" className="group">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="bg-white rounded-xl p-5 border-2 border-violet-500 mb-4">
                  <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(i=><div key={i} className="w-3 h-3 rounded-full bg-amber-400"/>)}</div>
                  <div className="h-2 w-3/4 bg-slate-200 rounded mb-1.5"/>
                  <div className="h-2 w-1/2 bg-violet-100 rounded"/>
                  <div className="flex items-center gap-2 mt-3"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600"/><div className="h-2 w-16 bg-violet-200 rounded"/></div>
                </div>
                <h3 className="font-semibold text-white text-sm">Gradient Border</h3>
                <p className="text-xs text-slate-500">Violet gradient edges</p>
              </div>
            </Link>

            {/* Neon */}
            <Link href="/widget/new" className="group">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="bg-slate-900 rounded-xl p-5 border border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.15)] mb-4">
                  <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(i=><div key={i} className="w-3 h-3 rounded-full bg-amber-400"/>)}</div>
                  <div className="h-2 w-3/4 bg-slate-700 rounded mb-1.5"/>
                  <div className="h-2 w-1/2 bg-slate-800 rounded"/>
                  <div className="flex items-center gap-2 mt-3"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500"/><div className="h-2 w-16 bg-slate-700 rounded"/></div>
                </div>
                <h3 className="font-semibold text-white text-sm">Neon</h3>
                <p className="text-xs text-slate-500">Glowing neon accents</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-100 rounded-full text-sm font-semibold text-violet-700 mb-4">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Businesses love Vissar</h2>
            <p className="text-lg text-slate-600">Don&apos;t take our word for it.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div key={review.name} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300">
                <StarRating count={review.rating} />
                <p className="text-slate-700 mt-4 mb-6 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.role}, {review.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-100 rounded-full text-sm font-semibold text-violet-700 mb-4">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Simple, honest pricing</h2>
            <p className="text-lg text-slate-600">Start free. Upgrade when you&apos;re ready. No surprises.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.highlight
                    ? "bg-violet-600 text-white shadow-2xl shadow-violet-500/25 scale-105"
                    : "bg-white border border-slate-200"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${plan.highlight ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                  <p className={`text-sm mb-4 ${plan.highlight ? "text-violet-200" : "text-slate-500"}`}>{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-slate-900"}`}>{plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? "text-violet-200" : "text-slate-500"}`}>{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-violet-200" : "text-violet-600"}`} />
                      <span className={plan.highlight ? "text-violet-100" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>

                {plan.planId ? (
                  <CheckoutButton
                    planId={plan.planId}
                    className={`w-full h-11 font-semibold ${
                      plan.highlight
                        ? "bg-white text-violet-700 hover:bg-violet-50"
                        : "bg-violet-600 text-white hover:bg-violet-700"
                    }`}
                  >
                    {plan.cta}
                  </CheckoutButton>
                ) : (
                  <Button
                    asChild
                    className={`w-full h-11 font-semibold ${
                      plan.highlight
                        ? "bg-white text-violet-700 hover:bg-violet-50"
                        : "bg-violet-600 text-white hover:bg-violet-700"
                    }`}
                  >
                    <Link href={plan.href!}>{plan.cta}</Link>
                  </Button>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 text-sm mt-8">All plans include a 14-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 md:p-14">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Integrations</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">Works on any platform</h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">Paste one script tag and you&apos;re live. No plugins, no build steps, no dependencies.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center">
              {/* Shopify */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <img src="/logos/shopify.jpg" alt="Shopify" className="w-10 h-10 object-contain rounded" />
                </div>
                <span className="text-sm font-medium text-slate-600">Shopify</span>
              </div>

              {/* Webflow */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <img src="/logos/webflow.jpg" alt="Webflow" className="w-9 h-9 object-contain rounded" />
                </div>
                <span className="text-sm font-medium text-slate-600">Webflow</span>
              </div>

              {/* WordPress */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <img src="/logos/wordpress.jpg" alt="WordPress" className="w-10 h-10 object-contain rounded" />
                </div>
                <span className="text-sm font-medium text-slate-600">WordPress</span>
              </div>

              {/* Wix */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <img src="/logos/wix.jpg" alt="Wix" className="w-12 h-6 object-contain" />
                </div>
                <span className="text-sm font-medium text-slate-600">Wix</span>
              </div>

              {/* Squarespace */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <img src="/logos/squarespace.jpg" alt="Squarespace" className="w-9 h-9 object-contain rounded" />
                </div>
                <span className="text-sm font-medium text-slate-600">Squarespace</span>
              </div>

              {/* Framer */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <img src="/logos/framer.jpg" alt="Framer" className="w-8 h-8 object-contain rounded" />
                </div>
                <span className="text-sm font-medium text-slate-600">Framer</span>
              </div>

              {/* Notion */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <img src="/logos/notion.jpg" alt="Notion" className="w-9 h-9 object-contain rounded" />
                </div>
                <span className="text-sm font-medium text-slate-600">Notion</span>
              </div>

              {/* Any site */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Globe className="w-8 h-8 text-slate-700" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-slate-600">Any site</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-slate-950 to-purple-950/60" />
          <Image src="/abstract-stars.png" alt="" fill className="object-cover opacity-20" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
            Your reviews deserve<br />a better home.
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join 500+ businesses showing Google Reviews that look like they were made for their site — not copy-pasted from the web.
          </p>
          <Button size="lg" asChild className="bg-white text-violet-700 hover:bg-slate-100 text-lg px-12 h-14 shadow-2xl font-bold">
            <Link href="/widget/new">
              Create Your Free Widget
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-slate-500 text-sm mt-4">Free forever plan • Setup in 2 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logo-icon.png" alt="Vissar" width={40} height={40} className="w-10 h-10 rounded-xl" />
              <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">vissar</span>
              <span className="text-slate-600 hidden sm:inline">— Reviews that belong.</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#features" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Pricing</a>
              <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Sign In</Link>
            </nav>
            <p className="text-slate-600 text-sm">© 2026 Vissar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
