'use client';

/**
 * widget-preview.tsx — Vissar V2
 *
 * Design philosophy:
 *   Cards float off the surface — white, airy, layered shadows.
 *   Every detail earns its place. Nothing decorative without purpose.
 *   Wall widgets own the full panel. Smaller widgets still command respect.
 *   Competitors show gray boxes. Ours look like Apple made them.
 */

import React, { useState, useEffect, useRef } from 'react';

interface WidgetPreviewProps {
  layout: string;
  template: string;
  maxReviews: number;
  animations?: boolean;
  primaryColor?: string;
  borderRadius?: number;
  shadowIntensity?: string;
  cardSpacing?: number;
  showAvatar?: boolean;
  showDate?: boolean;
  animationStyle?: string;
  starColor?: string;
  colorScheme?: string;
  showHeader?: boolean;
  headerText?: string;
  showWriteReview?: boolean;
  removeBranding?: boolean;
}

const MOCK_REVIEWS = [
  {
    name: 'Sarah Mitchell',
    initials: 'SM',
    role: 'Marketing Director',
    rating: 5,
    text: 'Absolutely transformed our online presence. The reviews widget looks stunning on our site and has noticeably increased customer trust.',
    date: '2 weeks ago',
  },
  {
    name: 'James Chen',
    initials: 'JC',
    role: 'Restaurant Owner',
    rating: 5,
    text: 'Setup took less than 5 minutes. Our Google reviews now display beautifully and update automatically. Highly recommend!',
    date: '1 month ago',
  },
  {
    name: 'Emily Rodriguez',
    initials: 'ER',
    role: 'E-commerce Manager',
    rating: 4,
    text: 'Clean design that blends perfectly with our brand. The carousel layout is a favorite among our team.',
    date: '3 weeks ago',
  },
  {
    name: 'David Park',
    initials: 'DP',
    role: 'Dental Practice',
    rating: 5,
    text: 'Patients love seeing real reviews right on our website. It builds instant credibility and has helped us grow.',
    date: '5 days ago',
  },
  {
    name: 'Lisa Thompson',
    initials: 'LT',
    role: 'Boutique Owner',
    rating: 4,
    text: 'The glassmorphism template is gorgeous. Our customers always comment on how professional our site looks now.',
    date: '2 months ago',
  },
];

// === DESIGN SYSTEM ===

// Unique gradient per reviewer — no two avatars the same color
const AVATAR_PALETTE: [string, string][] = [
  ['#7C3AED', '#5B21B6'], // violet
  ['#EC4899', '#BE185D'], // rose
  ['#F59E0B', '#D97706'], // amber
  ['#10B981', '#059669'], // emerald
  ['#3B82F6', '#1D4ED8'], // blue
  ['#F97316', '#C2410C'], // orange
  ['#8B5CF6', '#6D28D9'], // purple
  ['#06B6D4', '#0284C7'], // cyan
];

function avatarGradient(name: string): [string, string] {
  let h = 0;
  for (let i = 0; i < name.length; i++) { h = ((h << 5) - h) + name.charCodeAt(i); h |= 0; }
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

// Three-layer shadow system — depth through layering, not weight
const SHADOWS = {
  None: { base: 'none', hover: 'none' },
  Soft: {
    base: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.04)',
    hover: '0 2px 4px rgba(0,0,0,0.06), 0 10px 28px rgba(0,0,0,0.10), 0 28px 60px rgba(0,0,0,0.07)',
  },
  Medium: {
    base: '0 2px 4px rgba(0,0,0,0.06), 0 8px 20px rgba(0,0,0,0.09), 0 24px 56px rgba(0,0,0,0.06)',
    hover: '0 4px 8px rgba(0,0,0,0.08), 0 18px 40px rgba(0,0,0,0.12), 0 40px 80px rgba(0,0,0,0.09)',
  },
  Strong: {
    base: '0 4px 8px rgba(0,0,0,0.08), 0 16px 32px rgba(0,0,0,0.12), 0 40px 80px rgba(0,0,0,0.09)',
    hover: '0 8px 16px rgba(0,0,0,0.10), 0 28px 52px rgba(0,0,0,0.16), 0 60px 100px rgba(0,0,0,0.11)',
  },
} as Record<string, { base: string; hover: string }>;

// Warm-tinted shadow for warm template
const WARM_SHADOWS = {
  None: 'none',
  Soft: '0 1px 2px rgba(120,53,15,0.05), 0 4px 12px rgba(120,53,15,0.08), 0 16px 40px rgba(120,53,15,0.05)',
  Medium: '0 2px 4px rgba(120,53,15,0.07), 0 8px 20px rgba(120,53,15,0.11), 0 24px 56px rgba(120,53,15,0.07)',
  Strong: '0 4px 8px rgba(120,53,15,0.09), 0 16px 32px rgba(120,53,15,0.14), 0 40px 80px rgba(120,53,15,0.10)',
} as Record<string, string>;

