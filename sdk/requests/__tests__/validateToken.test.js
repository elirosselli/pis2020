import { fetch } from 'react-native-ssl-pinning';
import validateToken from '../validateToken';
import { validateTokenSecurity } from '../../security';

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
      expect(error).toStrictEqual(Error('fetch rejection'));
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
      Promise.resolve({ jwk: jwksResponse, error: true }),
    );
    const result = await validateToken();
    expect(validateTokenSecurity).toHaveBeenCalledWith(jwksResponse);
    expect(result).toStrictEqual({ jwk: jwksResponse, error: true });
  });

  it('calls validateToken correctly but token is not valid', async () => {
    validateTokenSecurity.mockReturnValue(
      Promise.reject(Error({ jwks: jwksResponse, error: false })),
    );

    try {
      await validateToken();
    } catch (error) {
      expect(error).toStrictEqual(
        Error({
          jwks: jwksResponse,
          error: false,
        }),
      );
    }
    expect.assertions(1);
  });
});
