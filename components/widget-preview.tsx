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
    </div>
  );
}