const WARM_SHADOWS_HOVER = {
  None: 'none',
  Soft: '0 2px 4px rgba(120,53,15,0.08), 0 10px 28px rgba(120,53,15,0.13), 0 28px 60px rgba(120,53,15,0.08)',
  Medium: '0 4px 8px rgba(120,53,15,0.10), 0 18px 40px rgba(120,53,15,0.15), 0 40px 80px rgba(120,53,15,0.11)',
  Strong: '0 8px 16px rgba(120,53,15,0.12), 0 28px 52px rgba(120,53,15,0.18), 0 60px 100px rgba(120,53,15,0.12)',
} as Record<string, string>;

function getBorderRadius(r: number): string {
  if (r <= 0) return '0px';
  if (r <= 4) return '4px';
  if (r <= 8) return '8px';
  if (r <= 12) return '12px';
  if (r <= 16) return '16px';
  if (r <= 20) return '20px';
  return '24px';
}

// Template definitions — every visual property in one place
interface TplDef {
  cardBg: string;
  border: string;
  shadow: (i: string) => string;
  hoverShadow: (i: string) => string;
  containerBg: string;
  name: string; role: string; body: string; date: string;
  isDark: boolean;
  isGlass?: boolean;
  isGradientBorder?: boolean;
  isClassic?: boolean;
}

function getTpl(template: string, colorScheme = 'auto'): TplDef {
  const light = colorScheme === 'light';
  const forceDark = colorScheme === 'dark';

  // Force-dark override: wrap any light template in dark mode appearance
  if (forceDark && !['glass', 'darkElegant', 'neon'].includes(template)) {
    return {
      cardBg: '#192031',
      border: 'rgba(255,255,255,0.06)',
      shadow: (i) => SHADOWS[i]?.base || SHADOWS.Soft.base,
      hoverShadow: (i) => SHADOWS[i]?.hover || SHADOWS.Soft.hover,
      containerBg: '#0b1120',
      name: '#f1f5f9', role: '#475569', body: '#94a3b8', date: '#334155',
      isDark: true,
      isGlass: template === 'glass',
      isGradientBorder: template === 'gradientBorder',
      isClassic: template === 'classic',
    };
  }
  switch (template) {
    case 'glass': return {
      cardBg: 'rgba(255,255,255,0.10)',
      border: 'rgba(255,255,255,0.18)',
      shadow: () => '0 8px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.12)',
      hoverShadow: () => '0 14px 44px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.18)',
      containerBg: 'linear-gradient(135deg, rgba(91,33,182,0.75) 0%, rgba(10,7,30,0.90) 55%, rgba(30,27,75,0.75) 100%)',
      name: '#ffffff', role: 'rgba(255,255,255,0.56)', body: 'rgba(255,255,255,0.78)', date: 'rgba(255,255,255,0.36)',
      isDark: true, isGlass: true,
    };
    case 'darkElegant': return {
      cardBg: '#192031',
      border: 'rgba(255,255,255,0.05)',
      shadow: (i) => i === 'None' ? 'none' : '0 2px 8px rgba(0,0,0,0.32), 0 8px 24px rgba(0,0,0,0.28)',
      hoverShadow: () => '0 4px 16px rgba(0,0,0,0.38), 0 16px 40px rgba(0,0,0,0.32)',
      containerBg: '#0b1120',
      name: '#f1f5f9', role: '#3d4a5c', body: '#7a8898', date: '#2d3a4a',
      isDark: true,
    };
    case 'neon': return {
      cardBg: '#040c1a',
      border: 'rgba(34,211,238,0.28)',
      shadow: (i) => {
        if (i === 'None') return '0 0 0 1px rgba(34,211,238,0.28)';
        const g = { Soft: '0 0 20px rgba(34,211,238,0.12)', Medium: '0 0 36px rgba(34,211,238,0.20)', Strong: '0 0 56px rgba(34,211,238,0.30)' };
        return `0 0 0 1px rgba(34,211,238,0.28), ${g[i as keyof typeof g] || g.Soft}`;
      },
      hoverShadow: () => '0 0 0 1px rgba(34,211,238,0.55), 0 0 44px rgba(34,211,238,0.28)',
      containerBg: '#010b18',
      name: '#e0fdff', role: 'rgba(34,211,238,0.48)', body: 'rgba(224,253,255,0.70)', date: 'rgba(34,211,238,0.28)',
      isDark: true,
    };
    case 'minimal': return {
      cardBg: '#ffffff',
      border: 'rgba(0,0,0,0.10)',
      shadow: () => 'none',
      hoverShadow: () => '0 0 0 1.5px rgba(0,0,0,0.14)',
      containerBg: light ? '#ffffff' : '#f8fafc',
      name: '#0f172a', role: '#94a3b8', body: '#64748b', date: '#94a3b8',
      isDark: false,
    };
    case 'aurora': return {
      cardBg: 'linear-gradient(135deg, rgba(245,243,255,0.94) 0%, rgba(238,242,255,0.94) 100%)',
      border: 'rgba(139,92,246,0.18)',
      shadow: (i) => SHADOWS[i]?.base || SHADOWS.Soft.base,
      hoverShadow: (i) => SHADOWS[i]?.hover || SHADOWS.Soft.hover,
      containerBg: '#f0eefe',
      name: '#1e1b4b', role: '#6d28d9', body: '#4c1d95', date: 'rgba(109,40,217,0.38)',
      isDark: false,
    };
    case 'spotlight': return {
      cardBg: '#ffffff',
      border: 'rgba(0,0,0,0.04)',
      shadow: (i) => {
        if (i === 'None') return 'none';
        const m = { Soft: '-4px -4px 20px rgba(0,0,0,0.06), 5px 8px 24px rgba(0,0,0,0.09)', Medium: '-6px -6px 28px rgba(0,0,0,0.09), 7px 12px 36px rgba(0,0,0,0.12)', Strong: '-8px -8px 40px rgba(0,0,0,0.12), 10px 16px 52px rgba(0,0,0,0.15)' };
        return m[i as keyof typeof m] || m.Soft;
      },
      hoverShadow: (i) => {
        if (i === 'None') return 'none';
        const m = { Soft: '-6px -6px 28px rgba(0,0,0,0.09), 7px 14px 36px rgba(0,0,0,0.13)', Medium: '-8px -8px 36px rgba(0,0,0,0.12), 9px 18px 48px rgba(0,0,0,0.16)', Strong: '-10px -10px 52px rgba(0,0,0,0.15), 12px 22px 64px rgba(0,0,0,0.19)' };
        return m[i as keyof typeof m] || m.Soft;
      },
      containerBg: light ? '#ffffff' : '#f9fafa',
      name: '#0f172a', role: '#94a3b8', body: '#475569', date: '#cbd5e1',
      isDark: false,
    };
    case 'gradientBorder': return {
      cardBg: '#ffffff',
      border: 'transparent',
      shadow: (i) => SHADOWS[i]?.base || SHADOWS.Soft.base,
      hoverShadow: (i) => SHADOWS[i]?.hover || SHADOWS.Soft.hover,
      containerBg: light ? '#ffffff' : '#fafafa',
      name: '#0f172a', role: '#94a3b8', body: '#475569', date: '#cbd5e1',
      isDark: false, isGradientBorder: true,
    };
    case 'classic': return {
      cardBg: '#ffffff',
      border: '#d1d5db',
      shadow: () => 'none',
      hoverShadow: () => '0 2px 8px rgba(0,0,0,0.08)',
      containerBg: light ? '#f9fafb' : '#f1f5f9',
      name: '#111827', role: '#6b7280', body: '#374151', date: '#9ca3af',
      isDark: false, isClassic: true,
    };
    case 'warm': return {
      cardBg: '#fffbf2',
      border: 'rgba(217,119,6,0.13)',
      shadow: (i) => WARM_SHADOWS[i] || WARM_SHADOWS.Soft,
      hoverShadow: (i) => WARM_SHADOWS_HOVER[i] || WARM_SHADOWS_HOVER.Soft,
      containerBg: '#fef8ed',
      name: '#78350f', role: 'rgba(120,53,15,0.54)', body: 'rgba(120,53,15,0.68)', date: 'rgba(120,53,15,0.36)',
      isDark: false,
    };
    case 'soft':
    default: return {
      cardBg: '#ffffff',
      border: 'rgba(0,0,0,0.06)',
      shadow: (i) => SHADOWS[i]?.base || SHADOWS.Soft.base,
      hoverShadow: (i) => SHADOWS[i]?.hover || SHADOWS.Soft.hover,
      containerBg: '#ffffff',
      name: '#0f172a', role: '#94a3b8', body: '#475569', date: '#cbd5e1',
      isDark: false,
    };
  }
}

