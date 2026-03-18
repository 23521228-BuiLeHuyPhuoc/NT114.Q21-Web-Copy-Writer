import { SlidingWindowRateLimiter } from '../services/advanced/rateLimiter';

describe('Sliding Window Rate Limiter', () => {
  let limiter: SlidingWindowRateLimiter;

  afterEach(() => {
    if (limiter) limiter.destroy();
  });

  it('should allow requests within the limit', () => {
    limiter = new SlidingWindowRateLimiter({
      windowMs: 60000,
      maxRequests: 5,
    });

    for (let i = 0; i < 5; i++) {
      const result = limiter.checkLimit('test-key');
      expect(result.allowed).toBe(true);
    }
  });

  it('should deny requests exceeding the limit', () => {
    limiter = new SlidingWindowRateLimiter({
      windowMs: 60000,
      maxRequests: 3,
    });

    // Use up all allowed requests
    for (let i = 0; i < 3; i++) {
      limiter.checkLimit('test-key');
    }

    // This should be denied
    const result = limiter.checkLimit('test-key');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should track different keys independently', () => {
    limiter = new SlidingWindowRateLimiter({
      windowMs: 60000,
      maxRequests: 2,
    });

    limiter.checkLimit('key1');
    limiter.checkLimit('key1');

    // key1 is exhausted
    const result1 = limiter.checkLimit('key1');
    expect(result1.allowed).toBe(false);

    // key2 should still be allowed
    const result2 = limiter.checkLimit('key2');
    expect(result2.allowed).toBe(true);
  });

  it('should return remaining count', () => {
    limiter = new SlidingWindowRateLimiter({
      windowMs: 60000,
      maxRequests: 5,
    });

    const result1 = limiter.checkLimit('test');
    expect(result1.remaining).toBe(4);

    limiter.checkLimit('test');
    limiter.checkLimit('test');
    
    const result4 = limiter.checkLimit('test');
    expect(result4.remaining).toBe(1);
  });

  it('should return reset time', () => {
    limiter = new SlidingWindowRateLimiter({
      windowMs: 60000,
      maxRequests: 5,
    });

    const result = limiter.checkLimit('test');
    expect(result.resetTime).toBeGreaterThan(Date.now());
  });

  it('should provide stats', () => {
    limiter = new SlidingWindowRateLimiter({
      windowMs: 60000,
      maxRequests: 10,
    });

    limiter.checkLimit('key1');
    limiter.checkLimit('key1');
    limiter.checkLimit('key2');

    const stats = limiter.getStats();
    expect(stats.totalKeys).toBe(2);
    expect(stats.totalRequests).toBe(3);
  });

  it('should reset a specific key', () => {
    limiter = new SlidingWindowRateLimiter({
      windowMs: 60000,
      maxRequests: 2,
    });

    limiter.checkLimit('key1');
    limiter.checkLimit('key1');
    expect(limiter.checkLimit('key1').allowed).toBe(false);

    limiter.resetKey('key1');
    expect(limiter.checkLimit('key1').allowed).toBe(true);
  });
});
