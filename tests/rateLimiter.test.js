const { create } = require('../utils/rateLimiter'); // Adjust the path as necessary

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Reset environment variable before each test
    process.env.RATE_LIMIT_PER_HOUR = '5';
  });

  it('should create a rate limiter for a new vendor and increment the count', () => {
    const { increment, isRateLimited } = create('vendorA');

    increment();
    increment();

    expect(isRateLimited()).toBe(false); // Still within limit

    increment();
    increment();
    increment();

    expect(isRateLimited()).toBe(true); // Should hit the limit now
  });

  it('should reset the rate limiter after 1 hour', () => {
    jest.useFakeTimers();

    const { increment, isRateLimited } = create('vendorB');

    increment();
    increment();
    increment();
    increment();
    increment();

    expect(isRateLimited()).toBe(true); // Limit reached

    // Fast forward time by 1 hour and 1 second
    jest.advanceTimersByTime(3600001);

    expect(isRateLimited()).toBe(false); // Should be reset now
    jest.useRealTimers();
  });

  it('should reuse the rate limiter for the same vendor', () => {
    const { increment, isRateLimited } = create('vendorC');

    increment();
    increment();
    expect(isRateLimited()).toBe(false); // Still within limit

    const { increment: incrementAgain, isRateLimited: isRateLimitedAgain } =
      create('vendorC');

    incrementAgain();
    incrementAgain();
    incrementAgain();

    expect(isRateLimitedAgain()).toBe(true); // Should hit the limit now
  });

  it('should create a separate rate limiter for different vendors', () => {
    const { increment: incrementA, isRateLimited: isRateLimitedA } =
      create('vendorD');
    const { increment: incrementB, isRateLimited: isRateLimitedB } =
      create('vendorE');

    incrementA();
    incrementA();
    incrementA();
    incrementA();
    incrementA();

    expect(isRateLimitedA()).toBe(true); // Vendor D should be rate limited

    incrementB();
    expect(isRateLimitedB()).toBe(false); // Vendor E should not be rate limited
  });
});