// === SUB-COMPONENTS ===

function GoogleIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

// === ANIMATION HOOKS ===

/**
 * Returns true once the ref element has entered the viewport.
 * Re-fires if the element leaves and re-enters (threshold 0.2).
 */
function useInView(threshold = 0.2): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true); // SSR / no observer support → just show
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// === STATIC STARS (for walls/marquee where animation would be distracting) ===
function Stars({ rating, color = '#F59E0B', size = 14 }: { rating: number; color?: string; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? color : '#dde3ec', fontSize: `${size}px`, lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

/**
 * AnimatedStars — sequential ignition left-to-right.
 * Each star lights up with an 80ms stagger after the card enters the viewport.
 * The 5th star gets a brief warm glow pulse when it completes.
 */
function AnimatedStars({
  rating,
  color = '#F59E0B',
  size = 14,
  animate = true,
  delay = 0, // ms offset for card cascade stagger
}: {
  rating: number;
  color?: string;
  size?: number;
  animate?: boolean;
  delay?: number;
}) {
  const [ref, inView] = useInView(0.3);
  const [lit, setLit] = useState(0); // how many stars are currently lit
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    if (!animate || !inView) return;
    setLit(0);
    setGlowing(false);

    // stagger each star 80ms apart, after an initial delay for card cascade
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= rating; i++) {
      timers.push(setTimeout(() => {
        setLit(i);
        if (i === rating && i === 5) {
          // brief glow on full 5-star completion
          setTimeout(() => setGlowing(true), 40);
          setTimeout(() => setGlowing(false), 500);
        }
      }, delay + 100 + i * 80));
    }
    return () => timers.forEach(clearTimeout);
  }, [inView, animate, rating, delay]);

  return (
    <div ref={ref} style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => {
        const isLit = animate ? i <= lit : i <= rating;
        const isLastGlow = glowing && i === rating && i === 5;
        return (
          <span
            key={i}
            style={{
              color: isLit ? color : '#dde3ec',
              fontSize: `${size}px`,
              lineHeight: 1,
              transition: animate ? 'color 120ms ease, text-shadow 200ms ease, transform 120ms ease' : 'none',
              textShadow: isLastGlow ? `0 0 8px ${color}cc, 0 0 16px ${color}66` : 'none',
              transform: isLastGlow ? 'scale(1.18)' : isLit && animate ? 'scale(1.0)' : 'scale(0.92)',
              display: 'inline-block',
            }}
          >★</span>
        );
      })}
    </div>
  );
}

