import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API Reference — Vissar",
  description: "Vissar REST API documentation for developers.",
};

function Code({ children }: { children: string }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-slate-800 text-violet-300 text-xs font-mono">{children}</code>
  );
}

function Method({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-500/20 text-emerald-400",
    POST: "bg-blue-500/20 text-blue-400",
    DELETE: "bg-red-500/20 text-red-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${colors[method] || "bg-slate-700 text-slate-300"}`}>
      {method}
    </span>
  );
}

const endpoints = [
  {
    method: "GET",
    path: "/api/widget",
    desc: "List all widgets for the authenticated user.",
    auth: true,
    response: `[
  {
    "id": "widget_1234567890",
    "name": "My Business Reviews",
    "layout": "carousel",
    "template": "soft",
    "maxReviews": 5,
    "minRating": 4,
    "placeId": "ChIJ...",
    "createdAt": "2026-03-22T12:00:00Z"
  }
]`,
  },
  {
    method: "POST",
    path: "/api/widget",
    desc: "Create or update a widget. If `id` is included, it updates the existing widget.",
    auth: true,
    body: `{
  "name": "My Business Reviews",
  "layout": "carousel",
  "template": "soft",
  "maxReviews": 5,
  "minRating": 4,
  "placeId": "ChIJ..."
}`,
    response: `{
  "id": "widget_1234567890",
  "name": "My Business Reviews",
  ...
}`,
  },
  {
    method: "GET",
    path: "/api/widget/:id",
    desc: "Get a single widget by ID.",
    auth: true,
    response: `{
  "id": "widget_1234567890",
  "name": "My Business Reviews",
  "layout": "carousel",
  ...
}`,
  },
  {
    method: "DELETE",
    path: "/api/widget/:id",
    desc: "Delete a widget by ID.",
    auth: true,
    response: `{ "success": true }`,
  },
  {
    method: "GET",
    path: "/api/widget/:id/reviews",
    desc: "Fetch reviews for a widget. Returns real Google reviews if the widget has a Place ID configured. Used by the embed script.",
    auth: false,
    params: [
      { name: "maxReviews", desc: "Override max reviews to return (default: from widget config)" },
      { name: "minRating", desc: "Override minimum rating filter (default: from widget config)" },
    ],
    response: `{
  "widget": { "id": "...", "layout": "carousel" },
  "business": {
    "name": "My Business",
    "rating": 4.8,
    "totalReviews": 142
  },
  "reviews": [
    {
      "id": "review_abc",
      "author": "Jane Smith",
      "rating": 5,
      "text": "Excellent service!",
      "date": "2026-03-10",
      "relativeTime": "2 weeks ago"
    }
  ],
  "source": "google",
  "cached": true
}`,
  },
  {
    method: "GET",
    path: "/api/reviews",
    desc: "Fetch reviews directly by Google Place ID. No widget config needed.",
    auth: false,
    params: [
      { name: "placeId", desc: "Google Place ID (use 'mock' for demo data)" },
      { name: "maxReviews", desc: "Max reviews to return (default: 5)" },
      { name: "minRating", desc: "Minimum star rating (default: 1)" },
    ],
    response: `{
  "business": { "name": "...", "rating": 4.8 },
  "reviews": [...],
  "source": "google"
}`,
  },
  {
    method: "GET",
    path: "/api/places/search",
    desc: "Search for a Google Place by name or address. Returns Place IDs.",
    auth: false,
    params: [
      { name: "q", desc: "Search query (business name or address)" },
    ],
    response: `[
  {
    "placeId": "ChIJ...",
    "name": "My Business",
    "address": "123 Main St, City, ST 12345"
  }
]`,
  },
  {
    method: "POST",
    path: "/api/track",
    desc: "Track a view or click event for a widget. Called automatically by the embed script.",
    auth: false,
    body: `{
  "widgetId": "widget_1234567890",
  "event": "view"  // or "click"
}`,
    response: `{ "ok": true }`,
  },
  {
    method: "GET",
    path: "/api/analytics",
    desc: "Get analytics data for all your widgets (last 7 days).",
    auth: true,
    response: `{
  "totalViews": 1243,
  "totalClicks": 87,
  "daily": [
    { "date": "Mon", "views": 140, "clicks": 10 },
    ...
  ],
  "widgets": [
    { "id": "widget_...", "name": "...", "views": 450, "clicks": 30, "ctr": 6.7 }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/user/plan",
    desc: "Get the current user's plan and view usage.",
    auth: true,
    response: `{
  "plan": "pro",
  "views": 3210,
  "limit": 10000
}`,
  },
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm mb-6 inline-flex items-center gap-1">
            ← Back to Vissar
          </Link>
          <h1 className="text-4xl font-bold text-white mt-4">API Reference</h1>
          <p className="text-slate-400 mt-2 text-lg">REST API for Vissar Review Widgets</p>
        </div>

        {/* Base URL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
          <p className="text-sm text-slate-400 mb-2 font-medium">Base URL</p>
          <code className="text-violet-300 font-mono text-sm">https://www.vissar.com</code>
        </div>

        {/* Authentication */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-sm text-slate-400">
            <p>
              Endpoints marked with <span className="text-amber-400 font-medium">🔒 Auth Required</span> require a valid session cookie (set automatically when signed in via the dashboard).
            </p>
            <p>
              For server-side API access, use the <strong className="text-white">API Key</strong> from your{" "}
              <Link href="/dashboard/settings" className="text-violet-400 hover:underline">Settings page</Link>:
            </p>
            <pre className="bg-slate-800 p-3 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto">
              {`Authorization: Bearer vissar_sk_xxxxxxxxxxxxxxxxxxxxx`}
            </pre>
            <p className="text-xs text-slate-500">API key access is available on the Business plan.</p>
          </div>
        </section>

        {/* CORS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">CORS</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-400">
            <p>
              The <Code>/api/reviews</Code>, <Code>/api/widget/:id/reviews</Code>, <Code>/api/places/search</Code>, and <Code>/api/track</Code> endpoints have{" "}
              <strong className="text-white">open CORS</strong> (<Code>Access-Control-Allow-Origin: *</Code>)
              so the embed widget can call them from any domain.
            </p>
          </div>
        </section>

        {/* Endpoints */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Endpoints</h2>
          <div className="space-y-6">
            {endpoints.map((ep, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {/* Endpoint header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
                  <Method method={ep.method} />
                  <code className="text-white font-mono text-sm">{ep.path}</code>
                  {ep.auth && (
                    <span className="ml-auto text-xs text-amber-400 font-medium">🔒 Auth Required</span>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-slate-400 text-sm">{ep.desc}</p>

                  {ep.params && ep.params.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Query Parameters</p>
                      <div className="space-y-1.5">
                        {ep.params.map((param) => (
                          <div key={param.name} className="flex gap-3 text-sm">
                            <Code>{param.name}</Code>
                            <span className="text-slate-500">{param.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {ep.body && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Request Body</p>
                      <pre className="bg-slate-800 p-3 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto">
                        {ep.body}
                      </pre>
                    </div>
                  )}

                  {ep.response && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Response</p>
                      <pre className="bg-slate-800 p-3 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto">
                        {ep.response}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Widget Embed Reference */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Widget Embed Reference</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <p className="text-sm text-slate-400">Configure the widget via <Code>data-vissar-*</Code> attributes on the container div:</p>
            <pre className="bg-slate-800 p-4 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
{`<div
  data-vissar-widget="widget_YOUR_ID"
  data-vissar-layout="carousel"        <!-- carousel|grid|list|badge|marquee|masonry|wall|spotlight|summary|popup|quote -->
  data-vissar-template="soft"          <!-- soft|glass|minimal|darkElegant|gradientBorder|neon|aurora|spotlight|classic|warm -->
  data-vissar-max-reviews="5"
  data-vissar-min-rating="4"           <!-- 1-5 -->
  data-vissar-place-id="ChIJ..."       <!-- optional: overrides widget config -->
  data-vissar-animations="true"
  data-vissar-animation-style="slideUp" <!-- none|fadeIn|slideUp|scaleIn -->
  data-vissar-color-scheme="auto"      <!-- auto|light|dark -->
  data-vissar-primary-color="#7C3AED"
  data-vissar-star-color="#F59E0B"
  data-vissar-sort-by="newest"         <!-- newest|highest|lowest|longest -->
  data-vissar-text-length="150"
  data-vissar-show-header="false"
  data-vissar-show-avatar="true"
  data-vissar-show-date="true"
  data-vissar-show-verified-badge="true"
  data-vissar-remove-branding="true"   <!-- Pro+ only -->
  data-vissar-schema="true"            <!-- inject JSON-LD for Google SERP stars -->
  data-vissar-language="en"            <!-- all|en|fr|es|de|ja -->
  data-vissar-date-range="all"         <!-- all|year|6months|month|week -->
  data-vissar-keywords="great,fast"    <!-- comma-separated: show reviews with these words -->
  data-vissar-blacklist="id1,id2"      <!-- comma-separated review IDs to hide -->
  data-vissar-gdpr="true"              <!-- anonymize names + hide avatars -->
  data-vissar-custom-css=".vissar-card { border-radius: 0; }" <!-- Business only -->
></div>
<script src="https://www.vissar.com/widget/vissar-widget.min.js" async></script>`}
            </pre>
          </div>
        </section>

        <div className="mt-10 p-5 bg-violet-600/10 border border-violet-500/20 rounded-xl">
          <p className="text-sm text-slate-400">
            Need help? Email us at <a href="mailto:support@vissar.com" className="text-violet-400 hover:underline">support@vissar.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
