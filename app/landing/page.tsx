import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { WidgetContainer } from "@/components/widget-container";
import { Palette, Zap, LayoutGrid, Shield, SlidersHorizontal, CreditCard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <!-- Header -->
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-violet-100/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                <Image 
                  src="/logo-icon.png" 
                  alt="Vissar" 
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Vissar</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
              <a href="#demo" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Demo</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/dashboard">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm">
                <Link href="/widget/new">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero -->
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-white to-purple-50/60" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100/80 rounded-full text-sm font-semibold text-violet-700 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                Now in beta — try it free
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                Google Reviews that{" "}
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  look native
                </span>
                {" "}to your site
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-xl">
                <span className="font-semibold text-violet-700">Reviews that belong.</span> Vissar auto-detects your website&apos;s design and renders reviews that blend in perfectly.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button size="lg" asChild className="bg-violet-600 hover:bg-violet-700 text-white text-base px-8 h-12 shadow-lg shadow-violet-500/25">
                  <Link href="/widget/new">Create Free Widget →</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base px-8 h-12 border-slate-300">
                  <Link href="#demo">See Demo</Link>
                </Button>
              </div>

              <p className="mt-6 text-sm text-slate-500">No credit card required • Free forever plan</p>
            </div>

            <div className="relative lg:pl-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10 border border-slate-200/60">
                <Image 
                  src="/hero-laptop-v2.png" 
                  alt="Vissar widget preview" 
                  width={600} 
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <!-- Demo Section -->
      <section id="demo" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-sm font-medium text-violet-300 mb-4">
              See It In Action
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Automatically matches your design
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              The widget reads your website&apos;s colors, fonts, and spacing — then renders reviews that look like they were built just for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-black/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider">Light Website</p>
              </div>
              <div className="p-6 min-h-[280px]">
                <WidgetContainer 
                  widgetId="demo-light" 
                  layout="carousel"
                  maxReviews={3}
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl shadow-xl shadow-black/20 overflow-hidden border border-slate-800">
              <div className="px-6 py-4 border-b border-slate-800">
                <p className="text-sm font-semibold text-violet-400 uppercase tracking-wider">Dark Website</p>
              </div>
              <div className="p-6 min-h-[280px]">
                <WidgetContainer 
                  widgetId="demo-dark" 
                  layout="grid"
                  maxReviews={4}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-100 rounded-full text-sm font-semibold text-violet-700 mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Why Vissar?</h2>
            <p className="text-lg text-slate-600">Everything you need to showcase reviews beautifully.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: 'Auto-Styled',
                description: 'Automatically matches your fonts, colors, and spacing. No configuration needed.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Under 30KB, zero dependencies. Loads instantly without slowing your site.',
              },
              {
                icon: LayoutGrid,
                title: 'Multiple Layouts',
                description: 'Carousel, grid, list, or floating badge. Choose what works best for your design.',
              },
              {
                icon: Shield,
                title: 'Privacy First',
                description: 'No cookies, no tracking. Just clean, fast review widgets.',
              },
              {
                icon: SlidersHorizontal,
                title: 'Deep Customization',
                description: 'Override any style when you need precise control. CSS custom properties supported.',
              },
              {
                icon: CreditCard,
                title: 'Affordable',
                description: 'Free tier available. Pro plans start at $8/month — premium quality, fair price.',
              },
            ].map((feature) => (
              <div key={feature.title} className="group p-6 rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 bg-white">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-violet-600 transition-colors">
                  <feature.icon className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/50 to-purple-900/50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
            Ready to make your reviews belong?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join hundreds of businesses displaying Google Reviews that actually match their brand.
          </p>
          <Button size="lg" asChild className="bg-white text-violet-700 hover:bg-slate-100 text-lg px-10 h-14 shadow-xl">
            <Link href="/widget/new">Create Your Free Widget →</Link>
          </Button>
        </div>
      </section>

      <!-- Footer -->
      <footer className="py-12 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-7 h-7 rounded-lg overflow-hidden">
                <Image 
                  src="/logo-icon.png" 
                  alt="Vissar" 
                  width={28} 
                  height={28}
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-white text-lg">Vissar</span>
              <span className="text-slate-500 hidden sm:inline">— Reviews that belong.</span>
            </div>
            <p className="text-slate-600 text-sm">© 2026 Vissar. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <script src="/widget/vissar-widget.min.js" async />
    </div>
  );
}