/**
 * AnimatedScoreCount — counts up from 0 to target when in view.
 * Used on the Summary widget score display.
 */
function AnimatedScoreCount({
  target = 4.8,
  color,
  fontSize = '52px',
  fontWeight = 800,
  animate = true,
}: {
  target?: number;
  color: string;
  fontSize?: string;
  fontWeight?: number;
  animate?: boolean;
}) {
  const [ref, inView] = useInView(0.3);
  const [display, setDisplay] = useState(animate ? '0.0' : target.toFixed(1));

  useEffect(() => {
    if (!animate || !inView) return;
    setDisplay('0.0');
    const duration = 700; // ms
    const start = performance.now();
    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(current.toFixed(1));
      if (progress < 1) requestAnimationFrame(frame);
    };
    // Small delay so it fires after initial render
    const t = setTimeout(() => requestAnimationFrame(frame), 120);
    return () => clearTimeout(t);
  }, [inView, animate, target]);

  return (
    <div ref={ref} style={{ fontSize, fontWeight, color, lineHeight: 1, letterSpacing: '-0.03em' }}>
      {display}
    </div>
  );
}

interface CardProps {
  review: typeof MOCK_REVIEWS[0];
  template: string;
  shadowIntensity?: string;
  borderRadius?: number;
  showAvatar?: boolean;
  showDate?: boolean;
  starColor?: string;
  primaryColor?: string;
  compact?: boolean;
  animDelay?: number;
  colorScheme?: string;
  animations?: boolean;
  animationStyle?: string;
}

