import { NextResponse } from 'next/server';
import { stripe, PLANS, isStripeConfigured } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';
import { checkoutSchema } from '@/lib/validators/checkout';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed, remaining } = await checkRateLimit(`checkout:${ip}`, 5, 60);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': String(remaining) } }
      );
    }

    if (!isStripeConfigured) {
      console.error('Stripe not configured - missing STRIPE_SECRET_KEY');
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { planId } = parsed.data;
    const userId = (session.user as { id?: string })?.id || session.user.email;
    const email = session.user.email;

    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan || planId === 'free' || !plan.priceId) {
      return NextResponse.json({
        error: planId === 'lifetime'
          ? 'Lifetime deal not yet configured — contact support@vissar.com to purchase'
          : 'Invalid plan',
      }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.vissar.com';
    const mode = plan.mode || 'subscription';

    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode,
      success_url: `${baseUrl}/dashboard/billing?success=true`,
      cancel_url: `${baseUrl}/dashboard/billing?canceled=true`,
      metadata: { userId, planId, email },
    });

    return NextResponse.json({ sessionId: stripeSession.id, url: stripeSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
