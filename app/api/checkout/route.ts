import { NextResponse } from 'next/server';
import { stripe, PLANS, isStripeConfigured } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { planId, userId, email } = body;

    if (!planId || !userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    
    if (!plan || planId === 'free' || !plan.priceId) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: planId === 'lifetime' ? 'payment' : 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        planId,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout creation failed' },
      { status: 500 }
    );
  }
}