function ReviewCard({
  review, template, shadowIntensity = 'Soft', borderRadius = 16,
  showAvatar = true, showDate = true, starColor = '#F59E0B',
  primaryColor = '#7C3AED', compact = false, animDelay = 0, colorScheme = 'auto',
  animations = true, animationStyle = 'slideUp',
}: CardProps) {
  const tpl = getTpl(template, colorScheme);
  const radius = getBorderRadius(borderRadius);
  const classicRadius = template === 'classic' ? '4px' : radius;
  const [from, to] = avatarGradient(review.name);
  const pad = compact ? '12px 14px' : '20px 22px';
  const shadow = tpl.shadow(shadowIntensity);
  const hoverClass = `vsr2-hover-${shadowIntensity?.toLowerCase() || 'soft'}`;
  const hoverShadow = tpl.hoverShadow(shadowIntensity);

  // Scroll-entry fade-up: card starts invisible, fades + rises in when it enters viewport
  const [cardRef, cardInView] = useInView(0.15);
  const [hasEntered, setHasEntered] = useState(!animations);
  useEffect(() => {
    if (cardInView && !hasEntered) {
      const t = setTimeout(() => setHasEntered(true), animDelay);
      return () => clearTimeout(t);
    }
  }, [cardInView, hasEntered, animDelay]);

  // Shared inner content
  const inner = (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: compact ? '8px' : '13px' }}>
        {showAvatar && (
          <div style={{
            width: compact ? '30px' : '36px',
            height: compact ? '30px' : '36px',
            minWidth: compact ? '30px' : '36px',
            borderRadius: '50%',
            background: `linear-gradient(145deg, ${from}, ${to})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: compact ? '10px' : '12px', fontWeight: 700,
            letterSpacing: '0.02em', userSelect: 'none',
          }}>
            {review.initials}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            color: tpl.name, fontSize: compact ? '11px' : '13px', fontWeight: 600,
            letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{review.name}</div>
          <div style={{
            color: tpl.role, fontSize: compact ? '9.5px' : '10.5px', fontWeight: 500,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginTop: '1px',
          }}>{review.role}</div>
        </div>
        {!tpl.isDark && !compact && (
          <div style={{ opacity: 0.45, marginTop: '1px', flexShrink: 0 }}>
            <GoogleIcon size={13} />
          </div>
        )}
      </div>
      <AnimatedStars
        rating={review.rating}
        color={starColor}
        size={compact ? 11 : 14}
        animate={animations && animationStyle !== 'none' && !compact}
        delay={animDelay}
      />
      <p style={{
        color: tpl.body,
        fontSize: compact ? '11px' : '13.5px',
        lineHeight: 1.62,
        marginTop: compact ? '7px' : '11px',
        display: '-webkit-box',
        WebkitLineClamp: compact ? 2 : 3,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
      }}>{review.text}</p>
      {showDate && !compact && (
        <div style={{ color: tpl.date, fontSize: '11px', marginTop: '11px', fontWeight: 400 }}>
          {review.date}
        </div>
      )}
    </>
  );

  // Scroll-entry wrapper styles — respects animationStyle setting
  // 'none' → no animation at all
  // 'fadeIn' → opacity only, no movement
  // 'slideUp' → fade + rise (default, most polished)
  // 'scaleIn' → fade + scale up from 96%
  const effectiveAnims = animations && animationStyle !== 'none';
  const entryStyle: React.CSSProperties = effectiveAnims ? (() => {
    const base = { opacity: hasEntered ? 1 : 0 };
    if (animationStyle === 'fadeIn') {
      return { ...base, transition: 'opacity 420ms cubic-bezier(0.16,1,0.3,1)' };
    } else if (animationStyle === 'scaleIn') {
      return {
        ...base,
        transform: hasEntered ? 'scale(1)' : 'scale(0.96)',
        transition: 'opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.34,1.56,0.64,1)',
      };
    } else {
      // slideUp (default)
      return {
        ...base,
        transform: hasEntered ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 420ms cubic-bezier(0.16,1,0.3,1), transform 420ms cubic-bezier(0.16,1,0.3,1)',
      };
    }
  })() : {};

  // Gradient border: wrap in a 1.5px gradient border using padding trick
  if (tpl.isGradientBorder) {
    return (
      <div
        ref={cardRef}
        data-vsr2="card"
        data-vsr2-hover-shadow={hoverShadow}
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, #a78bfa, #6366f1)`,
          borderRadius: `calc(${classicRadius} + 1.5px)`,
          padding: '1.5px',
          boxShadow: shadow,
          transition: 'opacity 420ms cubic-bezier(0.16,1,0.3,1), transform 420ms cubic-bezier(0.16,1,0.3,1)',
          ...entryStyle,
        }}
        className={`vsr2-card ${hoverClass}`}
      >
        <div style={{
          background: '#ffffff',
          borderRadius: classicRadius,
          padding: pad,
          height: '100%',
        }}>
          {inner}
        </div>
      </div>
    );
  }

  // Glass: with backdrop-filter
  if (tpl.isGlass) {
    return (
      <div
        ref={cardRef}
        data-vsr2="card"
        data-vsr2-hover-shadow={hoverShadow}
        className={`vsr2-card ${hoverClass}`}
        style={{
          background: tpl.cardBg,
          border: `1px solid ${tpl.border}`,
          borderRadius: radius,
          boxShadow: shadow,
          padding: pad,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          transition: 'opacity 420ms cubic-bezier(0.16,1,0.3,1), transform 420ms cubic-bezier(0.16,1,0.3,1)',
          ...entryStyle,
        }}
      >
        {inner}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      data-vsr2="card"
      data-vsr2-hover-shadow={hoverShadow}
      className={`vsr2-card ${hoverClass}`}
      style={{
        background: tpl.cardBg,
        border: `1px solid ${tpl.border}`,
        borderRadius: tpl.isClassic ? '4px' : radius,
        boxShadow: shadow,
        padding: pad,
        transition: 'opacity 420ms cubic-bezier(0.16,1,0.3,1), transform 420ms cubic-bezier(0.16,1,0.3,1)',
        ...entryStyle,
      }}
    >
      {inner}
    </div>
  );
}

