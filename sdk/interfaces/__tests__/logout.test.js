import { logout } from '../index';
import makeRequest from '../../requests';
import { REQUEST_TYPES, ERRORS } from '../../utils/constants';

jest.mock('../../requests');

afterEach(() => jest.clearAllMocks());

describe('logout', () => {
  it('calls logout and works correctly', async () => {
    const state = 'state';
    makeRequest.mockReturnValue(
      Promise.resolve({
        state,
        message: ERRORS.NO_ERROR,
        errorCode: ERRORS.NO_ERROR.errorCode,
        errorDescription: ERRORS.NO_ERROR.errorDescription,
      }),
    );
    const response = await logout();
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGOUT);
    expect(response).toStrictEqual({
      state,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('calls logout and fails', async () => {
    makeRequest.mockReturnValue(Promise.reject(ERRORS.FAILED_REQUEST));
    try {
      await logout();
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGOUT);
    expect.assertions(3);
  });
});
