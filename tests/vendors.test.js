const vendors = require('../utils/vendors');
const axios = require('axios');

jest.mock('axios', () => {
  const originalModule = jest.requireActual('axios');

  return {
    __esModule: true,
    ...originalModule,
    get: jest
      .fn()
      .mockResolvedValue({
        data: { country_name: 'United States' },
        status: 200,
      }),
  };
});

describe('Vendors Module', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a country name for a valid IP address', async () => {
    const country = await vendors.getCountry('134.201.250.155');
    expect(country).not.toBeUndefined();
  });

  it('should throw an error if all vendors fail or rate limits are exceeded', async () => {
    try {
      await vendors.getCountry('invalid_ip');
    } catch (error) {
      expect(error.message).to.equal(
        'All vendors rate limit exceeded or failed.'
      );
    }
  });

  it('should call ipstack vendor if rate limit is not exceeded', async () => {
    const axiosSpy = jest.spyOn(axios, 'get');
    const country = await vendors.getCountry('2.2.2.2');

    expect(country).not.toBeUndefined();
    expect(axiosSpy).toHaveBeenCalledWith(
      'http://api.ipstack.com/2.2.2.2?access_key=ipstack_api_mock_key'
    );
  });

  it('should call ipapi vendor if rate limit is not exceeded', async () => {
    const axiosSpy = jest.spyOn(axios, 'get');

    await vendors.getCountry('3.3.3.3');
    await vendors.getCountry('4.4.4.4');
    await vendors.getCountry('5.5.5.5');

    expect(axiosSpy).toBeCalledWith(
      'https://ipapi.co/3.3.3.3/json'
    );
    expect(axiosSpy).toBeCalledWith(
      'https://ipapi.co/4.4.4.4/json'
    );
    expect(axiosSpy).toBeCalledWith(
      'https://ipapi.co/5.5.5.5/json'
    );

    await expect(async () => await vendors.getCountry('6.6.6.6')).rejects.toThrow('All vendors rate limit exceeded or failed.');

    expect(axiosSpy).not.toBeCalledWith(
      'https://ipapi.co/6.6.6.6/json'
    );
  });
});
