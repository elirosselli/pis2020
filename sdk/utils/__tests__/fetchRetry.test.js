import { fetch as fetchSslPinning } from 'react-native-ssl-pinning';
import { fetch } from '../helpers';

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

describe('fetchRetry', () => {
  afterEach(() => jest.clearAllMocks());
  it('calls fetch correctly', async () => {
    const url = 'url';
    const config = {};
    const numRetries = 5;
    fetchSslPinning.mockImplementation(() => Promise.resolve('Valid'));
    const response = await fetch(url, config, numRetries);

    expect(fetchSslPinning).toHaveBeenCalledTimes(1);
    expect(response).toBe('Valid');
  });

  it('calls fetch incorrectly', async () => {
    const url = 'url';
    const config = {};
    const numRetries = 5;
    fetchSslPinning.mockImplementation(() =>
      Promise.reject(new Error('Invalid')),
    );
    try {
      await fetch(url, config, numRetries);
    } catch (err) {
      expect(fetchSslPinning).toHaveBeenCalledTimes(numRetries);
      expect(err).toStrictEqual(Error('Invalid'));
    }
    expect.assertions(2);
  });

  it('calls fetch incorrectly (default retries)', async () => {
    const url = 'url';
    const config = {};
    fetchSslPinning.mockImplementation(() =>
      Promise.reject(new Error('Invalid')),
    );
    try {
      await fetch(url, config);
    } catch (err) {
      expect(fetchSslPinning).toHaveBeenCalledTimes(3);
      expect(err).toStrictEqual(Error('Invalid')); 
    }
    expect.assertions(2);
  });

  it('calls fetch correctly after recursion', async () => {
    const url = 'url';
    const config = {};
    const numRetries = 5;
    fetchSslPinning.mockImplementationOnce(() =>
      Promise.reject(new Error('Invalid')),
    );
    fetchSslPinning.mockImplementationOnce(() => Promise.resolve('Valid'));

    const response = await fetch(url, config, numRetries);

    expect(fetchSslPinning).toHaveBeenCalledTimes(2);
    expect(response).toBe('Valid');
  });
});
