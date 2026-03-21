'use client';

import { useState } from 'react';

interface WidgetPreviewProps {
  layout: string;
  template: string;
  maxReviews: number;
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

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? 'text-amber-400' : 'text-slate-600'}>
          ★
        </span>
      ))}
    </div>
  );
}

function getCardClasses(template: string): string {
  switch (template) {
    case 'glass':
      return 'bg-white/10 backdrop-blur-xl border border-white/20 text-white';
    case 'minimal':
      return 'bg-transparent border border-slate-300 text-slate-800';
    case 'darkElegant':
      return 'bg-slate-800 border border-slate-700 text-slate-100';
    case 'gradientBorder':
      return 'bg-white border-2 border-transparent text-slate-800 [background-clip:padding-box] ring-2 ring-violet-500/50';
    case 'soft':
    default:
      return 'bg-white border border-slate-100 shadow-lg shadow-slate-200/50 text-slate-800';
  }
}

function getContainerBg(template: string): string {
  switch (template) {
    case 'glass':
      return 'bg-gradient-to-br from-violet-900/60 to-indigo-900/60';
    case 'darkElegant':
      return 'bg-slate-900';
    case 'minimal':
    case 'soft':
    case 'gradientBorder':
    default:
      return 'bg-slate-50';
  }
}

function getTextClasses(template: string): { name: string; role: string; body: string; date: string } {
  const isDark = template === 'glass' || template === 'darkElegant';
  return {
    name: isDark ? 'text-white' : 'text-slate-900',
    role: isDark ? 'text-slate-400' : 'text-slate-500',
    body: isDark ? 'text-slate-300' : 'text-slate-600',
    date: isDark ? 'text-slate-500' : 'text-slate-400',
  };
}

