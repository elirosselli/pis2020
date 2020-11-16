import makeRequest from '../../requests';
import { getToken } from '../index';
import { REQUEST_TYPES } from '../../utils/constants';
import ERRORS from '../../utils/errors';

jest.mock('../../requests');

afterEach(() => jest.clearAllMocks());

describe('getToken', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls getToken correctly', async () => {
    const token = 'token';
    const expiresIn = 3600;
    const idToken = 'idToken';
    const refreshToken = 'refreshToken';
    const tokenType = 'tokenType';
    makeRequest.mockReturnValue(
      Promise.resolve({
        token: 'token',
        message: ERRORS.NO_ERROR,
        errorCode: ERRORS.NO_ERROR.errorCode,
        errorDescription: ERRORS.NO_ERROR.errorDescription,
        expiresIn: 3600,
        idToken: 'idToken',
        refreshToken: 'refreshToken',
        tokenType: 'tokenType',
      }),
    );
    const response = await getToken();
    expect(response).toStrictEqual({
      token,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      expiresIn,
      idToken,
      refreshToken,
      tokenType,
    });
  });

  it('calls getToken incorrectly', async () => {
    makeRequest.mockReturnValue(Promise.reject(ERRORS.FAILED_REQUEST));
    try {
      await getToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.GET_TOKEN);
    expect.assertions(3);
  });
});
