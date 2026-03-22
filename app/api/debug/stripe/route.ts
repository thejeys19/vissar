import { NextResponse } from 'next/server';

export async function GET() {
  const configured = !!process.env.STRIPE_SECRET_KEY;
  const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 12) || 'MISSING';
  const pro = process.env.STRIPE_PRO_PRICE_ID || 'MISSING';
  const biz = process.env.STRIPE_BUSINESS_PRICE_ID || 'MISSING';
  
  return NextResponse.json({ configured, keyPrefix, pro, biz });
}
