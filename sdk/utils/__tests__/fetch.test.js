import { fetch as fetchSslPinning } from 'react-native-ssl-pinning';
import { fetch } from '../helpers';

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

describe('fetch', () => {
  afterEach(() => jest.clearAllMocks());
  const fetchResolve = {
    status: 200,
    json: () => Promise.resolve(),
  };

  const error = {
    status: 404,
    bodyString:
      '<h1>Not Found</h1><p>The requested URL /oidc was not found on this server.</p>',
    headers: {
      'Cache-Control': 'no-store',
      Connection: 'close',
      'Content-Length': '176',
      'Content-Type': 'text/html; charset=UTF-8',
      Date: 'Thu, 05 Nov 2020 18:06:45 GMT',
      Pragma: 'no-cache',
      Server: 'nginx/1.15.1',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY, SAMEORIGIN',
    },
  };
  it('calls fetch correctly', async () => {
    const url = 'url';
    const config = {};
    const numRetries = 5;
    fetchSslPinning.mockImplementation(() => Promise.resolve(fetchResolve));
    const response = await fetch(url, config, numRetries);

    expect(fetchSslPinning).toHaveBeenCalledTimes(1);
    expect(response).toStrictEqual(fetchResolve);
  });

  it('calls fetch incorrectly', async () => {
    const url = 'url';
    const config = {};
    const numRetries = 5;
    fetchSslPinning.mockImplementation(() => Promise.reject(new Error(error)));
    try {
      await fetch(url, config, numRetries);
    } catch (err) {
      expect(fetchSslPinning).toHaveBeenCalledTimes(numRetries);
      expect(err).toStrictEqual(Error(error));
    }
    expect.assertions(2);
  });

  it('calls fetch incorrectly (default retries)', async () => {
    const url = 'url';
    const config = {};
    fetchSslPinning.mockImplementation(() => Promise.reject(Error(error)));
    try {
      await fetch(url, config);
    } catch (err) {
      expect(fetchSslPinning).toHaveBeenCalledTimes(3);
      expect(err).toStrictEqual(Error(error));
    }
    expect.assertions(2);
  });

  it('calls fetch correctly after recursion', async () => {
    const url = 'url';
    const config = {};
    const numRetries = 5;
    fetchSslPinning.mockImplementationOnce(() => Promise.reject(Error(error)));
    fetchSslPinning.mockImplementationOnce(() => Promise.resolve(fetchResolve));

    const response = await fetch(url, config, numRetries);

    expect(fetchSslPinning).toHaveBeenCalledTimes(2);
    expect(response).toBe(fetchResolve);
  });
});
