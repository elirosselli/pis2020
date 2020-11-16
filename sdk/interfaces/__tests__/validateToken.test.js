import makeRequest from '../../requests';
import { validateToken } from '../index';
import ERRORS from '../../utils/errors';

jest.mock('../../requests');

afterEach(() => jest.clearAllMocks());

describe('validateToken', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls validateToken with valid token', async () => {
    const result = {
      jwks: 'jwks',
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    };
    makeRequest.mockReturnValue(Promise.resolve(result));
    const response = await validateToken();
    expect(response).toBe(result);
  });

  it('calls validateToken with invalid token', async () => {
    makeRequest.mockReturnValue(Promise.reject(ERRORS.INVALID_ID_TOKEN));
    try {
      await validateToken();
    } catch (error) {
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(1);
  });

  it('calls validateToken with failed fetch', async () => {
    makeRequest.mockReturnValue(Promise.reject(ERRORS.FAILED_REQUEST));
    try {
      await validateToken();
    } catch (error) {
      expect(error).toStrictEqual(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });

  it('calls validateToken with no clientId', async () => {
    makeRequest.mockReturnValue(Promise.reject(ERRORS.INVALID_CLIENT_ID));
    try {
      await validateToken();
    } catch (error) {
      expect(error).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    expect.assertions(1);
  });
});
