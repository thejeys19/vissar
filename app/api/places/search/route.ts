import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const MOCK_RESULTS = [
  { placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4', name: 'Google Sydney', address: '48 Pirrama Rd, Pyrmont NSW 2009, Australia' },
  { placeId: 'ChIJP3Sa8ziYEmsRUKgyFmh9AQM', name: 'Sydney Opera House', address: 'Bennelong Point, Sydney NSW 2000, Australia' },
  { placeId: 'ChIJIQBpAG2ahYAR_6128GcTUEo', name: 'San Francisco City Hall', address: '1 Dr Carlton B Goodlett Pl, San Francisco, CA 94102' },
];

export async function GET(request: NextRequest) {
  // Rate limit: 10 requests per minute per IP
  const ip = getClientIp(request);
  const { allowed, remaining } = await checkRateLimit(`places:search:${ip}`, 10, 60);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': String(remaining) },
      }
    );
  }

  // Require authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    const query = q.toLowerCase();
    const filtered = MOCK_RESULTS.filter(
      (r) => r.name.toLowerCase().includes(query) || r.address.toLowerCase().includes(query)
    );
    return NextResponse.json(filtered.length > 0 ? filtered : MOCK_RESULTS.slice(0, 3));
  }

  try {
    // Use Places API (New) - Text Search
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.id,places.formattedAddress',
      },
      body: JSON.stringify({ textQuery: q }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      console.error('Places API error:', data.error?.message || res.status);
      return NextResponse.json(MOCK_RESULTS.slice(0, 3));
    }

    const results = (data.places || []).slice(0, 8).map((p: {
      id: string;
      displayName?: { text?: string };
      formattedAddress?: string;
    }) => ({
      placeId: p.id,
      name: p.displayName?.text || '',
      address: p.formattedAddress || '',
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Places search error:', error);
    return NextResponse.json(MOCK_RESULTS.slice(0, 3));
  }
}
