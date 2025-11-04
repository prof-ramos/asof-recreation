// Simple in-memory rate limiter
// In production, you would use Redis or another shared store for multiple server instances
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests allowed
  message?: string; // Custom message to send when rate limit exceeded
}

export class RateLimiter {
  private windowMs: number;
  private max: number;
  private message: string;

  constructor(options: RateLimitOptions) {
    this.windowMs = options.windowMs;
    this.max = options.max;
    this.message = options.message || 'Too many requests, please try again later.';
  }

  checkLimit(identifier: string): { allowed: boolean; resetTime?: number; message?: string } {
    const now = Date.now();
    const key = identifier;
    const record = rateLimitStore.get(key);

    if (!record) {
      // First request from this identifier
      rateLimitStore.set(key, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true, resetTime: now + this.windowMs };
    }

    if (now > record.resetTime) {
      // Time window has passed, reset the count
      rateLimitStore.set(key, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true, resetTime: now + this.windowMs };
    }

    if (record.count >= this.max) {
      // Rate limit exceeded
      return { 
        allowed: false, 
        resetTime: record.resetTime, 
        message: this.message 
      };
    }

    // Increment the count
    rateLimitStore.set(key, { 
      count: record.count + 1, 
      resetTime: record.resetTime 
    });
    
    return { allowed: true, resetTime: record.resetTime };
  }
}

// Create default rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many API requests, please try again later.'
});

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth
  message: 'Too many authentication attempts, please try again later.'
});

// Function to get identifier for rate limiting (typically IP address)
export function getClientIdentifier(request: Request): string {
  // In a real implementation, you would extract the IP from headers
  // For Next.js, this could come from request headers or context
  const headers = new Headers(request.headers);
  // Check various headers where IP might be stored (behind proxies)
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || headers.get('x-real-ip')
    || 'unknown';
  
  return ip;
}