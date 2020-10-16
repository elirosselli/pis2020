import { login } from '../index';
import makeRequest from '../../requests';

jest.mock('../../requests');
const REQUEST_TYPES = jest.requireActual('../../requests/constants');

afterEach(() => jest.clearAllMocks());

describe('login', () => {
  it('calls login and works correctly', async () => {
    const code = 'code';
    makeRequest.mockReturnValue(Promise.resolve(code));
    const response = await login();
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGIN);
    expect(response).toBe(code);
  });

  it('calls login and fails', async () => {
    const error = Error('error');
    makeRequest.mockReturnValue(Promise.reject(error));
    try {
      await login();
    } catch (err) {
      expect(err).toBe(error);
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGIN);
    expect.assertions(3);
  });
});
