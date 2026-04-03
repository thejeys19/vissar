import { NextResponse } from 'next/server';
import { MOCK_REVIEWS, MOCK_BUSINESS } from '@/lib/mock-data';
import { getReviews } from '@/lib/services/review.service';

export const dynamic = "force-dynamic";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId') || 'mock';
    const maxReviews = Math.min(50, Math.max(1, parseInt(searchParams.get('maxReviews') || '5', 10)));
    const minRating = Math.min(5, Math.max(1, parseInt(searchParams.get('minRating') || '1', 10)));

    const result = await getReviews(placeId, maxReviews, minRating);

    return NextResponse.json(result, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('/api/reviews error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        placeId: 'mock',
        business: MOCK_BUSINESS,
        reviews: MOCK_REVIEWS,
        source: 'mock',
        cached: false,
        lastUpdated: new Date().toISOString(),
      },
      { headers: corsHeaders }
    );
  }
}
