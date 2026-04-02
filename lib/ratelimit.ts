/**
 * Simple Redis-based rate limiting utility.
 * Uses a sliding window counter approach with Upstash Redis.
 */
import { Redis } from '@upstash/redis';

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

/**
 * Check and increment rate limit for a given key.
 * @param identifier - unique key (e.g. IP address + route)
 * @param maxRequests - max allowed requests in the window
 * @param windowSeconds - time window in seconds
 * @returns { allowed: boolean, remaining: number }
 */
export async function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const redis = getRedis();
  if (!redis) {
    // If Redis not configured, allow all (fail open)
    return { allowed: true, remaining: maxRequests };
  }

  const key = `ratelimit:${identifier}`;

  try {
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.expire(key, windowSeconds);
    const results = await pipeline.exec();
    const count = results[0] as number;

    const remaining = Math.max(0, maxRequests - count);
    return { allowed: count <= maxRequests, remaining };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Fail open on Redis error
    return { allowed: true, remaining: maxRequests };
  }
}

/**
 * Get client IP from request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}
