import { validateTokenSecurity as validateToken } from '../index';
import validateTokenSecurity from '../validateTokenSecurity';

jest.mock('../validateTokenSecurity');

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
  it('calls validateTokenSecurity and works correctly', async () => {
    console.log('runn');
    const response = {
      jwks: jwksResponse,
      error: true,
    };
    validateTokenSecurity.mockImplementation(() => Promise.resolve(response));
    const result = await validateToken();
    expect(result).toBe(response);
  });

  it('calls validateTokenSecurity and fails', async () => {
    const response = {
      jwks: jwksResponse,
      error: false,
    };
    validateTokenSecurity.mockImplementation(() =>
      Promise.reject(Error(response)),
    );
    try {
      await validateToken();
    } catch (err) {
      expect(err).toStrictEqual(Error(response));
    }
    expect.assertions(1);
  });
});
