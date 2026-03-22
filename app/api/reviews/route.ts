import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { MOCK_REVIEWS, MOCK_BUSINESS } from '@/lib/mock-data';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places';
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

export const dynamic = "force-dynamic";

interface ReviewData {
  business: { name: string; rating: number; totalReviews: number; placeId: string };
  reviews: { id: string; author: string; avatar: string; rating: number; text: string; date: string; relativeTime?: string }[];
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function readRedisCache(placeId: string): Promise<ReviewData | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const raw = await redis.get(`reviews:${placeId}`);
    if (!raw) return null;
    // Handle both string and object storage formats
    if (typeof raw === 'string') {
      try { return JSON.parse(raw) as ReviewData; } catch { return null; }
    }
    return raw as ReviewData;
  } catch {
    return null;
  }
}

async function writeRedisCache(placeId: string, data: ReviewData): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(`reviews:${placeId}`, data, { ex: CACHE_TTL_SECONDS });
  } catch (err) {
    console.error('Redis cache write error:', err);
  }
}

interface GoogleReview {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text?: { text: string; languageCode: string };
  authorAttribution: { displayName: string; uri?: string; photoUri?: string };
  publishTime: string;
}

interface GooglePlaceDetails {
  id: string;
  displayName: { text: string; languageCode: string };
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
}

async function fetchGoogleReviews(placeId: string): Promise<ReviewData | null> {
  if (!GOOGLE_PLACES_API_KEY) return null;

  try {
    const response = await fetch(`${GOOGLE_PLACES_API_URL}/${placeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews',
      },
    });

    if (!response.ok) {
      console.error('Google Places API error:', response.status);
      return null;
    }

    const place: GooglePlaceDetails = await response.json();

    const reviews = (place.reviews || [])
      .filter((r) => r.text?.text)
      .map((r) => ({
        id: r.name.split('/').pop() || r.name,
        author: r.authorAttribution.displayName,
        avatar: r.authorAttribution.photoUri ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(r.authorAttribution.displayName)}&background=random`,
        rating: r.rating,
        text: r.text?.text || '',
        date: r.publishTime.split('T')[0],
        relativeTime: r.relativePublishTimeDescription,
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
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId') || 'mock';
    const maxReviews = parseInt(searchParams.get('maxReviews') || '5', 10);
    const minRating = parseInt(searchParams.get('minRating') || '1', 10);

    let data: ReviewData;
    let cacheHit = false;

    if (placeId !== 'mock' && GOOGLE_PLACES_API_KEY) {
      const cached = await readRedisCache(placeId);
      if (cached && Array.isArray(cached.reviews)) {
        data = cached;
        cacheHit = true;
      } else {
        const googleData = await fetchGoogleReviews(placeId);
        if (googleData) {
          data = googleData;
          writeRedisCache(placeId, googleData); // fire-and-forget
        } else {
          data = { business: MOCK_BUSINESS, reviews: MOCK_REVIEWS };
        }
      }
    } else {
      data = { business: MOCK_BUSINESS, reviews: MOCK_REVIEWS };
    }

    // Defensive fallback
    if (!data || !Array.isArray(data.reviews)) {
      data = { business: MOCK_BUSINESS, reviews: MOCK_REVIEWS };
    }

    const filteredReviews = data.reviews
      .filter((r) => r.rating >= minRating)
      .slice(0, maxReviews);

    return NextResponse.json({
      placeId,
      business: data.business,
      reviews: filteredReviews,
      lastUpdated: new Date().toISOString(),
      source: placeId === 'mock' ? 'mock' : 'google',
      cached: cacheHit,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    });
  } catch (error) {
    console.error('/api/reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error', placeId: 'mock', business: MOCK_BUSINESS, reviews: MOCK_REVIEWS, source: 'mock', cached: false, lastUpdated: new Date().toISOString() },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}
