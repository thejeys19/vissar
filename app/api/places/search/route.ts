import { NextRequest, NextResponse } from 'next/server';

const MOCK_RESULTS = [
  { placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4', name: 'Google Sydney', address: '48 Pirrama Rd, Pyrmont NSW 2009, Australia' },
  { placeId: 'ChIJP3Sa8ziYEmsRUKgyFmh9AQM', name: 'Sydney Opera House', address: 'Bennelong Point, Sydney NSW 2000, Australia' },
  { placeId: 'ChIJIQBpAG2ahYAR_6128GcTUEo', name: 'San Francisco City Hall', address: '1 Dr Carlton B Goodlett Pl, San Francisco, CA 94102' },
  { placeId: 'ChIJRcbZaklDXz4RYlEphFBu5r0', name: 'Burj Khalifa', address: '1 Sheikh Mohammed bin Rashid Blvd, Dubai' },
  { placeId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', name: 'Eiffel Tower', address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris' },
];

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    // Return mock results filtered by query for demo
    const filtered = MOCK_RESULTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        r.address.toLowerCase().includes(q.toLowerCase())
    );
    return NextResponse.json(filtered.length > 0 ? filtered : MOCK_RESULTS.slice(0, 3));
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    url.searchParams.set('input', q);
    url.searchParams.set('types', 'establishment');
    url.searchParams.set('key', apiKey);

    const res = await fetch(url.toString());
    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status);
      return NextResponse.json([], { status: 502 });
    }

    const results = (data.predictions || []).map((p: { place_id: string; structured_formatting?: { main_text?: string }; description?: string }) => ({
      placeId: p.place_id,
      name: p.structured_formatting?.main_text || p.description || '',
      address: p.description || '',
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Places search error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
