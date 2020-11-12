import { fetch } from 'react-native-ssl-pinning';
import { ERRORS } from '../../utils/constants';
import { issuer } from '../../utils/endpoints';
import { getParameters } from '../../configuration';
import validateToken from '../validateToken';
import { validateTokenSecurity } from '../../security';

jest.mock('../../security');
jest.mock('../../configuration');

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

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

const idToken = 'idToken';
const clientId = 'clientId';

describe('validateToken', () => {
  fetch.mockImplementationOnce(() =>
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
    ),
  );

  it('calls validateToken correctly but fetch rejects', async () => {
    getParameters.mockReturnValue({
      idToken,
      clientId,
    });

    try {
      await validateToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });

  fetch.mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => Promise.resolve(jwksResponse),
    }),
  );

  it('calls validateToken correctly and token is valid', async () => {
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
    const result = await validateToken();
    expect(validateTokenSecurity).toHaveBeenCalledWith(
      jwksResponse,
      idToken,
      clientId,
      issuer(),
    );
    expect(result).toStrictEqual({
      jwk: jwksResponse,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('calls validateToken correctly but token is not valid', async () => {
    getParameters.mockReturnValue({
      idToken,
      clientId,
    });

    validateTokenSecurity.mockReturnValue(
      Promise.reject(ERRORS.INVALID_ID_TOKEN),
    );

    try {
      await validateToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(1);
  });
});
