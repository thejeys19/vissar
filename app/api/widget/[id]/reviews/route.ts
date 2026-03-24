import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { getWidget } from '@/lib/db';
import { getUserPlanAsync, planLimitForTier } from '@/lib/plans';
import { MOCK_REVIEWS, MOCK_BUSINESS } from '@/lib/mock-data';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places';
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

export const dynamic = "force-dynamic";

// CORS headers for widget embeds
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  relativeTime?: string;
}

interface ReviewData {
  business: { name: string; rating: number; totalReviews: number; placeId: string };
  reviews: ReviewItem[];
}

interface GoogleReview {
  name: string;
  text?: { text: string };
  authorAttribution: { displayName: string; photoUri?: string };
  rating: number;
  publishTime: string;
  relativePublishTimeDescription: string;
}

interface GooglePlace {
  reviews?: GoogleReview[];
  displayName: { text: string };
  rating?: number;
  userRatingCount?: number;
  id: string;
}

async function getCachedReviews(placeId: string): Promise<ReviewData | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    // The value might be stored as a string (from REST API) or an object (from SDK)
    const raw = await redis.get(`reviews:${placeId}`);
    if (!raw) return null;
    if (typeof raw === 'string') {
      try { return JSON.parse(raw) as ReviewData; } catch { return null; }
    }
    return raw as ReviewData;
  } catch {
    return null;
  }
}

async function setCachedReviews(placeId: string, data: ReviewData): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(`reviews:${placeId}`, data, { ex: CACHE_TTL_SECONDS });
  } catch (err) {
    console.error('Redis cache write error:', err);
  }
}

async function fetchGoogleReviews(placeId: string): Promise<ReviewData | null> {
  if (!GOOGLE_PLACES_API_KEY) return null;

  try {
    const response = await fetch(
      `${GOOGLE_PLACES_API_URL}/${placeId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews',
        },
      }
    );

    if (!response.ok) return null;

    const place: GooglePlace = await response.json();

    const reviews = (place.reviews || [])
      .filter((review: GoogleReview) => review.text?.text)
      .map((review: GoogleReview) => ({
        id: review.name.split('/').pop() || review.name,
        author: review.authorAttribution.displayName,
        avatar: review.authorAttribution.photoUri || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(review.authorAttribution.displayName)}&background=random`,
        rating: review.rating,
        text: review.text?.text || '',
        date: review.publishTime.split('T')[0],
        relativeTime: review.relativePublishTimeDescription,
      }));

    return {
      business: {
        name: place.displayName.text,
        rating: place.rating || 0,
        totalReviews: place.userRatingCount || 0,
        placeId: place.id,
      },
      reviews,
    };
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return null;
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
  const widgetId = params.id;
  
  // Get widget config from database
  const widget = await getWidget(widgetId);
  
  if (!widget) {
    return NextResponse.json(
      { error: 'Widget not found' },
      { status: 404, headers: corsHeaders }
    );
  }

  const { searchParams } = new URL(request.url);
  const maxReviews = parseInt(searchParams.get('maxReviews') || String(widget.maxReviews || 5), 10);
  const minRating = parseInt(searchParams.get('minRating') || String(widget.minRating || 1), 10);

  let data: ReviewData;
  let cacheHit = false;

  // Try to fetch real Google reviews
  if (widget.placeId && widget.placeId !== 'mock' && GOOGLE_PLACES_API_KEY) {
    // Check Redis cache first
    const cached = await getCachedReviews(widget.placeId);
    const cachedValid = cached && Array.isArray((cached as {reviews?: unknown}).reviews) && (cached as {reviews: unknown[]}).reviews.length > 0;
    if (cachedValid) {
      data = cached!;
      cacheHit = true;
    } else {
      const googleData = await fetchGoogleReviews(widget.placeId);
      if (googleData) {
        data = googleData;
        // Cache in Redis (fire-and-forget)
        setCachedReviews(widget.placeId, googleData);
      } else {
        data = { business: MOCK_BUSINESS, reviews: MOCK_REVIEWS };
      }
    }
  } else {
    data = { business: MOCK_BUSINESS, reviews: MOCK_REVIEWS };
  }

  // Ensure data has reviews (defensive fallback)
  if (!data || !Array.isArray(data.reviews)) {
    data = { business: MOCK_BUSINESS, reviews: MOCK_REVIEWS };
  }

  // Filter reviews
  const filteredReviews = data.reviews
    .filter((r: { rating: number }) => r.rating >= minRating)
    .slice(0, maxReviews);

  // Get user plan for tier/viewLimit
  const userEmail = widget.userId || (widget as {userEmail?: string}).userEmail || '';
  const plan = await getUserPlanAsync(userEmail);
  const tier = plan.plan || 'free';
  const viewLimit = planLimitForTier(tier);

  return NextResponse.json({
    widget: {
      id: widget.id,
      name: widget.name,
      layout: widget.layout,
      autoStyle: widget.autoStyle,
      tier,
      viewLimit,
      removeBranding: widget.removeBranding ?? false,
      template: widget.template,
      showHeader: widget.showHeader ?? false,
      showHighlights: widget.showHighlights ?? false,
      showVerifiedBadge: widget.showVerifiedBadge ?? true,
      showAvatar: widget.showAvatar ?? true,
      showDate: widget.showDate ?? true,
      animations: widget.animations ?? true,
      animationStyle: widget.animationStyle ?? 'slideUp',
      colorScheme: widget.colorScheme ?? 'auto',
      sortBy: widget.sortBy ?? null,
      textLength: widget.textLength ?? 150,
      starColor: widget.starColor ?? null,
      primaryColor: widget.primaryColor ?? null,
      language: widget.language ?? 'all',
      dateRange: widget.dateRange ?? 'all',
      showSentimentBadges: widget.showSentimentBadges ?? true,
      showReplies: widget.showReplies ?? true,
      customCss: widget.customCss ?? null,
    },
    business: data.business,
    reviews: filteredReviews,
    lastUpdated: new Date().toISOString(),
    source: widget.placeId && widget.placeId !== 'mock' ? 'google' : 'mock',
    cached: cacheHit,
  }, { headers: corsHeaders });
  } catch (error) {
    console.error('[widget/reviews] Error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
