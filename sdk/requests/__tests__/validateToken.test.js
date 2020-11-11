import { fetch } from 'react-native-ssl-pinning';
import validateToken from '../validateToken';
import { validateTokenSecurity } from '../../security';
import { ERRORS } from '../../utils/constants';

jest.mock('../../security');

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

describe('validateToken', () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      json: () => Promise.reject(Error('fetch rejection')),
    }),
  );

  it('calls validateToken correctly but fetch rejects', async () => {
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
    validateTokenSecurity.mockReturnValue(
      Promise.resolve({
        jwk: jwksResponse,
        message: ERRORS.NO_ERROR,
        errorCode: ERRORS.NO_ERROR.errorCode,
        errorDescription: ERRORS.NO_ERROR.errorDescription,
      }),
    );
    const result = await validateToken();
    expect(validateTokenSecurity).toHaveBeenCalledWith(jwksResponse);
    expect(result).toStrictEqual({
      jwk: jwksResponse,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('calls validateToken correctly but token is not valid', async () => {
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
