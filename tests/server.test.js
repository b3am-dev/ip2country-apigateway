const request = require('supertest');
const { app, server } = require('../server');
const cache = require('../utils/cache');
const vendors = require('../utils/vendors');

jest.mock('../utils/cache');
jest.mock('../utils/vendors');

describe('POST /get-country', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it('should return 400 if IP address is not provided', async () => {
    const response = await request(app).post('/get-country').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('IP address is required');
  });

  it('should return country from cache if available', async () => {
    const mockIp = '192.168.0.1';
    const mockCountry = 'United States';

    cache.get.mockReturnValue(mockCountry);

    const response = await request(app)
      .post('/get-country')
      .send({ ip: mockIp });

    expect(response.status).toBe(200);
    expect(response.body.country).toBe(mockCountry);
    expect(cache.get).toHaveBeenCalledWith(mockIp);
    expect(vendors.getCountry).not.toHaveBeenCalled();
  });

  it('should fetch country from vendors if not in cache', async () => {
    const mockIp = '192.168.0.2';
    const mockCountry = 'Canada';

    cache.get.mockReturnValue(null);
    vendors.getCountry.mockResolvedValue(mockCountry);

    const response = await request(app)
      .post('/get-country')
      .send({ ip: mockIp });

    expect(response.status).toBe(200);
    expect(response.body.country).toBe(mockCountry);
    expect(cache.get).toHaveBeenCalledWith(mockIp);
    expect(vendors.getCountry).toHaveBeenCalledWith(mockIp);
    expect(cache.set).toHaveBeenCalledWith(mockIp, mockCountry);
  });

  it('should return 500 if vendor lookup fails', async () => {
    const mockIp = '192.168.0.3';
    const mockError = new Error('Vendor lookup failed');

    cache.get.mockReturnValue(null);
    vendors.getCountry.mockRejectedValue(mockError);

    const response = await request(app)
      .post('/get-country')
      .send({ ip: mockIp });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(mockError.message);
    expect(cache.get).toHaveBeenCalledWith(mockIp);
    expect(vendors.getCountry).toHaveBeenCalledWith(mockIp);
    expect(cache.set).not.toHaveBeenCalled();
  });
});
