'use client';

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

function Stars({ rating, starColor = '#F59E0B' }: { rating: number; starColor?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{ color: i <= rating ? starColor : '#475569' }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function getCardClasses(
  template: string,
  shadowIntensity: string = 'Soft',
  borderRadius: number = 12
): string {
  const radiusClass = borderRadius === 0 ? 'rounded-none' : borderRadius <= 8 ? 'rounded-lg' : borderRadius <= 16 ? 'rounded-xl' : 'rounded-2xl';
  
  const shadowClass = {
    'None': '',
    'Soft': 'shadow-md',
    'Medium': 'shadow-lg',
    'Strong': 'shadow-xl',
  }[shadowIntensity] || 'shadow-md';

  switch (template) {
    case 'glass':
      return `bg-white/10 backdrop-blur-xl border border-white/20 text-white ${radiusClass}`;
    case 'minimal':
      return `bg-transparent border border-slate-300 text-slate-800 ${radiusClass}`;
    case 'darkElegant':
      return `bg-slate-800 border border-slate-700 text-slate-100 ${radiusClass} ${shadowClass}`;
    case 'gradientBorder':
      return `bg-white border-2 border-transparent text-slate-800 [background-clip:padding-box] ring-2 ring-violet-500/50 ${radiusClass}`;
    case 'neon':
      return `bg-slate-950 border border-cyan-400 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.3)] ${radiusClass}`;
    case 'aurora':
      return `bg-gradient-to-br from-violet-100/80 to-indigo-100/80 border border-violet-200/50 text-slate-800 backdrop-blur-sm ${radiusClass}`;
    case 'spotlight':
      return `bg-white border border-slate-100 text-slate-800 shadow-[4px_4px_20px_rgba(0,0,0,0.12)] ${radiusClass}`;
    case 'classic':
      return `bg-white border-2 border-slate-400 text-slate-800 rounded-none`;
    case 'warm':
      return `bg-amber-50 border border-amber-200/60 text-amber-900 shadow-sm ${radiusClass}`;
    case 'soft':
    default:
      return `bg-white border border-slate-100 ${shadowClass} text-slate-800 ${radiusClass}`;
  }
}

function getContainerBg(template: string, colorScheme: string = 'auto'): string {
  if (colorScheme === 'dark') return 'bg-slate-900';
  if (colorScheme === 'light') return 'bg-slate-50';
  
  switch (template) {
    case 'glass':
      return 'bg-gradient-to-br from-violet-900/60 to-indigo-900/60';
    case 'darkElegant':
    case 'neon':
      return 'bg-slate-900';
    case 'classic':
    case 'minimal':
      return 'bg-slate-100';
    case 'warm':
      return 'bg-amber-100/50';
    case 'soft':
    case 'gradientBorder':
    case 'aurora':
    case 'spotlight':
    default:
      return 'bg-slate-50';
  }
}

function getTextClasses(template: string): { name: string; role: string; body: string; date: string } {
  const isDark = template === 'glass' || template === 'darkElegant' || template === 'neon';
  const isWarm = template === 'warm';
  return {
    name: isDark ? 'text-white' : isWarm ? 'text-amber-900' : 'text-slate-900',
    role: isDark ? 'text-slate-400' : isWarm ? 'text-amber-700/70' : 'text-slate-500',
    body: isDark ? 'text-slate-300' : isWarm ? 'text-amber-800/80' : 'text-slate-600',
    date: isDark ? 'text-slate-500' : isWarm ? 'text-amber-700/60' : 'text-slate-400',
  };
}

function getAnimationClass(animationStyle: string = 'slideUp', animations: boolean = true): string {
  if (!animations) return '';
  
  switch (animationStyle) {
    case 'fadeIn':
      return 'animate-fadeIn';
    case 'slideUp':
      return 'animate-slideUp';
    case 'scaleIn':
      return 'animate-scaleIn';
    default:
      return 'animate-slideUp';
  }
}

function ReviewCard({
  review,
  template,
  shadowIntensity,
  borderRadius,
  showAvatar = true,
  showDate = true,
  starColor,
  animationStyle,
  animations,
}: {
  review: typeof MOCK_REVIEWS[0];
  template: string;
  shadowIntensity?: string;
  borderRadius?: number;
  showAvatar?: boolean;
  showDate?: boolean;
  starColor?: string;
  animationStyle?: string;
  animations?: boolean;
}) {
  const cardClasses = getCardClasses(template, shadowIntensity, borderRadius);
  const txt = getTextClasses(template);
  const animationClass = getAnimationClass(animationStyle, animations);

  return (
    <div
      className={`p-5 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${cardClasses} ${animationClass}`}
    >
      <div className="flex items-center gap-3 mb-3">
        {showAvatar && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {review.initials}
          </div>
        )}
        <div className="min-w-0">
          <div className={`font-semibold text-sm ${txt.name}`}>{review.name}</div>
          <div className={`text-xs ${txt.role}`}>{review.role}</div>
        </div>
      </div>
      <Stars rating={review.rating} starColor={starColor} />
      <p className={`text-sm mt-2 leading-relaxed line-clamp-3 ${txt.body}`}>{review.text}</p>
      {showDate && <div className={`text-xs mt-3 ${txt.date}`}>{review.date}</div>}
    </div>
  );
}

export default function WidgetPreview({
  layout,
  template,
  maxReviews,
  animations = true,
  primaryColor = '#7C3AED',
  borderRadius = 12,
  shadowIntensity = 'Soft',
  cardSpacing = 16,
  showAvatar = true,
  showDate = true,
  animationStyle = 'slideUp',
  starColor = '#F59E0B',
  colorScheme = 'auto',
  showHeader = false,
  headerText = '',
  showWriteReview = false,
}: WidgetPreviewProps) {
  const reviews = MOCK_REVIEWS.slice(0, maxReviews);
  const containerBg = getContainerBg(template, colorScheme);
  const gapStyle = { gap: `${cardSpacing}px` };
  const isDark = ['glass', 'darkElegant', 'neon'].includes(template) || colorScheme === 'dark';

  return (
    <div className={`p-4 min-h-full overflow-x-hidden w-full max-w-full flex flex-col ${containerBg}`}>
      {/* Custom section heading */}
      {showHeader && headerText && (
        <div className="mb-5 text-center">
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {headerText}
          </h3>
          <div className="w-12 h-0.5 mx-auto mt-2 rounded-full" style={{ backgroundColor: primaryColor }} />
        </div>
      )}
      {layout === 'carousel' && reviews.length > 0 && (
        <div className="flex flex-col items-center overflow-hidden w-full" style={gapStyle}>
          <div className="w-full max-w-sm min-w-0">
            <ReviewCard
              review={reviews[0]}
              template={template}
              shadowIntensity={shadowIntensity}
              borderRadius={borderRadius}
              showAvatar={showAvatar}
              showDate={showDate}
              starColor={starColor}
              animationStyle={animationStyle}
              animations={animations}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">1 / {reviews.length}</span>
          </div>
        </div>
      )}

      {layout === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2" style={gapStyle}>
          {reviews.slice(0, 4).map((review, i) => (
            <ReviewCard
              key={i}
              review={review}
              template={template}
              shadowIntensity={shadowIntensity}
              borderRadius={borderRadius}
              showAvatar={showAvatar}
              showDate={showDate}
              starColor={starColor}
              animationStyle={animationStyle}
              animations={animations}
            />
          ))}
        </div>
      )}

      {layout === 'list' && (
        <div className="flex flex-col" style={gapStyle}>
          {reviews.slice(0, 3).map((review, i) => (
            <ReviewCard
              key={i}
              review={review}
              template={template}
              shadowIntensity={shadowIntensity}
              borderRadius={borderRadius}
              showAvatar={showAvatar}
              showDate={showDate}
              starColor={starColor}
              animationStyle={animationStyle}
              animations={animations}
            />
          ))}
        </div>
      )}

      {layout === 'badge' && reviews.length > 0 && (
        <div className="flex flex-col items-end" style={gapStyle}>
          <div className="w-full max-w-xs">
            <ReviewCard
              review={reviews[0]}
              template={template}
              shadowIntensity={shadowIntensity}
              borderRadius={borderRadius}
              showAvatar={showAvatar}
              showDate={showDate}
              starColor={starColor}
              animationStyle={animationStyle}
              animations={animations}
            />
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <span>★</span>
            <span>4.8</span>
            <span className="opacity-70">·</span>
            <span>{reviews.length} reviews</span>
          </div>
        </div>
      )}

      {layout === 'marquee' && (
        <div className="relative overflow-hidden w-full">
          <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-violet-600/80 text-[10px] text-white font-medium">
            → scrolling
          </div>
          <div className="flex overflow-hidden w-full" style={{ gap: `${cardSpacing}px` }}>
            {reviews.slice(0, 3).map((review, i) => (
              <div
                key={i}
                className={`flex-shrink-0 rounded-lg p-3 w-[160px] min-w-0 ${getCardClasses(template, shadowIntensity, borderRadius)}`}
              >
                <Stars rating={review.rating} starColor={starColor} />
                <p className={`text-xs mt-1 line-clamp-2 ${getTextClasses(template).body}`}>
                  {review.text.slice(0, 60)}...
                </p>
                <div className={`text-xs mt-1 font-medium truncate ${getTextClasses(template).name}`}>{review.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {layout === 'masonry' && (
        <div className="grid grid-cols-2" style={gapStyle}>
          {reviews.slice(0, 4).map((review, i) => (
            <div key={i} className="break-inside-avoid">
              <ReviewCard
                review={review}
                template={template}
                shadowIntensity={shadowIntensity}
                borderRadius={borderRadius}
                showAvatar={showAvatar}
                showDate={showDate}
                starColor={starColor}
                animationStyle={animationStyle}
                animations={animations}
              />
            </div>
          ))}
        </div>
      )}

      {layout === 'wall' && (
        <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: `${Math.max(4, cardSpacing / 4)}px` }}>
          {reviews.map((review, i) => (
            <div
              key={i}
              className={`rounded-lg p-2.5 text-xs hover:shadow-lg transition-shadow min-w-0 overflow-hidden ${getCardClasses(template, shadowIntensity, borderRadius)}`}
            >
              <Stars rating={review.rating} starColor={starColor} />
              <p className={`mt-1 leading-snug line-clamp-3 ${getTextClasses(template).body}`}>
                {review.text.slice(0, 80)}...
              </p>
              <div className={`mt-1 font-semibold text-[11px] truncate ${getTextClasses(template).name}`}>{review.name}</div>
            </div>
          ))}
        </div>
      )}

      {(layout === 'wall-sm' || layout === 'wall-md' || layout === 'wall-lg') && (() => {
        // wall-sm: compact, no avatar, 2 rows, narrow cards
        // wall-md: medium cards, 2 rows, avatar + name + role
        // wall-lg: full-size cards like grid layout, 3 rows, avatar + name + role
        const isLg = layout === 'wall-lg';
        const isMd = layout === 'wall-md';
        const isSm = layout === 'wall-sm';

        const cfg = isSm
          ? { rows: 2, cardW: 150, textLen: 60, showAvatar: false, showRole: false, padding: 'p-2.5', fontSize: 'text-[10px]', nameSize: 'text-[10px]' }
          : isMd
          ? { rows: 2, cardW: 220, textLen: 90, showAvatar: true, showRole: true, padding: 'p-3', fontSize: 'text-xs', nameSize: 'text-xs' }
          : { rows: 3, cardW: 280, textLen: 130, showAvatar: true, showRole: true, padding: 'p-4', fontSize: 'text-sm', nameSize: 'text-sm' };

        // Distribute reviews across rows
        const allReviews = [...reviews, ...reviews, ...reviews].slice(0, Math.max(reviews.length * 2, 8));
        const perRow = Math.ceil(allReviews.length / cfg.rows);
        const rowSets = Array.from({ length: cfg.rows }, (_, i) =>
          allReviews.slice(i * perRow, (i + 1) * perRow)
        ).filter(r => r.length > 0);

        return (
          <div className="flex flex-col justify-center gap-2 overflow-hidden w-full max-w-full flex-1">
            {rowSets.map((rowReviews, rowIdx) => (
              <div key={rowIdx} className="overflow-hidden w-full max-w-full">
                <div
                  className="flex gap-2"
                  style={{
                    animation: `vissar-preview-scroll-${rowIdx % 2} ${isLg ? 18 : 14}s linear infinite`,
                    width: 'max-content',
                  }}
                >
                  {[...rowReviews, ...rowReviews].map((review, i) => (
                    <div
                      key={i}
                      style={{ width: cfg.cardW, flex: `0 0 ${cfg.cardW}px` }}
                      className={`rounded-xl hover:shadow-lg transition-shadow ${cfg.padding} ${getCardClasses(template, shadowIntensity, borderRadius)}`}
                    >
                      {/* Avatar + name row for md/lg */}
                      {cfg.showAvatar && (
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                            style={{ fontSize: '10px', backgroundColor: primaryColor || '#7C3AED' }}
                          >
                            {review.initials}
                          </div>
                          <div className="min-w-0">
                            <div className={`font-semibold truncate ${cfg.nameSize} ${getTextClasses(template).name}`}>
                              {review.name}
                            </div>
                            {cfg.showRole && (
                              <div className={`text-[10px] truncate ${getTextClasses(template).role}`}>
                                {review.role}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <Stars rating={review.rating} starColor={starColor} />
                      <p className={`mt-1.5 leading-snug line-clamp-3 ${cfg.fontSize} ${getTextClasses(template).body}`}>
                        {review.text.slice(0, cfg.textLen)}{review.text.length > cfg.textLen ? '…' : ''}
                      </p>
                      {/* Name at bottom for sm (no avatar) */}
                      {!cfg.showAvatar && (
                        <div className={`mt-1.5 font-semibold text-[10px] truncate ${getTextClasses(template).name}`}>
                          {review.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <style>{`
              @keyframes vissar-preview-scroll-0 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
              @keyframes vissar-preview-scroll-1 { from { transform: translateX(-50%); } to { transform: translateX(0); } }
            `}</style>
          </div>
        );
      })()}

      {layout === 'spotlight' && reviews.length > 0 && (
        <div className="flex flex-col items-center text-center px-4">
          <span
            className="text-5xl font-serif leading-none mb-2"
            style={{ color: primaryColor }}
          >
            &ldquo;
          </span>
          <Stars rating={reviews[0].rating} starColor={starColor} />
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
        <div className={`rounded-xl p-6 max-w-sm mx-auto ${getCardClasses(template, shadowIntensity, borderRadius)}`}>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-4xl font-bold"
              style={{ color: primaryColor }}
            >
              4.8
            </span>
            <div>
              <Stars rating={5} starColor={starColor} />
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
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${row.pct}%`, backgroundColor: starColor }}
                  />
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

      {layout === 'popup' && (
        <div className="flex flex-col items-center justify-center min-h-[200px] relative">
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Widget renders as a floating button on your site
          </p>
          <div
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold shadow-lg cursor-default"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)' }}
          >
            <span style={{ fontSize: '18px' }}>⭐</span>
            See our reviews
          </div>
        </div>
      )}

      {layout === 'quote' && reviews.length > 0 && (
        <div className="flex flex-col items-center text-center px-6 py-4">
          <span
            className="text-6xl font-serif leading-none mb-2"
            style={{ color: primaryColor, opacity: 0.6 }}
          >
            &ldquo;
          </span>
          <Stars rating={reviews[0].rating} starColor={starColor} />
          <p className={`text-base mt-4 leading-relaxed max-w-sm italic ${getTextClasses(template).body}`}>
            {reviews[0].text}
          </p>
          <div className="mt-4">
            <div className={`font-semibold text-sm ${getTextClasses(template).name}`}>
              — {reviews[0].name}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {reviews.slice(0, Math.min(reviews.length, 5)).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: i === 0 ? (primaryColor || '#7c3aed') : (isDark ? '#4b5563' : '#d1d5db') }}
              />
            ))}
          </div>
        </div>
      )}

      {layout === 'comparison' && reviews.length >= 2 && (
        <div className="grid grid-cols-2" style={gapStyle}>
          {reviews.slice(0, 2).map((review, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span
                className="text-4xl font-serif leading-none mb-2"
                style={{ color: primaryColor, opacity: 0.5 }}
              >
                &ldquo;
              </span>
              <ReviewCard
                review={review}
                template={template}
                shadowIntensity={shadowIntensity}
                borderRadius={borderRadius}
                showAvatar={showAvatar}
                showDate={showDate}
                starColor={starColor}
                animationStyle={animationStyle}
                animations={animations}
              />
            </div>
          ))}
        </div>
      )}

      {layout === 'mobile-stack' && (
        <div className="flex flex-col max-w-md mx-auto" style={gapStyle}>
          {reviews.slice(0, 3).map((review, i) => (
            <div
              key={i}
              className={`p-6 transition-all duration-200 hover:shadow-xl ${getCardClasses(template, shadowIntensity, borderRadius)} ${getAnimationClass(animationStyle, animations)}`}
            >
              <div className="flex items-center gap-3 mb-4">
                {showAvatar && (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-base font-semibold shrink-0">
                    {review.initials}
                  </div>
                )}
                <div className="min-w-0">
                  <div className={`font-semibold text-base ${getTextClasses(template).name}`}>{review.name}</div>
                  <div className={`text-sm ${getTextClasses(template).role}`}>{review.role}</div>
                </div>
              </div>
              <Stars rating={review.rating} starColor={starColor} />
              <p className={`text-base mt-3 leading-relaxed ${getTextClasses(template).body}`}>{review.text}</p>
              {showDate && <div className={`text-sm mt-4 ${getTextClasses(template).date}`}>{review.date}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Write a Review CTA */}
      {showWriteReview && (
        <div className="mt-5 flex justify-center">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white cursor-default"
            style={{ backgroundColor: primaryColor }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Write a Review
          </div>
        </div>
      )}
    </div>
  );
}