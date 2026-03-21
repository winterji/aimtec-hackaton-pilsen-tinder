import { NextRequest } from 'next/server';

// In-memory store for tracking IPs
// Note: In a production serverless environment (like Vercel), this would reset 
// when the function goes cold. For a Hackathon/Persistent server, it works great.
const tokenCache = new Map<string, { count: number; reset: number }>();

export interface RateLimitConfig {
  limit: number;    // Max requests
  windowMs: number; // Time window in milliseconds
}

/**
 * Checks if a request from a specific IP should be limited.
 * @returns true if limited, false if allowed
 */
export function isRateLimited(request: NextRequest, config: RateLimitConfig): boolean {
  // Get IP address from headers (works behind proxies like Vercel/Cloudflare)
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  
  const record = tokenCache.get(ip);

  if (!record || now > record.reset) {
    // New record or expired window
    tokenCache.set(ip, {
      count: 1,
      reset: now + config.windowMs
    });
    return false;
  }

  // Increment count
  record.count++;

  if (record.count > config.limit) {
    return true;
  }

  return false;
}
