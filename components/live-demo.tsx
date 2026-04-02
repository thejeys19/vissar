"use client";

/**
 * live-demo.tsx — Vissar Landing Page Demo (V2)
 *
 * Shows the widget inside a simulated real website — not a floating black box.
 * Uses WidgetPreview directly so visitors see the same beautiful V2 cards.
 * Three site context presets make it immediately clear how it looks on their site.
 */

import { useState } from "react";
import Link from "next/link";
import WidgetPreview from "@/components/widget-preview";

// ── Layouts available in demo ──────────────────────────────────────
const LAYOUTS = [
  { value: "carousel",  label: "Carousel",  icon: "⟳" },
  { value: "grid",      label: "Grid",      icon: "⊞" },
  { value: "wall-lg",   label: "Wall",      icon: "≋" },
  { value: "spotlight", label: "Spotlight", icon: "◎" },
  { value: "list",      label: "List",      icon: "☰" },
  { value: "summary",   label: "Summary",   icon: "★" },
];

// ── Style templates ────────────────────────────────────────────────
const TEMPLATES = [
  { value: "soft",          label: "Soft",      dot: "#e2e8f0", card: "#ffffff" },
  { value: "glass",         label: "Glass",     dot: "#a78bfa", card: "rgba(255,255,255,0.12)" },
  { value: "darkElegant",   label: "Dark",      dot: "#334155", card: "#192031" },
  { value: "aurora",        label: "Aurora",    dot: "#c4b5fd", card: "#f0eefe" },
  { value: "warm",          label: "Warm",      dot: "#fcd34d", card: "#fffbf2" },
  { value: "gradientBorder",label: "Gradient",  dot: "#8b5cf6", card: "#ffffff" },
];

// ── Site context presets ───────────────────────────────────────────
interface SiteContext {
  id: string;
  label: string;
  emoji: string;
  // Fake nav branding
  brandName: string;
  brandColor: string;
  // Section heading above widget
  sectionTitle: string;
  sectionSubtitle: string;
  // Background of the page surrounding widget
  pageBg: string;
  navBg: string;
  navTextColor: string;
  // Nav links
  navLinks: string[];
  // Footer tagline
  footerText: string;
  // Default template that looks best in this context
  defaultTemplate: string;
  primaryColor: string;
}

const CONTEXTS: SiteContext[] = [
  {
    id: "ecommerce",
    label: "E-Commerce",
    emoji: "🛍️",
    brandName: "Lumière",
    brandColor: "#0f172a",
    sectionTitle: "Loved by our customers",
    sectionSubtitle: "Real reviews from real shoppers — updated live from Google.",
    pageBg: "#f8fafc",
    navBg: "#ffffff",
    navTextColor: "#1e293b",
    navLinks: ["Shop", "Collections", "About", "Reviews"],
    footerText: "Free shipping on orders over $75",
    defaultTemplate: "soft",
    primaryColor: "#0f172a",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    emoji: "🍽️",
    brandName: "Casa Verde",
    brandColor: "#166534",
    sectionTitle: "What our guests say",
    sectionSubtitle: "Fresh food. Honest reviews. See what keeps people coming back.",
    pageBg: "#fefce8",
    navBg: "#14532d",
    navTextColor: "#ffffff",
    navLinks: ["Menu", "Reservations", "Events", "About"],
    footerText: "Reservations: (555) 012-3456 • Open daily 11am – 10pm",
    defaultTemplate: "warm",
    primaryColor: "#166534",
  },
  {
    id: "saas",
    label: "SaaS",
    emoji: "🚀",
    brandName: "Orbitly",
    brandColor: "#4f46e5",
    sectionTitle: "Trusted by 10,000+ teams",
    sectionSubtitle: "Don't take our word for it — here's what our users say on Google.",
    pageBg: "#030712",
    navBg: "#030712",
    navTextColor: "#f1f5f9",
    navLinks: ["Product", "Pricing", "Docs", "Blog"],
    footerText: "Built for speed. Designed to grow.",
    defaultTemplate: "glass",
    primaryColor: "#4f46e5",
  },
];

const DARK_TEMPLATES = new Set(["glass", "darkElegant", "neon"]);
const DARK_CONTEXTS = new Set(["saas"]);

