import { NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { setUserPlan, getUserPlanAsync, planLimitForTier } from '@/lib/plans';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function resolvePlan(metadata: Record<string, string> | null | undefined): string {
  const planId = metadata?.planId;
  if (planId === "business" || planId === "pro") return planId;
  return "pro";
}

export async function POST(request: Request) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const payload = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const email = session.customer_email || session.metadata?.email;
        const plan = resolvePlan(session.metadata);
        if (email) {
          const existing = await getUserPlanAsync(email);
          await setUserPlan(email, {
            plan,
            views: existing.views,
            limit: planLimitForTier(plan),
          });
          console.log(`[webhook] checkout.session.completed: ${email} -> ${plan}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const email = sub.metadata?.email;
        const plan = resolvePlan(sub.metadata);
        if (email) {
          const existing = await getUserPlanAsync(email);
          await setUserPlan(email, {
            plan,
            views: existing.views,
            limit: planLimitForTier(plan),
          });
          console.log(`[webhook] subscription.updated: ${email} -> ${plan}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const email = sub.metadata?.email;
        if (email) {
          const existing = await getUserPlanAsync(email);
          await setUserPlan(email, {
            plan: "free",
            views: existing.views,
            limit: 200,
          });
          console.log(`[webhook] subscription.deleted: ${email} -> free`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as { subscription?: string };
        console.log(`[webhook] payment failed for subscription: ${invoice.subscription}`);
        break;
      }

      default:
        return NextResponse.json({ error: `Unhandled event type: ${event.type}` }, { status: 400 });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
