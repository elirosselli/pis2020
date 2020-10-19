import { logout } from '../index';
import makeRequest from '../../requests';
import REQUEST_TYPES from '../../utils/constants';

jest.mock('../../requests');

afterEach(() => jest.clearAllMocks());

describe('logout', () => {
  it('calls logout and works correctly', async () => {
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    makeRequest.mockReturnValue(Promise.resolve(postLogoutRedirectUri));
    const response = await logout();
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGOUT);
    expect(response).toBe(postLogoutRedirectUri);
  });
  it('calls logout and fails', async () => {
    const error = Error('error');
    makeRequest.mockReturnValue(Promise.reject(error));
    try {
      await logout();
    } catch (err) {
      expect(err).toBe(error);
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGOUT);
    expect.assertions(3);
  });
});
