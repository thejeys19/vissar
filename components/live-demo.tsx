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

export default function LiveDemo() {
  const [layout, setLayout] = useState("carousel");
  const [template, setTemplate] = useState("soft");
  const [widgetKey, setWidgetKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reload widget when layout/template changes
  useEffect(() => {
    setWidgetKey(k => k + 1);
  }, [layout, template]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = "";

    // Create widget container
    const div = document.createElement("div");
    div.setAttribute("data-vissar-widget", "demo");
    div.setAttribute("data-vissar-layout", layout);
    div.setAttribute("data-vissar-template", template);
    div.setAttribute("data-vissar-max-reviews", "6");
    div.setAttribute("data-vissar-place-id", "mock");
    div.setAttribute("data-vissar-animations", "true");
    div.setAttribute("data-vissar-animation-style", "slideUp");
    div.setAttribute("data-vissar-color-scheme", "light");
    div.setAttribute("data-vissar-tier", "pro"); // no branding in demo
    div.setAttribute("data-vissar-remove-branding", "true");
    containerRef.current.appendChild(div);

    // Load widget script fresh each time
    const existingScript = document.getElementById("vissar-demo-script");
    if (existingScript) existingScript.remove();

    // Remove old widget styles to force re-render
    const oldStyles = document.querySelectorAll("style[data-vissar]");
    oldStyles.forEach(s => s.remove());

    const script = document.createElement("script");
    script.id = "vissar-demo-script";
    script.src = "https://www.vissar.com/widget/vissar-widget.min.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetKey]);

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

      {/* Widget container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl shadow-slate-950/50 min-h-[200px]">
        <div ref={containerRef} />
      </div>

      <div className="text-center">
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
