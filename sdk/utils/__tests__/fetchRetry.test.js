import { fetch } from 'react-native-ssl-pinning';
import fetchWrapper from '../fetchRetry';
import fetchRetry from '../fetchRetry';

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

describe('fetchRetry', () => {
  afterEach(() => jest.clearAllMocks());
  it('calls fetch correctly', async () => {
    const url = 'url';
    const config = {};
    const numRetries = 5;
    fetch.mockImplementation(() => Promise.resolve('Valid'));
    const response = await fetchRetry(url, config, numRetries);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toBe('Valid');
  });
  it('calls fetch incorrectly', async () => {
    const url = 'url';
    const config = {};
    const numRetries = 5;
    fetch.mockImplementation(() => Promise.reject(new Error('Invalid')));
    try {
      await fetchWrapper(url, config, numRetries);
    } catch (err) {
      expect(fetch).toHaveBeenCalledTimes(numRetries);
      expect(err).toStrictEqual(Error('Invalid'));
    }
    expect.assertions(2);
  });
  it('calls fetch correctly after recursion', async () => {
    const url = 'url';
    const config = {};
    const numRetries = 5;
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Invalid')));
    fetch.mockImplementationOnce(() => Promise.resolve('Valid'));

    const response = await fetchRetry(url, config, numRetries);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(response).toBe('Valid');
  });
});
