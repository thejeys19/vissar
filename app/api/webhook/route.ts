import { NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const payload = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, planId } = session.metadata || {};
        
        // Update user tier in database
        console.log(`Payment successful for user ${userId}, plan: ${planId}`);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as { subscription?: string };
        console.log(`Payment failed for subscription: ${invoice.subscription}`);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log(`Subscription cancelled: ${subscription.id}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
