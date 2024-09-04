const rateLimiters = {};

function create(vendorName) {
  if (!rateLimiters[vendorName]) {
    rateLimiters[vendorName] = initializeRateLimiter();
  }

  const { increment, isRateLimited } = rateLimiters[vendorName];

  return { increment, isRateLimited };
}

function initializeRateLimiter() {
  const rateLimiter = {
    count: 0,
    limit: parseInt(process.env.RATE_LIMIT_PER_HOUR, 10),
    resetTime: Date.now() + 3600000, // 1 hour
  };

  return {
    increment() {
      rateLimiter.count++;
    },
    isRateLimited() {
      const now = Date.now();
      if (now > rateLimiter.resetTime) {
        rateLimiter.count = 0;
        rateLimiter.resetTime = now + 3600000;
      }
      return rateLimiter.count >= rateLimiter.limit;
    },
  };
}

module.exports = { create };
