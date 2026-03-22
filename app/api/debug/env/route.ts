import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    VERCEL: !!process.env.VERCEL,
    UPSTASH_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_URL_LEN: process.env.UPSTASH_REDIS_REST_URL?.length || 0,
    UPSTASH_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  });
}
