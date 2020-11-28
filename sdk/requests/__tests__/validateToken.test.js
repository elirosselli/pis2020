import { fetch } from '../../utils/helpers';
import ERRORS from '../../utils/errors';
import { issuer } from '../../utils/endpoints';
import { getParameters } from '../../configuration';
import validateToken from '../validateToken';
import { validateTokenSecurity } from '../../security';

jest.mock('../../security');
jest.mock('../../configuration');

jest.mock('../../utils/helpers', () => ({
  ...jest.requireActual('../../utils/helpers'),
  fetch: jest.fn(),
}));

const mockMutex = jest.fn();
jest.mock('async-mutex', () => ({
  Mutex: jest.fn(() => ({
    acquire: () => mockMutex,
  })),
}));

const idToken = 'idToken';
const clientId = 'clientId';
const jwksResponse = {
  keys: [
    {
      kty: 'RSA',
      alg: 'RS256',
      use: 'sig',
      kid: 'kid',
      x5c: ['x5c'],
      n: 'nValue',
      e: 'eValue',
    },
  ],
};

afterEach(() => {
  jest.clearAllMocks();
});

const validFetchMockImplemtation = () =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve(jwksResponse),
  });

const invalidFetchMockImplementation = () =>
  Promise.reject(
    Error({
      status: 404,
      bodyString:
        '<h1>Not Found</h1><p>The requested URL /oidc/v1/jwksw was not found on this server.</p>',
      headers: {
        'Cache-Control': 'no-store',
        Connection: 'close',
        'Content-Length': '176',
        'Content-Type': 'text/html; charset=UTF-8',
        Date: 'Thu, 05 Nov 2020 18:06:45 GMT',
        Pragma: 'no-cache',
        Server: 'nginx/1.15.1',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY, SAMEORIGIN',
      },
    }),
  );

describe('validateToken', () => {
  it('calls validateToken', async () => {
    getParameters.mockReturnValue({
      idToken,
      clientId,
    });

    validateTokenSecurity.mockReturnValue(
      Promise.resolve({
        jwk: jwksResponse,
        message: ERRORS.NO_ERROR,
        errorCode: ERRORS.NO_ERROR.errorCode,
        errorDescription: ERRORS.NO_ERROR.errorDescription,
      }),
    );

    fetch.mockImplementation(validFetchMockImplemtation);

    const result = await validateToken();

    expect(validateTokenSecurity).toHaveBeenCalledWith(
      jwksResponse,
      idToken,
      clientId,
      issuer(),
    );
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      jwk: jwksResponse,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('calls validateToken with invalid idToken', async () => {
    getParameters.mockReturnValue({
      idToken,
      clientId,
    });

    validateTokenSecurity.mockReturnValue(
      Promise.reject(ERRORS.INVALID_ID_TOKEN),
    );

    fetch.mockImplementation(validFetchMockImplemtation);

    try {
      await validateToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN);
    }

    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });

  it('calls validateToken with empty idToken', async () => {
    getParameters.mockReturnValue({ clientId });

    try {
      await validateToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN);
    }

    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });

  it('calls validateToken with empty clientId', async () => {
    getParameters.mockReturnValue({ idToken });

    try {
      await validateToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });

  it('calls validateToken, fetch rejects', async () => {
    getParameters.mockReturnValue({
      idToken,
      clientId,
    });

    fetch.mockImplementation(invalidFetchMockImplementation);

    try {
      await validateToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
