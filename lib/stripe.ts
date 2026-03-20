import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeKey 
  ? new Stripe(stripeKey, {
      apiVersion: '2026-02-25.clover',
    })
  : null as unknown as Stripe;

export const isStripeConfigured = !!stripeKey;

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    priceId: null,
    price: 0,
    widgets: 1,
    views: 200,
    features: ['1 widget', '200 views/month', 'Basic templates', 'Vissar branding']
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    price: 500, // $5 in cents
    widgets: Infinity,
    views: 10000,
    features: ['Unlimited widgets', '10,000 views/month', 'All templates', 'No branding', 'Priority support']
  },
  lifetime: {
    id: 'lifetime',
    name: 'Lifetime',
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID,
    price: 5000, // $50 in cents (was $399)
    widgets: Infinity,
    views: Infinity,
    maxLocations: 10,
    features: ['Unlimited widgets', 'Unlimited views', 'All templates + future', 'No branding', 'Lifetime access', 'Max 10 locations']
  }
};
