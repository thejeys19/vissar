import { NextResponse } from 'next/server';
import { MOCK_REVIEWS, MOCK_BUSINESS } from '@/lib/mock-data';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places';
const CACHE_DIR = '/tmp/vissar-cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  data: Record<string, unknown>;
  cachedAt: string;
}

async function readCache(placeId: string): Promise<CacheEntry | null> {
  try {
    const filePath = path.join(CACHE_DIR, `${placeId}.json`);
    const raw = await readFile(filePath, 'utf-8');
    const entry: CacheEntry = JSON.parse(raw);
    const age = Date.now() - new Date(entry.cachedAt).getTime();
    if (age < CACHE_TTL_MS) {
      return entry;
    }
    return null;
  } catch {
    return null;
  }
}

async function writeCache(placeId: string, data: Record<string, unknown>): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    const filePath = path.join(CACHE_DIR, `${placeId}.json`);
    const entry: CacheEntry = { data, cachedAt: new Date().toISOString() };
    await writeFile(filePath, JSON.stringify(entry), 'utf-8');
  } catch (err) {
    console.error('Cache write error:', err);
  }
}

interface GoogleReview {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text?: {
    text: string;
    languageCode: string;
  };
  authorAttribution: {
    displayName: string;
    uri?: string;
    photoUri?: string;
  };
  publishTime: string;
}

interface GooglePlaceDetails {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
}

async function fetchGoogleReviews(placeId: string): Promise<{ business: { name: string; rating: number; totalReviews: number; placeId: string }; reviews: { id: string; author: string; avatar: string; rating: number; text: string; date: string; relativeTime: string }[] } | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('GOOGLE_PLACES_API_KEY not set, using mock data');
    return null;
  }

  try {
    const response = await fetch(
      `${GOOGLE_PLACES_API_URL}/${placeId}?fields=id,displayName,rating,userRatingCount,reviews`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews',
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Places API error:', errorText);
      return null;
    }

    const place: GooglePlaceDetails = await response.json();

    // Transform Google reviews to our format
    const reviews = (place.reviews || [])
      .filter((review) => review.text?.text) // Only include reviews with text
      .map((review) => ({
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
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId') || 'mock';
  const maxReviews = parseInt(searchParams.get('maxReviews') || '5', 10);
  const minRating = parseInt(searchParams.get('minRating') || '1', 10);

  let data;

  // Try to fetch real Google reviews if API key is set and not using mock
  if (placeId !== 'mock' && GOOGLE_PLACES_API_KEY) {
    // Check server-side file cache first
    const cached = await readCache(placeId);
    if (cached) {
      data = cached.data;
    } else {
      const googleData = await fetchGoogleReviews(placeId);
      if (googleData) {
        data = googleData;
        await writeCache(placeId, googleData as unknown as Record<string, unknown>);
      } else {
        // Fallback to mock data
        data = {
          business: MOCK_BUSINESS,
          reviews: MOCK_REVIEWS,
        };
      }
    }
  } else {
    // Use mock data for development/testing
    data = {
      business: MOCK_BUSINESS,
      reviews: MOCK_REVIEWS,
    };
  }

  // Filter by rating
  const filteredReviews = data.reviews
    .filter((r: { rating: number }) => r.rating >= minRating)
    .slice(0, maxReviews);

  return NextResponse.json({
    placeId,
    business: data.business,
    reviews: filteredReviews,
    lastUpdated: new Date().toISOString(),
    source: placeId === 'mock' ? 'mock' : 'google',
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
