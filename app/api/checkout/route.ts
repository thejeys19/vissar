import { NextResponse } from 'next/server';
import { stripe, PLANS, isStripeConfigured } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    if (!isStripeConfigured) {
      console.error('Stripe not configured - missing STRIPE_SECRET_KEY');
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { planId, userId, email } = body;

    if (!planId || !userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    
    if (!plan || planId === 'free' || !plan.priceId) {
      console.error('Invalid plan or missing priceId:', planId, plan?.priceId);
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.vissar.com';

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard/billing?success=true`,
      cancel_url: `${baseUrl}/dashboard/billing?canceled=true`,
      metadata: { userId, planId, email },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Checkout error:', msg);
    return NextResponse.json({ error: 'Checkout failed', detail: msg }, { status: 500 });
  }
}
