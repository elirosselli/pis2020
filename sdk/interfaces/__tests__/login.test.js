import { login } from '../index';
import makeRequest from '../../requests';
import { REQUEST_TYPES, ERRORS } from '../../utils/constants';

jest.mock('../../requests');

afterEach(() => jest.clearAllMocks());

describe('login', () => {
  it('calls login and works correctly', async () => {
    const code = 'code';
    makeRequest.mockReturnValue(
      Promise.resolve({
        code,
        message: ERRORS.NO_ERROR,
        errorCode: ERRORS.NO_ERROR.errorCode,
        errorDescription: ERRORS.NO_ERROR.errorDescription,
      }),
    );
    const response = await login();
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGIN);
    expect(response).toStrictEqual({
      code,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('calls login and fails', async () => {
    makeRequest.mockReturnValue(Promise.reject(ERRORS.FAILED_REQUEST));
    try {
      await login();
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGIN);
    expect.assertions(3);
  });
});
