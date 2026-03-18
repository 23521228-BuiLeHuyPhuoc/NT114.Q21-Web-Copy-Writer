/**
 * Advanced Feature: Sliding Window Rate Limiter
 * 
 * Implements a sliding window rate limiting algorithm instead of fixed window.
 * This provides more accurate rate limiting by considering the distribution of 
 * requests across the current and previous time windows.
 * 
 * Algorithm:
 * - Maintains request timestamps in a sliding window
 * - Uses weighted calculation: count = previous_window_count * overlap_percentage + current_window_count
 * - More fair than fixed window (prevents burst at window boundaries)
 * 
 * Complexity: O(1) amortized time, O(n) space where n = max requests per window
 */

import { Request, Response, NextFunction } from 'express';

interface WindowRecord {
  timestamps: number[];
  previousWindowCount: number;
  windowStartTime: number;
}

interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
  skipFailedRequests?: boolean;
  onLimitReached?: (req: Request, res: Response) => void;
}

class SlidingWindowRateLimiter {
  private store: Map<string, WindowRecord> = new Map();
  private windowMs: number;
  private maxRequests: number;
  private keyGenerator: (req: Request) => string;
  private message: string;
  private skipFailedRequests: boolean;
  private onLimitReached?: (req: Request, res: Response) => void;
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor(options: RateLimiterOptions) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
    this.keyGenerator = options.keyGenerator || ((req: Request) => {
      return req.ip || req.socket.remoteAddress || 'unknown';
    });
    this.message = options.message || 'Too many requests, please try again later.';
    this.skipFailedRequests = options.skipFailedRequests || false;
    this.onLimitReached = options.onLimitReached;

    // Cleanup old entries every window period
    this.cleanupInterval = setInterval(() => this.cleanup(), this.windowMs);
  }

  /**
   * Calculate the effective request count using sliding window algorithm.
   * 
   * Formula: effectiveCount = previousCount * overlapPercentage + currentCount
   * 
   * Where overlapPercentage = (windowMs - elapsed) / windowMs
   * This weights previous window requests by how much of the previous window
   * overlaps with the current sliding window.
   */
  private calculateEffectiveCount(record: WindowRecord, now: number): number {
    const elapsed = now - record.windowStartTime;
    
    if (elapsed >= this.windowMs) {
      // We've moved past the current window, rotate
      const currentCount = record.timestamps.filter(t => t > now - this.windowMs).length;
      return currentCount;
    }

    // Current window requests
    const currentWindowRequests = record.timestamps.filter(
      t => t >= record.windowStartTime
    ).length;

    // Calculate overlap percentage of previous window
    const overlapPercentage = Math.max(0, (this.windowMs - elapsed) / this.windowMs);
    
    // Weighted count from previous window + all current window requests
    const effectiveCount = (record.previousWindowCount * overlapPercentage) + currentWindowRequests;
    
    return effectiveCount;
  }

  /**
   * Record a new request and check if it exceeds the limit.
   * Returns remaining requests and reset time.
   */
  public checkLimit(key: string): { 
    allowed: boolean; 
    remaining: number; 
    resetTime: number;
    effectiveCount: number;
  } {
    const now = Date.now();
    let record = this.store.get(key);

    if (!record) {
      record = {
        timestamps: [],
        previousWindowCount: 0,
        windowStartTime: now,
      };
      this.store.set(key, record);
    }

    // Check if we need to rotate windows
    if (now - record.windowStartTime >= this.windowMs) {
      const previousCount = record.timestamps.filter(
        t => t >= record!.windowStartTime && t < record!.windowStartTime + this.windowMs
      ).length;
      
      record.previousWindowCount = previousCount;
      record.windowStartTime = now;
      record.timestamps = record.timestamps.filter(t => t > now - this.windowMs * 2);
    }

    const effectiveCount = this.calculateEffectiveCount(record, now);
    const allowed = effectiveCount < this.maxRequests;
    const resetTime = record.windowStartTime + this.windowMs;

    if (allowed) {
      record.timestamps.push(now);
    }

    // Remaining accounts for the current request if it was allowed
    const currentCount = this.calculateEffectiveCount(record, now);
    const remaining = Math.max(0, Math.floor(this.maxRequests - currentCount));

    return { allowed, remaining, resetTime, effectiveCount: currentCount };
  }

  /**
   * Express middleware function
   */
  public middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const key = this.keyGenerator(req);
      const result = this.checkLimit(key);

      // Set rate limit headers (standard draft)
      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));
      res.setHeader('X-RateLimit-Policy', `${this.maxRequests};w=${Math.ceil(this.windowMs / 1000)}`);

      if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
        res.setHeader('Retry-After', retryAfter);

        if (this.onLimitReached) {
          this.onLimitReached(req, res);
        }

        res.status(429).json({
          success: false,
          error: this.message,
          retryAfter,
          limit: this.maxRequests,
          windowMs: this.windowMs,
        });
        return;
      }

      if (this.skipFailedRequests) {
        const originalEnd = res.end.bind(res);
        const wrappedEnd: typeof res.end = function(this: Response, ...args: any[]): any {
          if (res.statusCode >= 400) {
            const record = (res as any).__rateLimitRecord;
            if (record) {
              record.timestamps.pop();
            }
          }
          return originalEnd(...args);
        } as typeof res.end;
        res.end = wrappedEnd;
      }

      next();
    };
  }

  /**
   * Get current stats for monitoring
   */
  public getStats(): { totalKeys: number; totalRequests: number } {
    let totalRequests = 0;
    this.store.forEach(record => {
      totalRequests += record.timestamps.length;
    });
    return { totalKeys: this.store.size, totalRequests };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiry = now - this.windowMs * 2;
    
    for (const [key, record] of this.store.entries()) {
      // Remove timestamps older than 2 windows
      record.timestamps = record.timestamps.filter(t => t > expiry);
      
      // Remove empty records
      if (record.timestamps.length === 0 && now - record.windowStartTime > this.windowMs * 2) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Reset a specific key's rate limit
   */
  public resetKey(key: string): void {
    this.store.delete(key);
  }

  /**
   * Destroy the rate limiter and clean up
   */
  public destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Pre-configured rate limiters
export const apiRateLimiter = new SlidingWindowRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many API requests. Please try again after 15 minutes.',
});

export const aiGenerationRateLimiter = new SlidingWindowRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
  message: 'AI generation rate limit exceeded. Please try again after 15 minutes.',
  onLimitReached: (req: Request) => {
    console.warn(`AI rate limit reached for IP: ${req.ip}`);
  },
});

export const authRateLimiter = new SlidingWindowRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
});

export { SlidingWindowRateLimiter };
export type { RateLimiterOptions };
