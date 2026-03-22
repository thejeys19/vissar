import { NextRequest, NextResponse } from 'next/server';

// More diverse mock results for demo
const MOCK_RESULTS = [
  { placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4', name: 'Google Sydney', address: '48 Pirrama Rd, Pyrmont NSW 2009, Australia' },
  { placeId: 'ChIJP3Sa8ziYEmsRUKgyFmh9AQM', name: 'Sydney Opera House', address: 'Bennelong Point, Sydney NSW 2000, Australia' },
  { placeId: 'ChIJIQBpAG2ahYAR_6128GcTUEo', name: 'San Francisco City Hall', address: '1 Dr Carlton B Goodlett Pl, San Francisco, CA 94102' },
  { placeId: 'ChIJRcbZaklDXz4RYlEphFBu5r0', name: 'Burj Khalifa', address: '1 Sheikh Mohammed bin Rashid Blvd, Dubai' },
  { placeId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', name: 'Eiffel Tower', address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris' },
  { placeId: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA', name: 'Central Park', address: 'New York, NY, USA' },
  { placeId: 'ChIJi3g-5Q6_woARmFzYqf7gCgc', name: 'Santa Monica Pier', address: '200 Santa Monica Pier, Santa Monica, CA 90401' },
  { placeId: 'ChIJX7ztC_8x44kRXK8LWDSR5yM', name: 'Statue of Liberty', address: 'New York, NY 10004, USA' },
  { placeId: 'ChIJrTLJrLG3t4kR4mB1a4OpJ5g', name: 'White House', address: '1600 Pennsylvania Avenue NW, Washington, DC 20500' },
  { placeId: 'ChIJvT-7MljXwkcRXejxbL9f4c4', name: 'Louvre Museum', address: 'Rue de Rivoli, 75001 Paris, France' },
];

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    // Return filtered mock results for demo
    const query = q.toLowerCase();
    const filtered = MOCK_RESULTS.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.address.toLowerCase().includes(query)
    );
    
    // If no exact matches, return all results but sorted by relevance
    if (filtered.length === 0) {
      // Return all mock results with the query as a "search result"
      return NextResponse.json([
        { placeId: 'demo-1', name: `Demo: ${q} Business`, address: `123 ${q} Street, Demo City` },
        { placeId: 'demo-2', name: `Sample ${q} Co`, address: `456 ${q} Ave, Demo Town` },
        ...MOCK_RESULTS.slice(0, 5)
      ]);
    }
    
    return NextResponse.json(filtered);
  }

  try {
    // Add session token for better results
    const sessionToken = request.headers.get('x-session-token') || 'default-session';
    
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    url.searchParams.set('input', q);
    url.searchParams.set('types', 'establishment');
    url.searchParams.set('key', apiKey);
    // Add sessiontoken to reduce costs and improve results
    url.searchParams.set('sessiontoken', sessionToken);

    const res = await fetch(url.toString());
    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status, data.error_message);
      // Fall back to mock results on API error
      return NextResponse.json(MOCK_RESULTS.slice(0, 3));
    }

    const results = (data.predictions || []).map((p: { place_id: string; structured_formatting?: { main_text?: string }; description?: string }) => ({
      placeId: p.place_id,
      name: p.structured_formatting?.main_text || p.description?.split(',')[0] || '',
      address: p.description || '',
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Places search error:', error);
    // Fall back to mock results on network/error
    return NextResponse.json(MOCK_RESULTS.slice(0, 3));
  }
}
