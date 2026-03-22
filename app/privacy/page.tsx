import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Vissar",
  description: "Vissar Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-violet-600 hover:text-violet-700 text-sm mb-8 inline-block">← Back to Vissar</Link>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-12">Last updated: March 2026</p>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-slate-600 mb-4">When you use Vissar, we collect:</p>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
            <li><strong>Account information:</strong> Your name and email address via Google OAuth</li>
            <li><strong>Widget configuration:</strong> Settings you create for your review widgets</li>
            <li><strong>Usage data:</strong> View and click counts for your widgets (aggregate, non-personal)</li>
            <li><strong>Payment information:</strong> Handled entirely by Stripe — we do not store card details</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-600 mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
            <li>Provide and maintain the Service</li>
            <li>Process your payments via Stripe</li>
            <li>Enforce plan limits</li>
            <li>Improve the Service</li>
            <li>Send service-related communications (if applicable)</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Third-Party Services</h2>
          <p className="text-slate-600 mb-4">We use the following third-party services:</p>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
            <li><strong>Google:</strong> OAuth authentication and Google Places/Reviews API</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Vercel:</strong> Hosting and edge functions</li>
            <li><strong>Upstash Redis:</strong> Data storage</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Data Storage</h2>
          <p className="text-slate-600 mb-4">
            Your data is stored in Upstash Redis, hosted in secure cloud infrastructure. We store only what is necessary to provide the Service.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">5. Cookies and Local Storage</h2>
          <p className="text-slate-600 mb-4">
            The Vissar embed widget uses browser localStorage to track view counts for plan enforcement. This data stays in the visitor&apos;s browser and is not sent to our servers. We use session cookies for authentication.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">6. Data Sharing</h2>
          <p className="text-slate-600 mb-4">
            We do not sell your personal data. We share data only with the third-party services listed above as necessary to provide the Service.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">7. Your Rights</h2>
          <p className="text-slate-600 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Delete your account and associated data</li>
            <li>Export your widget configurations</li>
          </ul>
          <p className="text-slate-600 mb-4">
            To exercise these rights, contact us at support@vissar.com
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">8. Data Retention</h2>
          <p className="text-slate-600 mb-4">
            We retain your data for as long as your account is active. You may delete your account at any time from the Settings page.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">9. Changes to This Policy</h2>
          <p className="text-slate-600 mb-4">
            We may update this policy. We will notify you of significant changes by email or via the dashboard.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">10. Contact</h2>
          <p className="text-slate-600 mb-4">
            Questions about privacy? Contact us at support@vissar.com
          </p>
        </div>
      </div>
    </div>
  );
}
