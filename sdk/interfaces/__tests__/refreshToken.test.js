import makeRequest from '../../requests';
import { refreshToken } from '../index';
import { ERRORS, REQUEST_TYPES } from '../../utils/constants';

jest.mock('../../requests');

afterEach(() => jest.clearAllMocks());

describe('refreshToken', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls refreshToken correctly', async () => {
    const token = 'token';
    const expiresIn = 3600;
    const idToken = 'idToken';
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

    const response = await refreshToken();

    expect(response).toStrictEqual({
      token,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      expiresIn,
      idToken,
      refreshToken: 'refreshToken',
      tokenType,
    });
  });

  it('calls refreshToken incorrectly', async () => {
    makeRequest.mockReturnValue(Promise.reject(ERRORS.FAILED_REQUEST));
    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }

    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.GET_REFRESH_TOKEN);
    expect.assertions(3);
  });
});
