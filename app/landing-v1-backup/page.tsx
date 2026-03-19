import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-900">Vissar</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-slate-600 hover:text-slate-900">Features</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900">Pricing</a>
            <a href="#demo" className="text-slate-600 hover:text-slate-900">Demo</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/widget/new">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Now in beta — try it free
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Google Reviews that look
            <br />
            <span className="text-blue-600">native to your site</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Vissar auto-detects your website&apos;s design and renders reviews that blend in perfectly. 
            No more foreign-looking widgets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/widget/new">Create Free Widget →</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="#demo">See Demo</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-slate-500">No credit card required • Free forever plan</p>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">See it in action</h2>
            <p className="text-lg text-slate-600">The widget automatically matches your website&apos;s colors, fonts, and styling.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Light Theme Demo */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-wide">Light Website</p>
              <div 
                data-vissar-widget="demo-light" 
                data-vissar-layout="carousel"
                data-vissar-max-reviews="3"
              />
            </div>

            {/* Dark Theme Demo */}
            <div className="bg-slate-900 p-8 rounded-2xl shadow-sm">
              <p className="text-sm font-medium text-slate-400 mb-6 uppercase tracking-wide">Dark Website</p>
              <div 
                data-vissar-widget="demo-dark" 
                data-vissar-layout="grid"
                data-vissar-max-reviews="4"
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Vissar?</h2>
            <p className="text-lg text-slate-600">Everything you need to showcase reviews beautifully.</p>
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
              <div key={feature.title} className="p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple Pricing</h2>
            <p className="text-lg text-slate-600">Start free, upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-lg text-slate-900">Free</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Up to 3 widgets',
                  'All layouts included',
                  'Auto-style detection',
                  'Up to 50 reviews/month',
                  'Vissar branding',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/widget/new">Get Started</Link>
              </Button>
            </div>

            {/* Pro */}
            <div className="bg-blue-600 p-8 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500 text-xs font-semibold rounded-full">
                Popular
              </div>

              <h3 className="font-semibold text-lg">Pro</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">$5</span>
                <span className="text-blue-200">/month</span>
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
                    <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50" asChild>
                <Link href="/widget/new">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="font-bold text-slate-900">Vissar</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 Vissar. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <script src="/widget/vissar-widget.min.js" async />
    </div>
  );
}
