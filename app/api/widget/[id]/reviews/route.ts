import { NextResponse } from 'next/server';
import { getWidget } from '@/lib/services/widget.service';
import { getUserPlanAsync, planLimitForTier } from '@/lib/plans';
import { getReviews } from '@/lib/services/review.service';
import { getUserById } from '@/lib/services/user.service';

export const dynamic = "force-dynamic";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Support both Next.js 14 promise params and object params
    const resolvedParams = params instanceof Promise ? await params : params;
    const widgetId = resolvedParams.id;

    const widget = await getWidget(widgetId);

    if (!widget) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404, headers: corsHeaders });
    }

    // All settings live in config jsonb — extract with defaults
    const cfg = (widget.config as Record<string, unknown>) ?? {};

    const { searchParams } = new URL(request.url);
    const maxReviews = parseInt(searchParams.get('maxReviews') || String(cfg.maxReviews ?? 5), 10);
    const minRating = parseInt(searchParams.get('minRating') || String(cfg.minRating ?? 1), 10);

    const placeId = widget.placeId || 'mock';
    const reviewResult = await getReviews(placeId, maxReviews, minRating);

    // Get user plan for tier/viewLimit
    // widget.userId is the OAuth sub ID — resolve to email since plans are keyed by email
    const widgetOwner = await getUserById(widget.userId);
    const userEmail = widgetOwner?.email ?? widget.userId;
    const plan = await getUserPlanAsync(userEmail);
    const tier = plan.plan || 'free';
    const viewLimit = planLimitForTier(tier);

    return NextResponse.json({
      widget: {
        id: widget.id,
        name: widget.name,
        layout: widget.layout,
        autoStyle: cfg.autoStyle ?? true,
        tier,
        viewLimit,
        removeBranding: cfg.removeBranding ?? false,
        template: cfg.template ?? 'soft',
        showHeader: cfg.showHeader ?? false,
        showHighlights: cfg.showHighlights ?? false,
        showVerifiedBadge: cfg.showVerifiedBadge ?? true,
        showAvatar: cfg.showAvatar ?? true,
        showDate: cfg.showDate ?? true,
        animations: cfg.animations ?? true,
        animationStyle: cfg.animationStyle ?? 'slideUp',
        colorScheme: cfg.colorScheme ?? 'auto',
        sortBy: cfg.sortBy ?? null,
        textLength: cfg.textLength ?? 150,
        starColor: cfg.starColor ?? null,
        primaryColor: cfg.primaryColor ?? null,
        language: cfg.language ?? 'all',
        dateRange: cfg.dateRange ?? 'all',
        showSentimentBadges: cfg.showSentimentBadges ?? true,
        showReplies: cfg.showReplies ?? true,
        customCss: cfg.customCss ?? null,
      },
      business: reviewResult.business,
      reviews: reviewResult.reviews,
      lastUpdated: reviewResult.lastUpdated,
      source: reviewResult.source,
      cached: reviewResult.cached,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('[widget/reviews] Error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
