import { login } from '../index';
import makeRequest from '../../requests';

jest.mock('../../requests');
const { REQUEST_TYPES } = jest.requireActual('../../requests');

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
    makeRequest.mockReturnValue(Promise.reject(Error()));
    try {
      await login();
    } catch (error) {
      expect(error).toMatchObject(Error());
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGIN);
    expect.assertions(3);
  });
});
