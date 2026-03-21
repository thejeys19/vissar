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
    price: 800, // $8 in cents
    widgets: 3,
    views: 10000,
    features: ['3 widgets', '10,000 views/month', 'All templates', 'No branding', 'Priority support']
  },
  business: {
    id: 'business',
    name: 'Business',
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    price: 1500, // $15 in cents
    widgets: 9,
    views: 50000,
    features: ['9 widgets', '50,000 views/month', 'All templates', 'Custom CSS', 'No branding', 'API access', 'Priority support']
  }
};
