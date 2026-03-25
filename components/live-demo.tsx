"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const DEMO_LAYOUTS = [
  { value: "carousel", label: "Carousel" },
  { value: "grid", label: "Grid" },
  { value: "marquee", label: "Marquee" },
  { value: "list", label: "List" },
  { value: "wall-sm", label: "Wall" },
  { value: "spotlight", label: "Spotlight" },
];

const DEMO_TEMPLATES = [
  { value: "soft", label: "Soft" },
  { value: "glass", label: "Glass" },
  { value: "darkElegant", label: "Dark" },
  { value: "minimal", label: "Minimal" },
  { value: "gradientBorder", label: "Gradient" },
];



const DARK_TEMPLATES = ["darkElegant", "glass", "neon"];

function initDemoWidget(container: HTMLDivElement, layout: string, template: string) {
  // Clear previous content
  container.innerHTML = "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const VissarWidget = (window as any).VissarWidget;

  const colorScheme = DARK_TEMPLATES.includes(template) ? "dark" : "light";

  const config = {
    widgetId: "demo",
    layout,
    template,
    maxReviews: 6,
    placeId: "mock",
    animations: true,
    animationStyle: "slideUp",
    colorScheme,
    tier: "pro",
    removeBranding: true,
    autoStyle: true,
  };

  if (VissarWidget) {
    new VissarWidget(container, config).init();
  } else {
    // Script not yet loaded — create the div and let the auto-init pick it up
    const div = document.createElement("div");
    div.setAttribute("data-vissar-widget", "demo");
    div.setAttribute("data-vissar-layout", layout);
    div.setAttribute("data-vissar-template", template);
    div.setAttribute("data-vissar-max-reviews", "6");
    div.setAttribute("data-vissar-place-id", "mock");
    div.setAttribute("data-vissar-animations", "true");
    div.setAttribute("data-vissar-color-scheme", "light");
    div.setAttribute("data-vissar-tier", "pro");
    div.setAttribute("data-vissar-remove-branding", "true");
    container.appendChild(div);
  }
}

export default function LiveDemo() {
  const [layout, setLayout] = useState("carousel");
  const [template, setTemplate] = useState("soft");
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  // Load script once on mount
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    if (window.VissarWidget) {
      // Already loaded — init immediately
      if (containerRef.current) initDemoWidget(containerRef.current, layout, template);
      return;
    }

    const script = document.createElement("script");
    script.id = "vissar-demo-script";
    script.src = "https://www.vissar.com/widget/vissar-widget.min.js";
    script.async = true;
    script.onload = () => {
      if (containerRef.current) initDemoWidget(containerRef.current, layout, template);
    };
    document.head.appendChild(script);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-init widget whenever layout or template changes
  useEffect(() => {
    if (!containerRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = (window as any).VissarWidget;
    if (W) {
      initDemoWidget(containerRef.current, layout, template);
    } else {
      // Script still loading — wait for it then init
      const wait = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).VissarWidget && containerRef.current) {
          clearInterval(wait);
          initDemoWidget(containerRef.current, layout, template);
        }
      }, 100);
      return () => clearInterval(wait);
    }
  }, [layout, template]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-xl p-2">
          <span className="text-xs text-slate-500 px-2 font-medium">Layout</span>
          <div className="flex gap-1">
            {DEMO_LAYOUTS.map(l => (
              <button
                key={l.value}
                onClick={() => setLayout(l.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  layout === l.value
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-xl p-2">
          <span className="text-xs text-slate-500 px-2 font-medium">Style</span>
          <div className="flex gap-1">
            {DEMO_TEMPLATES.map(t => (
              <button
                key={t.value}
                onClick={() => setTemplate(t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  template === t.value
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Widget container — bg adapts to template */}
      <div
        className="rounded-2xl p-6 sm:p-8 shadow-2xl shadow-slate-950/50 min-h-[200px] transition-colors duration-300"
        style={{ backgroundColor: DARK_TEMPLATES.includes(template) ? "#0f172a" : "#ffffff" }}
      >
        <div ref={containerRef} />
      </div>

      <div className="text-center pb-8">
        <p className="text-slate-500 text-sm mb-4">
          This is your widget — on your site, it auto-detects your fonts, colors, and style.
        </p>
        <Link
          href="/widget/new"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Create yours free →
        </Link>
      </div>
    </div>
  );
}
