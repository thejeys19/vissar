/**
 * Review Service — Google Places API fetch + Redis cache
 * Redis intentionally used here for TTL-based review caching
 */
import { Redis } from '@upstash/redis';
import { MOCK_REVIEWS, MOCK_BUSINESS } from '@/lib/mock-data';
import type { ReviewData } from '@/lib/types/review';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places';
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function readCache(placeId: string): Promise<ReviewData | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
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

async function writeCache(placeId: string, data: ReviewData): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(`reviews:${placeId}`, data, { ex: CACHE_TTL_SECONDS });
  } catch (err) {
    console.error('Review cache write error:', err);
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

async function fetchFromGoogle(placeId: string): Promise<ReviewData | null> {
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
        avatar:
          r.authorAttribution.photoUri ||
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

export async function getReviews(
  placeId: string,
  maxReviews: number,
  minRating: number
): Promise<{
  placeId: string;
  business: ReviewData['business'];
  reviews: ReviewData['reviews'];
  lastUpdated: string;
  source: string;
  cached: boolean;
}> {
  let data: ReviewData;
  let cacheHit = false;

  if (placeId !== 'mock' && GOOGLE_PLACES_API_KEY) {
    const cached = await readCache(placeId);
    if (cached && Array.isArray(cached.reviews)) {
      data = cached;
      cacheHit = true;
    } else {
      const googleData = await fetchFromGoogle(placeId);
      if (googleData) {
        data = googleData;
        writeCache(placeId, googleData); // fire-and-forget
      } else {
        data = { business: MOCK_BUSINESS, reviews: MOCK_REVIEWS };
      }
    }
  } else {
    data = { business: MOCK_BUSINESS, reviews: MOCK_REVIEWS };
  }

  if (!data || !Array.isArray(data.reviews)) {
    data = { business: MOCK_BUSINESS, reviews: MOCK_REVIEWS };
  }

  const filteredReviews = data.reviews
    .filter((r) => r.rating >= minRating)
    .slice(0, maxReviews);

  return {
    placeId,
    business: data.business,
    reviews: filteredReviews,
    lastUpdated: new Date().toISOString(),
    source: placeId === 'mock' ? 'mock' : 'google',
    cached: cacheHit,
  };
}
