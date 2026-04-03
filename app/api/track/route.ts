import { NextResponse } from 'next/server';
import { trackEventSchema } from '@/lib/validators/track';
import { trackEvent } from '@/lib/services/analytics.service';

export const dynamic = "force-dynamic";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = trackEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400, headers: corsHeaders }
      );
    }

    const { widgetId, event } = parsed.data;
    await trackEvent(widgetId, event);

    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500, headers: corsHeaders });
  }
}