// Gradient edge masks for scrolling walls — fades from container color to transparent
function EdgeMask({ containerBg, side }: { containerBg: string; side: 'left' | 'right' }) {
  // Only works cleanly on solid-color containers
  const isGradient = containerBg.startsWith('linear-gradient');
  const fadeColor = isGradient ? 'rgba(5,5,20,0.95)' : containerBg;
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [side]: 0,
        width: '72px',
        background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, ${fadeColor} 0%, transparent 100%)`,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}

// === MAIN COMPONENT ===

export default function WidgetPreview({
  layout,
  template,
  maxReviews,
  animations = true,
  animationStyle = 'slideUp',
  primaryColor = '#7C3AED',
  borderRadius = 16,
  shadowIntensity = 'Soft',
  cardSpacing = 24,
  showAvatar = true,
  showDate = true,
  starColor = '#F59E0B',
  colorScheme = 'auto',
  showHeader = false,
  headerText = '',
  showWriteReview = false,
  removeBranding = false,
}: WidgetPreviewProps) {
  const reviews = MOCK_REVIEWS.slice(0, maxReviews);
  const tpl = getTpl(template, colorScheme);

  // Container background — solid or gradient
  const isGradientBg = tpl.containerBg.startsWith('linear-gradient');
  const containerStyle: React.CSSProperties = isGradientBg
    ? { background: tpl.containerBg }
    : { backgroundColor: tpl.containerBg };

  // Always leave at minimum 20px between cards so shadow can breathe
  const gap = Math.max(cardSpacing, 20);

  // Shared card props — animations + animationStyle flow through to AnimatedStars + scroll-entry
  const cardProps = {
    template, shadowIntensity, borderRadius, showAvatar, showDate,
    starColor, primaryColor, colorScheme, animations, animationStyle,
  };

  return (
    <div
      style={{
        ...containerStyle,
        padding: layout.startsWith('wall') || layout === 'marquee' ? '24px 0' : '28px',
        minHeight: '100%',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* Section heading */}
      {showHeader && headerText && (
        <div style={{ textAlign: 'center', marginBottom: '20px', padding: layout.startsWith('wall') ? '0 20px' : '0' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: tpl.name, margin: 0 }}>{headerText}</h3>
          <div style={{ width: '32px', height: '2px', borderRadius: '2px', background: primaryColor, margin: '8px auto 0' }} />
        </div>
      )}

      {/* ── CAROUSEL ── */}
      {layout === 'carousel' && reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <ReviewCard review={reviews[0]} {...cardProps} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {reviews.map((_, i) => (
              <div key={i} style={{
                width: i === 0 ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === 0 ? primaryColor : (tpl.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)'),
                transition: 'all 200ms',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── GRID ── */}
      {layout === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: `${gap}px`,
        }}>
          {reviews.slice(0, 4).map((r, i) => (
            <ReviewCard key={i} review={r} {...cardProps} animDelay={animations ? i * 60 : 0} />
          ))}
        </div>
      )}

      {/* ── LIST ── */}
      {layout === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
          {reviews.slice(0, 4).map((r, i) => (
            <ReviewCard key={i} review={r} {...cardProps} animDelay={animations ? i * 70 : 0} />
          ))}
        </div>
      )}

      {/* ── MASONRY ── */}
      {layout === 'masonry' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: `${gap}px` }}>
          {reviews.slice(0, 4).map((r, i) => (
            <div key={i} style={{ breakInside: 'avoid' }}>
              <ReviewCard review={r} {...cardProps} animDelay={animations ? i * 60 : 0} />
            </div>
          ))}
        </div>
      )}

      {/* ── WALL (dense mosaic) ── */}
      {layout === 'wall' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${Math.max(6, gap / 3)}px` }}>
          {reviews.map((r, i) => (
            <ReviewCard key={i} review={r} {...cardProps} compact />
          ))}
        </div>
      )}

      {/* ── SCROLLING WALLS (sm, md, lg) ── */}
      {(layout === 'wall-sm' || layout === 'wall-md' || layout === 'wall-lg') && (() => {
        const cfg = {
          'wall-sm': { rows: 2, cardW: 200, textLen: 65, avatarSize: false, dur: 18 },
          'wall-md': { rows: 2, cardW: 280, textLen: 95, avatarSize: true, dur: 22 },
          'wall-lg': { rows: 3, cardW: 340, textLen: 130, avatarSize: true, dur: 26 },
        }[layout]!;

        // Pad to ensure enough reviews for rotation
        const baseReviews = reviews.length < 4
          ? [...reviews, ...reviews, ...reviews]
          : [...reviews, ...reviews];
        const rows = Array.from({ length: cfg.rows }, (_, ri) => {
          // Stagger start offset per row so each row shows different cards
          const offset = (ri * Math.max(1, Math.floor(baseReviews.length / cfg.rows))) % baseReviews.length;
          return [...baseReviews.slice(offset), ...baseReviews.slice(0, offset)];
        });

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', position: 'relative' }}>
            <EdgeMask containerBg={tpl.containerBg} side="left" />
            <EdgeMask containerBg={tpl.containerBg} side="right" />
            {rows.map((row, ri) => {
              const anim = ri % 2 === 0 ? 'vsr2-scroll-ltr' : 'vsr2-scroll-rtl';
              const dur = cfg.dur + ri * 2;
              return (
                <div key={ri} style={{ overflow: 'hidden', width: '100%' }}>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    animation: `${anim} ${dur}s linear infinite`,
                    width: 'max-content',
                  }}>
                    {[...row, ...row].map((r, i) => {
                      const [from, to] = avatarGradient(r.name);
                      const tplDef = tpl;
                      const shadow = tplDef.shadow(shadowIntensity);
                      const radius = getBorderRadius(borderRadius);
                      return (
                        <div
                          key={i}
                          style={{
                            width: `${cfg.cardW}px`,
                            flexShrink: 0,
                            background: tplDef.cardBg,
                            border: `1px solid ${tplDef.border}`,
                            borderRadius: radius,
                            boxShadow: shadow,
                            padding: '14px 16px',
                            ...(tplDef.isGlass ? { backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } : {}),
                          }}
                        >
                          {cfg.avatarSize && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
                              <div style={{
                                width: '28px', height: '28px', minWidth: '28px',
                                borderRadius: '50%',
                                background: `linear-gradient(145deg, ${from}, ${to})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '10px', fontWeight: 700,
                              }}>{r.initials}</div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ color: tplDef.name, fontSize: '11.5px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                                <div style={{ color: tplDef.role, fontSize: '9.5px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.role}</div>
                              </div>
                            </div>
                          )}
                          <Stars rating={r.rating} color={starColor} size={12} />
                          <p style={{
                            color: tplDef.body, fontSize: '11.5px', lineHeight: 1.58, marginTop: '7px',
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                          }}>{r.text.slice(0, cfg.textLen)}{r.text.length > cfg.textLen ? '…' : ''}</p>
                          {!cfg.avatarSize && (
                            <div style={{ color: tplDef.name, fontSize: '11px', fontWeight: 600, marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* ── MARQUEE ── */}
      {layout === 'marquee' && (
        <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
          <EdgeMask containerBg={tpl.containerBg} side="left" />
          <EdgeMask containerBg={tpl.containerBg} side="right" />
          <div style={{ display: 'flex', gap: '12px', animation: 'vsr2-scroll-ltr 20s linear infinite', width: 'max-content' }}>
            {[...reviews, ...reviews, ...reviews].map((r, i) => {
              const [from, to] = avatarGradient(r.name);
              return (
                <div key={i} style={{
                  width: '240px', flexShrink: 0,
                  background: tpl.cardBg, border: `1px solid ${tpl.border}`,
                  borderRadius: getBorderRadius(borderRadius),
                  boxShadow: tpl.shadow(shadowIntensity),
                  padding: '14px 16px',
                  ...(tpl.isGlass ? { backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } : {}),
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
                    <div style={{ width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%', background: `linear-gradient(145deg, ${from}, ${to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 700 }}>{r.initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: tpl.name, fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                    </div>
                  </div>
                  <Stars rating={r.rating} color={starColor} size={12} />
                  <p style={{ color: tpl.body, fontSize: '11.5px', lineHeight: 1.55, marginTop: '7px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{r.text.slice(0, 75)}…</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SPOTLIGHT ── */}
      {layout === 'spotlight' && reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '12px 16px' }}>
          <div style={{ fontSize: '64px', lineHeight: 1, color: primaryColor, opacity: 0.25, fontFamily: 'Georgia, serif', marginBottom: '4px', userSelect: 'none' }}>&ldquo;</div>
          <AnimatedStars rating={reviews[0].rating} color={starColor} size={18} animate={animations} delay={0} />
          <p style={{
            color: tpl.body, fontSize: '16px', lineHeight: 1.68, marginTop: '16px',
            maxWidth: '480px', fontStyle: 'italic', fontWeight: 400,
          }}>{reviews[0].text}</p>
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {showAvatar && (() => {
              const [from, to] = avatarGradient(reviews[0].name);
              return (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(145deg, ${from}, ${to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700 }}>
                  {reviews[0].initials}
                </div>
              );
            })()}
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: tpl.name, fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em' }}>{reviews[0].name}</div>
              <div style={{ color: tpl.role, fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '1px' }}>{reviews[0].role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '20px' }}>
            {reviews.map((_, i) => (
              <div key={i} style={{
                width: i === 0 ? '20px' : '6px', height: '6px', borderRadius: '3px',
                background: i === 0 ? primaryColor : (tpl.isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.10)'),
                transition: 'all 200ms',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── SUMMARY ── */}
      {layout === 'summary' && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: tpl.cardBg,
            border: `1px solid ${tpl.border}`,
            borderRadius: getBorderRadius(borderRadius),
            boxShadow: tpl.shadow(shadowIntensity),
            padding: '28px 32px',
            width: '100%',
            maxWidth: '380px',
            ...(tpl.isGlass ? { backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' } : {}),
          }}>
            {/* Score row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <AnimatedScoreCount target={4.8} color={primaryColor} animate={animations} />
              <div>
                <AnimatedStars rating={5} color={starColor} size={16} animate={animations} delay={500} />
                <div style={{ color: tpl.role, fontSize: '11px', marginTop: '4px', fontWeight: 500 }}>Based on {reviews.length * 12} reviews</div>
              </div>
            </div>
            {/* Rating bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {[{ stars: 5, pct: 72 }, { stars: 4, pct: 18 }, { stars: 3, pct: 6 }, { stars: 2, pct: 3 }, { stars: 1, pct: 1 }].map(row => (
                <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: tpl.role, fontSize: '11px', width: '10px', textAlign: 'right', flexShrink: 0 }}>{row.stars}</span>
                  <span style={{ color: starColor, fontSize: '11px', flexShrink: 0 }}>★</span>
                  <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: tpl.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                    <div style={{ width: `${row.pct}%`, height: '100%', borderRadius: '3px', background: `linear-gradient(to right, ${starColor}, ${primaryColor})` }} />
                  </div>
                  <span style={{ color: tpl.role, fontSize: '10px', width: '28px', textAlign: 'right', flexShrink: 0 }}>{row.pct}%</span>
                </div>
              ))}
            </div>
            {/* Google attribution */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${tpl.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              <GoogleIcon size={16} />
              <span style={{ color: tpl.role, fontSize: '11px', fontWeight: 500 }}>Verified Google Reviews</span>
            </div>
          </div>
        </div>
      )}

      {/* ── BADGE ── */}
      {layout === 'badge' && reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: `${gap}px` }}>
          <div style={{ width: '100%', maxWidth: '320px' }}>
            <ReviewCard review={reviews[0]} {...cardProps} />
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '999px',
            background: primaryColor, color: '#ffffff',
            fontSize: '13px', fontWeight: 600,
            boxShadow: `0 4px 16px ${primaryColor}50`,
          }}>
            <span>★</span>
            <span>4.8</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{reviews.length * 20} reviews</span>
          </div>
        </div>
      )}

      {/* ── POPUP ── */}
      {layout === 'popup' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '20px' }}>
          <p style={{ color: tpl.role, fontSize: '13px', textAlign: 'center' }}>Widget renders as a floating button on your site</p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '14px 24px', borderRadius: '999px',
            background: `linear-gradient(135deg, ${primaryColor}, #6d28d9)`,
            color: '#fff', fontSize: '15px', fontWeight: 600,
            boxShadow: `0 8px 30px ${primaryColor}55`,
            cursor: 'default',
          }}>
            <span style={{ fontSize: '18px' }}>⭐</span>
            See our reviews
          </div>
        </div>
      )}

      {/* ── QUOTE ── */}
      {layout === 'quote' && reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '12px 20px' }}>
          <div style={{ fontSize: '72px', lineHeight: 1, fontFamily: 'Georgia, serif', color: primaryColor, opacity: 0.18, userSelect: 'none', marginBottom: '8px' }}>&ldquo;</div>
          <AnimatedStars rating={reviews[0].rating} color={starColor} size={16} animate={animations} delay={0} />
          <p style={{ color: tpl.body, fontSize: '15px', lineHeight: 1.7, marginTop: '14px', maxWidth: '420px', fontStyle: 'italic' }}>{reviews[0].text}</p>
          <div style={{ color: tpl.name, fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>— {reviews[0].name}</div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
            {reviews.map((_, i) => (
              <div key={i} style={{
                width: i === 0 ? '18px' : '6px', height: '6px', borderRadius: '3px',
                background: i === 0 ? primaryColor : (tpl.isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.10)'),
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── COMPARISON ── */}
      {layout === 'comparison' && reviews.length >= 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${gap}px` }}>
          {reviews.slice(0, 2).map((r, i) => (
            <ReviewCard key={i} review={r} {...cardProps} animDelay={animations ? i * 80 : 0} />
          ))}
        </div>
      )}

      {/* ── MOBILE STACK ── */}
      {layout === 'mobile-stack' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, maxWidth: '440px', margin: '0 auto', width: '100%' }}>
          {reviews.slice(0, 3).map((r, i) => (
            <div
              key={i}
              className={`vsr2-card vsr2-hover-${shadowIntensity?.toLowerCase() || 'soft'}`}
              data-vsr2-hover-shadow={tpl.hoverShadow(shadowIntensity)}
              style={{
                background: tpl.cardBg,
                border: `1px solid ${tpl.border}`,
                borderRadius: getBorderRadius(borderRadius),
                boxShadow: tpl.shadow(shadowIntensity),
                padding: '24px 26px',
                transition: 'transform 220ms cubic-bezier(0.16,1,0.3,1), box-shadow 220ms cubic-bezier(0.16,1,0.3,1)',
                animationDelay: animations ? `${i * 70}ms` : '0ms',
                ...(tpl.isGlass ? { backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' } : {}),
              }}
            >
              {(() => {
                const [from, to] = avatarGradient(r.name);
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      {showAvatar && (
                        <div style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '50%', background: `linear-gradient(145deg, ${from}, ${to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                          {r.initials}
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: tpl.name, fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>{r.name}</div>
                        <div style={{ color: tpl.role, fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '2px' }}>{r.role}</div>
                      </div>
                    </div>
                    <Stars rating={r.rating} color={starColor} size={16} />
                    <p style={{ color: tpl.body, fontSize: '14.5px', lineHeight: 1.68, marginTop: '12px' }}>{r.text}</p>
                    {showDate && <div style={{ color: tpl.date, fontSize: '12px', marginTop: '12px' }}>{r.date}</div>}
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {/* ── WRITE A REVIEW CTA ── */}
      {showWriteReview && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', padding: layout.startsWith('wall') || layout === 'marquee' ? '0 24px' : '0' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '999px',
            background: primaryColor, color: '#fff', fontSize: '13px', fontWeight: 600,
            cursor: 'default',
            boxShadow: `0 4px 18px ${primaryColor}40`,
          }}>
            <GoogleIcon size={14} />
            Write a Review
          </div>
        </div>
      )}

      {/* ── VISSAR BRANDING (free plan) ── */}
      {!removeBranding && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
          marginTop: '18px',
          padding: layout.startsWith('wall') || layout === 'marquee' ? '0 24px' : '0',
          opacity: 0.7,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-icon.png"
            alt=""
            aria-hidden="true"
            style={{ width: '14px', height: '14px', borderRadius: '3px', display: 'block' }}
          />
          <span style={{ fontSize: '11px', fontWeight: 500, color: tpl.isDark ? '#94a3b8' : '#6b7280' }}>
            Powered by{' '}
            <span style={{
              fontWeight: 700,
              background: 'linear-gradient(to right, #7c3aed, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              vissar
            </span>
          </span>
        </div>
      )}

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @keyframes vsr2-scroll-ltr {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes vsr2-scroll-rtl {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        @keyframes vsr2-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vsr2-card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}