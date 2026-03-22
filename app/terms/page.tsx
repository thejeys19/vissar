import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Vissar",
  description: "Vissar Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-violet-600 hover:text-violet-700 text-sm mb-8 inline-block">← Back to Vissar</Link>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-12">Last updated: March 2026</p>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-600 mb-4">
            By accessing or using Vissar (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Description of Service</h2>
          <p className="text-slate-600 mb-4">
            Vissar provides embeddable Google Reviews widgets for websites. We offer free and paid tiers with different features and usage limits.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. User Accounts</h2>
          <p className="text-slate-600 mb-4">
            You must sign in with a Google account to use the dashboard. You are responsible for maintaining the security of your account and for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Acceptable Use</h2>
          <p className="text-slate-600 mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to circumvent usage limits</li>
            <li>Use the Service to display false or misleading reviews</li>
            <li>Interfere with or disrupt the Service</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">5. Payment and Plans</h2>
          <p className="text-slate-600 mb-4">
            Free plans are available without payment. Paid plans are billed monthly via Stripe. You may cancel at any time. Refunds are not provided for partial months.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">6. Intellectual Property</h2>
          <p className="text-slate-600 mb-4">
            The Vissar platform, including its code, design, and branding, is our property. Reviews displayed are the property of their respective authors via Google.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">7. Disclaimer of Warranties</h2>
          <p className="text-slate-600 mb-4">
            The Service is provided &ldquo;as is&rdquo; without warranty of any kind. We do not guarantee that the Service will be uninterrupted or error-free.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">8. Limitation of Liability</h2>
          <p className="text-slate-600 mb-4">
            To the fullest extent permitted by law, Vissar shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">9. Changes to Terms</h2>
          <p className="text-slate-600 mb-4">
            We may update these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">10. Contact</h2>
          <p className="text-slate-600 mb-4">
            Questions about these terms? Contact us at support@vissar.com
          </p>
        </div>
      </div>
    </div>
  );
}
