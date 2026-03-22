"use client";

import { useState } from "react";
import { Download, Copy, Check, Code, Globe } from "lucide-react";

type Tab = "wordpress" | "webflow" | "shopify" | "any";

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("wordpress");
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const embedSnippet = `<div data-vissar-widget="YOUR_WIDGET_ID" data-vissar-layout="carousel" data-vissar-max-reviews="5"></div>
<script src="https://www.vissar.com/widget/vissar-widget.min.js" async></script>`;

  const tabs: { key: Tab; label: string }[] = [
    { key: "wordpress", label: "WordPress" },
    { key: "webflow", label: "Webflow" },
    { key: "shopify", label: "Shopify" },
    { key: "any", label: "Any Site" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Integrations</h1>
        <p className="text-slate-400 mt-1">Add Vissar to any platform in minutes</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-violet-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* WordPress */}
      {activeTab === "wordpress" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Code className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">WordPress Plugin</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Download the Vissar WordPress plugin and install it on your site.
          </p>

          <a
            href="/downloads/vissar-wordpress-plugin.php"
            download
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Plugin
          </a>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="text-white font-medium text-sm">Installation</h3>
            <ol className="space-y-2 text-slate-400 text-sm list-decimal list-inside">
              <li>Download the <code className="text-violet-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">vissar-wordpress-plugin.php</code> file</li>
              <li>Go to your WordPress admin &rarr; Plugins &rarr; Add New &rarr; Upload Plugin</li>
              <li>Upload the file and click &quot;Install Now&quot;</li>
              <li>Activate the plugin</li>
              <li>
                Use the shortcode in any post or page:{" "}
                <code className="text-violet-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">
                  [vissar id=&quot;widget_xxx&quot; layout=&quot;carousel&quot; max_reviews=&quot;5&quot;]
                </code>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Webflow */}
      {activeTab === "webflow" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Webflow</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Add Vissar to your Webflow site using a custom embed block.
          </p>
          <ol className="space-y-2 text-slate-400 text-sm list-decimal list-inside">
            <li>Open your Webflow project and navigate to the page where you want the widget</li>
            <li>Add an <strong className="text-white">Embed</strong> element from the Add panel</li>
            <li>Paste the embed code below into the embed element</li>
            <li>Publish your site</li>
          </ol>
          <div className="relative">
            <pre className="p-4 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
              {embedSnippet}
            </pre>
            <button
              onClick={() => copyText(embedSnippet, "webflow")}
              className="absolute top-3 right-3 px-2.5 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors"
            >
              {copied === "webflow" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Shopify */}
      {activeTab === "shopify" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Shopify</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Add Vissar to your Shopify store by editing your theme.
          </p>
          <ol className="space-y-2 text-slate-400 text-sm list-decimal list-inside">
            <li>Go to your Shopify admin &rarr; Online Store &rarr; Themes</li>
            <li>Click <strong className="text-white">Actions</strong> &rarr; <strong className="text-white">Edit code</strong></li>
            <li>Open <code className="text-violet-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">theme.liquid</code></li>
            <li>
              Paste the following code just before the closing{" "}
              <code className="text-violet-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag
            </li>
            <li>Save and preview your store</li>
          </ol>
          <div className="relative">
            <pre className="p-4 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
              {embedSnippet}
            </pre>
            <button
              onClick={() => copyText(embedSnippet, "shopify")}
              className="absolute top-3 right-3 px-2.5 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors"
            >
              {copied === "shopify" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* API Docs link */}
      <div className="bg-violet-600/10 border border-violet-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">Full API Reference</p>
          <p className="text-xs text-slate-400 mt-0.5">Explore all endpoints, widget attributes, and SDK options</p>
        </div>
        <a href="/docs/api" className="shrink-0 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors">
          View Docs →
        </a>
      </div>

      {/* Any Site */}
      {activeTab === "any" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Code className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Any Website</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Add Vissar to any website by pasting these two lines of code wherever you want the widget to appear.
          </p>
          <div className="relative">
            <pre className="p-4 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
              {embedSnippet}
            </pre>
            <button
              onClick={() => copyText(embedSnippet, "any")}
              className="absolute top-3 right-3 px-2.5 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors"
            >
              {copied === "any" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Replace <code className="text-violet-400">YOUR_WIDGET_ID</code> with your actual widget ID from the Create Widget page.
          </p>
        </div>
      )}
    </div>
  );
}