function ReviewCard({ review, template }: { review: typeof MOCK_REVIEWS[0]; template: string }) {
  const cardClasses = getCardClasses(template);
  const txt = getTextClasses(template);

  return (
    <div
      className={`rounded-xl p-5 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${cardClasses}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
          {review.initials}
        </div>
        <div className="min-w-0">
          <div className={`font-semibold text-sm ${txt.name}`}>{review.name}</div>
          <div className={`text-xs ${txt.role}`}>{review.role}</div>
        </div>
      </div>
      <Stars rating={review.rating} />
      <p className={`text-sm mt-2 leading-relaxed line-clamp-3 ${txt.body}`}>{review.text}</p>
      <div className={`text-xs mt-3 ${txt.date}`}>{review.date}</div>
    </div>
  );
}

export default function WidgetPreview({ layout, template, maxReviews }: WidgetPreviewProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const reviews = MOCK_REVIEWS.slice(0, maxReviews);
  const containerBg = getContainerBg(template);

  const prev = () => setCarouselIndex((i) => (i - 1 + reviews.length) % reviews.length);
  const next = () => setCarouselIndex((i) => (i + 1) % reviews.length);

  return (
    <div className={`rounded-xl p-6 min-h-[350px] ${containerBg}`}>
      {layout === 'carousel' && reviews.length > 0 && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-sm">
            <ReviewCard review={reviews[carouselIndex % reviews.length]} template={template} />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full bg-slate-800/60 text-white flex items-center justify-center hover:bg-violet-600 transition-colors text-sm"
            >
              ‹
            </button>
            <span className="text-xs text-slate-400">
              {carouselIndex + 1} / {reviews.length}
            </span>
            <button
              onClick={next}
              className="w-8 h-8 rounded-full bg-slate-800/60 text-white flex items-center justify-center hover:bg-violet-600 transition-colors text-sm"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {layout === 'grid' && (
        <div className="grid grid-cols-2 gap-4">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} template={template} />
          ))}
        </div>
      )}

      {layout === 'list' && (
        <div className="flex flex-col gap-4">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} template={template} />
          ))}
        </div>
      )}

      {layout === 'badge' && reviews.length > 0 && (
        <div className="flex flex-col items-end gap-3">
          <div className="w-full max-w-xs">
            <ReviewCard review={reviews[0]} template={template} />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-medium shadow-lg">
            <span className="text-amber-300">★</span>
            <span>4.8</span>
            <span className="text-violet-200">·</span>
            <span>{reviews.length} reviews</span>
          </div>
        </div>
      )}

      {layout === 'marquee' && (
        <div className="relative overflow-hidden">
          <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-violet-600/80 text-[10px] text-white font-medium">
            → scrolling
          </div>
          <div className="flex gap-3 animate-pulse">
            {reviews.slice(0, 3).map((review, i) => (
              <div key={i} className={`flex-shrink-0 rounded-lg p-3 min-w-[180px] ${getCardClasses(template)}`}>
                <Stars rating={review.rating} />
                <p className={`text-xs mt-1 ${getTextClasses(template).body}`}>
                  {review.text.slice(0, 60)}...
                </p>
                <div className={`text-xs mt-1 font-medium ${getTextClasses(template).name}`}>{review.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {layout === 'masonry' && (
        <div style={{ columnCount: 2, columnGap: '1rem' }}>
          {reviews.map((review, i) => (
            <div key={i} className="mb-4 break-inside-avoid">
              <ReviewCard review={review} template={template} />
            </div>
          ))}
        </div>
      )}

      {layout === 'wall' && (
        <div className="grid grid-cols-3 gap-2">
          {reviews.map((review, i) => (
            <div key={i} className={`rounded-lg p-2.5 text-xs hover:shadow-lg transition-shadow ${getCardClasses(template)}`}>
              <Stars rating={review.rating} />
              <p className={`mt-1 leading-snug ${getTextClasses(template).body}`}>
                {review.text.slice(0, 80)}...
              </p>
              <div className={`mt-1 font-semibold text-[11px] ${getTextClasses(template).name}`}>{review.name}</div>
            </div>
          ))}
        </div>
      )}

      {layout === 'spotlight' && reviews.length > 0 && (
        <div className="flex flex-col items-center text-center px-4">
          <span className="text-5xl text-violet-500 font-serif leading-none mb-2">&ldquo;</span>
          <Stars rating={reviews[0].rating} />
          <p className={`text-base mt-3 leading-relaxed max-w-sm ${getTextClasses(template).body}`}>
            {reviews[0].text}
          </p>
          <div className="mt-4">
            <div className={`font-semibold text-sm ${getTextClasses(template).name}`}>{reviews[0].name}</div>
            <div className={`text-xs ${getTextClasses(template).role}`}>{reviews[0].role}</div>
          </div>
        </div>
      )}

      {layout === 'summary' && (
        <div className={`rounded-xl p-6 max-w-sm mx-auto ${getCardClasses(template)}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-4xl font-bold ${getTextClasses(template).name}`}>4.8</span>
            <div>
              <Stars rating={5} />
              <div className={`text-xs mt-0.5 ${getTextClasses(template).role}`}>Based on {reviews.length} reviews</div>
            </div>
          </div>
          <div className="space-y-1.5">
            {[
              { stars: 5, pct: 72 },
              { stars: 4, pct: 18 },
              { stars: 3, pct: 6 },
              { stars: 2, pct: 3 },
              { stars: 1, pct: 1 },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-xs">
                <span className={`w-3 text-right ${getTextClasses(template).role}`}>{row.stars}</span>
                <div className={`flex-1 h-2 rounded-full overflow-hidden ${template === 'darkElegant' || template === 'glass' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                </div>
                <span className={`w-8 text-right ${getTextClasses(template).role}`}>{row.pct}%</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-slate-200/20">
            <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span className={`text-xs font-medium ${getTextClasses(template).role}`}>Powered by Google</span>
          </div>
        </div>
      )}
    </div>
  );
}
