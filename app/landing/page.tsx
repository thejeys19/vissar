import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { WidgetContainer } from "@/components/widget-container";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="border-b border-violet-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo-icon.png" 
              alt="Vissar" 
              width={32} 
              height={32} 
              className="rounded-lg"
            />
            <span className="font-bold text-xl text-vissar-night">Vissar</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-violet-700 hover:text-vissar-night transition-colors">Features</a>
            <a href="#pricing" className="text-violet-700 hover:text-vissar-night transition-colors">Pricing</a>
            <a href="#demo" className="text-violet-700 hover:text-vissar-night transition-colors">Demo</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-violet-700 hover:text-vissar-night">
              <Link href="/">Dashboard</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-violet-700 to-purple-500 hover:from-violet-800 hover:to-purple-600 text-white">
              <Link href="/widget/new">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50 -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-violet-100/50 to-transparent -z-10" />
        
        <div className="py-20 md:py-32 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                Now in beta — try it free
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-vissar-night mb-6 leading-tight">
                Google Reviews that{" "}
                <span className="bg-gradient-to-r from-violet-700 to-purple-500 bg-clip-text text-transparent">
                  look native
                </span>
                <br />
                to your site
              </h1>

              <p className="text-xl text-violet-800/80 max-w-xl mb-8 leading-relaxed">
                <span className="font-semibold text-violet-700">Reviews that belong.</span> Vissar auto-detects your website&apos;s design system and renders reviews that blend in perfectly. No more foreign-looking widgets.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button size="lg" asChild className="bg-gradient-to-r from-violet-700 to-purple-500 hover:from-violet-800 hover:to-purple-600 text-white text-lg px-8 shadow-lg shadow-violet-500/25">
                  <Link href="/widget/new">Create Free Widget →</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 border-violet-300 text-violet-700 hover:bg-violet-50">
                  <Link href="#demo">See Demo</Link>
                </Button>
              </div>

              <p className="mt-6 text-sm text-violet-600/70">No credit card required • Free forever plan</p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-violet-500/10 overflow-hidden border border-violet-100">
                <Image 
                  src="/hero-laptop-v2.png" 
                  alt="Vissar widget preview" 
                  width={600} 
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-night relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm font-medium mb-4">
              See It In Action
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Automatically matches your design
            </h2>
            <p className="text-lg text-violet-200/80 max-w-2xl mx-auto">
              The widget reads your website&apos;s colors, fonts, and spacing — then renders reviews that look like they were built just for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Light Theme Demo */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-black/20">
              <p className="text-sm font-semibold text-violet-600 mb-6 uppercase tracking-wide">Light Website</p>
              <WidgetContainer 
                widgetId="demo-light" 
                layout="carousel"
                maxReviews={3}
              />
            </div>

            {/* Dark Theme Demo */}
            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl shadow-black/20">
              <p className="text-sm font-semibold text-violet-400 mb-6 uppercase tracking-wide">Dark Website</p>
              <WidgetContainer 
                widgetId="demo-dark" 
                layout="grid"
                maxReviews={4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-vissar-night mb-4">Why Vissar?</h2>
            <p className="text-lg text-violet-800/70">Everything you need to showcase reviews beautifully.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                title: 'Auto-Styled',
                description: 'Automatically matches your fonts, colors, and spacing. No configuration needed.',
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Under 30KB, zero dependencies. Loads instantly without slowing your site.',
              },
              {
                icon: '📱',
                title: 'Multiple Layouts',
                description: 'Carousel, grid, list, or floating badge. Choose what works best for your design.',
              },
              {
                icon: '🔒',
                title: 'Privacy First',
                description: 'No cookies, no tracking. Just clean, fast review widgets.',
              },
              {
                icon: '🎛️',
                title: 'Deep Customization',
                description: 'Override any style when you need precise control. CSS custom properties supported.',
              },
              {
                icon: '💰',
                title: 'Affordable',
                description: 'Free tier available. Pro plans start at $5/month — half the price of competitors.',
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-2xl border border-violet-100 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 bg-white">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg text-vissar-night mb-2">{feature.title}</h3>
                <p className="text-violet-800/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand imagery section */}
      <section className="py-20 bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/lifestyle-desk.png" alt="Work desk" width={300} height={200} className="w-full h-auto object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/lifestyle-phone-v2.png" alt="Phone mockup" width={300} height={200} className="w-full h-auto object-cover" />
                  </div>
                </div>
                <div className="pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/lifestyle-team.png" alt="Team" width={300} height={400} className="w-full h-auto object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4">
                For Every Business
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-vissar-night mb-6">
                Trusted by shops, salons, clinics, and startups
              </h2>
              <p className="text-lg text-violet-800/70 mb-6 leading-relaxed">
                Whether you&apos;re a local business collecting Google Reviews or a SaaS startup building trust, Vissar makes it easy to display social proof that actually looks like it belongs on your site.
              </p>
              <ul className="space-y-3">
                {['E-commerce stores', 'Service businesses', 'Healthcare providers', 'SaaS companies'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-violet-800">
                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-violet-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-violet-200 text-violet-800 rounded-full text-sm font-medium mb-4">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-vissar-night mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-violet-800/70">Start free, upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-white p-8 rounded-2xl border border-violet-200 shadow-lg shadow-violet-500/5">
              <h3 className="font-bold text-lg text-vissar-night">Free</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-vissar-night">$0</span>
                <span className="text-violet-600/70">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Up to 3 widgets',
                  'All layouts included',
                  'Auto-style detection',
                  'Up to 50 reviews/month',
                  'Vissar branding',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-violet-800">
                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="w-full border-violet-300 text-violet-700 hover:bg-violet-50" asChild>
                <Link href="/widget/new">Get Started</Link>
              </Button>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-violet-700 to-purple-600 p-8 rounded-2xl text-white relative overflow-hidden shadow-xl shadow-violet-500/25">
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 text-xs font-semibold rounded-full">
                Popular
              </div>

              <h3 className="font-bold text-lg">Pro</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">$5</span>
                <span className="text-violet-200">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited widgets',
                  'All layouts + custom CSS',
                  'Unlimited reviews',
                  'No Vissar branding',
                  'Priority support',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-white text-violet-700 hover:bg-violet-50 font-semibold" asChild>
                <Link href="/widget/new">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-night relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/50 to-purple-900/50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to make your reviews belong?
          </h2>
          <p className="text-xl text-violet-200 mb-10 max-w-2xl mx-auto">
            Join hundreds of businesses displaying Google Reviews that actually match their brand.
          </p>
          <Button size="lg" asChild className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white text-lg px-10 shadow-lg shadow-violet-500/25">
            <Link href="/widget/new">Create Your Free Widget →</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-night border-t border-violet-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo-icon.png" 
                alt="Vissar" 
                width={28} 
                height={28} 
                className="rounded-lg"
              />
              <span className="font-bold text-white text-lg">Vissar</span>
              <span className="text-violet-400 hidden sm:inline">— Reviews that belong.</span>
            </div>
            <p className="text-violet-500 text-sm">© 2026 Vissar. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <script src="/widget/vissar-widget.min.js" defer />
      <script dangerouslySetInnerHTML={{__html: `
        // Re-initialize widgets after hydration
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            if (window.VissarWidget) {
              document.querySelectorAll('[data-vissar-widget]:not([data-vissar-initialized])').forEach(container => {
                const widget = new window.VissarWidget(container, {
                  widgetId: container.dataset.vissarWidget,
                  layout: container.dataset.vissarLayout || 'carousel',
                  maxReviews: parseInt(container.dataset.vissarMaxReviews, 10) || 5,
                  autoStyle: true
                });
                widget.init();
              });
            }
          }, 100);
        }
      `}} />
    </div>
  );
}