export default function LiveDemo() {
  const [layout, setLayout]     = useState("wall-lg");
  const [template, setTemplate] = useState("glass");
  const [contextId, setContextId] = useState("saas");
  const [transitioning, setTransitioning] = useState(false);

  const ctx = CONTEXTS.find(c => c.id === contextId)!;

  // When switching context, snap to its best-fit template
  function switchContext(id: string) {
    const next = CONTEXTS.find(c => c.id === id)!;
    setTransitioning(true);
    setTimeout(() => {
      setContextId(id);
      setTemplate(next.defaultTemplate);
      setTransitioning(false);
    }, 180);
  }

  function switchLayout(l: string) {
    setTransitioning(true);
    setTimeout(() => {
      setLayout(l);
      setTransitioning(false);
    }, 120);
  }

  function switchTemplate(t: string) {
    setTransitioning(true);
    setTimeout(() => {
      setTemplate(t);
      setTransitioning(false);
    }, 120);
  }

  const isDarkCtx = DARK_CONTEXTS.has(contextId);
  const isDarkTpl = DARK_TEMPLATES.has(template);
  const isDark = isDarkCtx || isDarkTpl;

  return (
    <div className="w-full space-y-6">

      {/* ── Control bar ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center flex-wrap">

        {/* Site type */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "14px",
            padding: "5px 6px 5px 12px",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.07em", marginRight: "2px" }}>Site</span>
          {CONTEXTS.map(c => (
            <button
              key={c.id}
              onClick={() => switchContext(c.id)}
              style={{
                padding: "5px 12px",
                borderRadius: "9px",
                fontSize: "12px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "all 160ms",
                background: contextId === c.id ? "rgba(139,92,246,0.9)" : "transparent",
                color: contextId === c.id ? "#fff" : "rgba(255,255,255,0.45)",
              }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {/* Layout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "14px",
            padding: "5px 6px 5px 12px",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.07em", marginRight: "2px" }}>Layout</span>
          {LAYOUTS.map(l => (
            <button
              key={l.value}
              onClick={() => switchLayout(l.value)}
              style={{
                padding: "5px 10px",
                borderRadius: "9px",
                fontSize: "12px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "all 160ms",
                background: layout === l.value ? "rgba(139,92,246,0.9)" : "transparent",
                color: layout === l.value ? "#fff" : "rgba(255,255,255,0.45)",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Style */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "14px",
            padding: "5px 6px 5px 12px",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.07em", marginRight: "2px" }}>Style</span>
          {TEMPLATES.map(t => (
            <button
              key={t.value}
              onClick={() => switchTemplate(t.value)}
              title={t.label}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                border: template === t.value ? "2px solid #8b5cf6" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 160ms",
                background: t.card,
                flexShrink: 0,
                boxShadow: template === t.value ? "0 0 0 3px rgba(139,92,246,0.25)" : "none",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  bottom: "4px",
                  right: "4px",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: t.dot,
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Browser chrome + simulated website ──────────── */}
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "all 200ms",
        }}
      >
        {/* Browser chrome bar */}
        <div
          style={{
            background: "#1e2130",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
          </div>
          {/* URL bar */}
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              borderRadius: "8px",
              padding: "5px 12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              maxWidth: "340px",
              margin: "0 auto",
            }}
          >
            {/* Lock icon */}
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
              <rect x="1" y="5" width="8" height="7" rx="1.5" fill="rgba(255,255,255,0.3)" />
              <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none"/>
            </svg>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
              www.{ctx.brandName.toLowerCase().replace(/\s/g, "")}.com
            </span>
          </div>
        </div>

        {/* Simulated website */}
        <div
          style={{
            background: ctx.pageBg,
            transition: "background 300ms",
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "translateY(4px)" : "translateY(0)",
            transitionProperty: "opacity, transform, background",
            transitionDuration: "200ms",
          }}
        >
          {/* Fake site nav */}
          <div
            style={{
              background: ctx.navBg,
              padding: "0 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "52px",
              borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
              transition: "all 300ms",
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: "16px",
                color: ctx.navTextColor,
                letterSpacing: "-0.03em",
                transition: "color 300ms",
              }}
            >
              {ctx.brandName}
            </span>
            <div style={{ display: "flex", gap: "24px" }}>
              {ctx.navLinks.map(link => (
                <span
                  key={link}
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: isDarkCtx ? "rgba(255,255,255,0.5)" : `${ctx.navTextColor}99`,
                    cursor: "default",
                  }}
                >
                  {link}
                </span>
              ))}
            </div>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: ctx.brandColor,
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "default",
                transition: "background 300ms",
              }}
            >
              {contextId === "restaurant" ? "Book Table" : contextId === "saas" ? "Start Free" : "Shop Now"}
            </div>
          </div>

          {/* Widget section */}
          <div
            style={{
              padding: "48px 32px 40px",
              background: ctx.pageBg,
              transition: "background 300ms",
            }}
          >
            {/* Section heading */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: isDark ? "#f1f5f9" : "#0f172a",
                  margin: 0,
                  marginBottom: "8px",
                  transition: "color 300ms",
                }}
              >
                {ctx.sectionTitle}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: isDark ? "rgba(241,245,249,0.5)" : "rgba(15,23,42,0.5)",
                  margin: 0,
                  transition: "color 300ms",
                }}
              >
                {ctx.sectionSubtitle}
              </p>
            </div>

            {/* The actual widget */}
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                transition: "all 200ms",
              }}
            >
              <WidgetPreview
                layout={layout}
                template={template}
                maxReviews={5}
                animations={true}
                animationStyle="slideUp"
                primaryColor={ctx.primaryColor}
                borderRadius={16}
                shadowIntensity="Soft"
                cardSpacing={20}
                showAvatar={true}
                showDate={true}
                starColor="#F59E0B"
                colorScheme={isDarkCtx ? "dark" : "auto"}
                showHeader={false}
                headerText=""
                showWriteReview={false}
                removeBranding={true}
              />
            </div>
          </div>

          {/* Fake site footer strip */}
          <div
            style={{
              padding: "12px 32px",
              background: isDarkCtx ? "#020617" : isDark ? "#0f172a" : "rgba(0,0,0,0.03)",
              borderTop: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 300ms",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
              }}
            >
              {ctx.brandName}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.2)",
              }}
            >
              {ctx.footerText}
            </span>
          </div>
        </div>
      </div>

      {/* ── Caption + CTA ───────────────────────────────── */}
      <div style={{ textAlign: "center", paddingBottom: "8px" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginBottom: "20px" }}>
          This is the actual Vissar widget — on your site, it auto-detects your colors, fonts, and spacing.
        </p>
        <Link
          href="/widget/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            padding: "13px 28px",
            borderRadius: "12px",
            textDecoration: "none",
            boxShadow: "0 8px 32px rgba(124,58,237,0.40)",
            transition: "all 160ms",
          }}
        >
          Create your free widget
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
