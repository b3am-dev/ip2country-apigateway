const cache = require('../utils/cache');

describe('Cache Module', () => {
  it('should store and retrieve values from the cache', () => {
    const key = 'test_ip';
    const value = 'test_country';

    cache.set(key, value);
    const result = cache.get(key);

    expect(result).toBe(value);
  });

  it('should return undefined for non-existent keys', () => {
    const result = cache.get('non_existent_key');
    expect(result).toBeUndefined();
  });
});
