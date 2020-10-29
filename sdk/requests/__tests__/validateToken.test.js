import { fetch } from 'react-native-ssl-pinning';

import validateToken from '../validateToken';
import validateTokenSecurity from '../../security/index';

jest.mock('../../security');

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

describe('validateToken', () => {
  const jwksResponse = {
    keys: [
      {
        kty: 'RSA',
        alg: 'RS256',
        use: 'sig',
        kid: '7aa8e7f3916dcb3f2a511d3cfb198bf4',
        x5c: [
          'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHGni+BdhlfT9+rtBLy/b95dr6fTcGtR/UKBYjHCNcP3n/FAlkirVR2ISde+CHUEmHAQ2eXv60BfjxhZHlvsHhRN9AKmPHdxZ4eDGqU8VvDyTKJZ+NV7pdMImKgv+p56eJ8Sl6JpTTFmxklCD0/1zuVVFiYQQVlDf11IfgzFAlpQIDAQAB',
        ],
        n:
          'xxp4vgXYZX0_fq7QS8v2_eXa-n03BrUf1CgWIxwjXD95_xQJZIq1UdiEnXvgh1BJhwENnl7-tAX48YWR5b7B4UTfQCpjx3cWeHgxqlPFbw8kyiWfjVe6XTCJioL_qeenifEpeiaU0xZsZJQg9P9c7lVRYmEEFZQ39dSH4MxQJaU',
        e: 'AQAB',
      },
    ],
  };
  fetch.mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => Promise.resolve(jwksResponse),
    }),
  );

  it('calls validateToken correctly and token is valid', async () => {
    validateTokenSecurity.mockReturnValue(
      Promise.resolve({ jwks: jwksResponse, error: 'Correct' }),
    );

    const result = await validateToken();

    expect(validateTokenSecurity).toHaveBeenCalledWith(jwksResponse);
    expect(result).toStrictEqual({ jwks: jwksResponse, error: 'Correct' });
  });

  it('calls validateToken correctly but token is not valid', async () => {
    validateTokenSecurity.mockReturnValue(
      Promise.resolve(new Error({ jwks: jwksResponse, error: 'Incorrect' })),
    );

    expect(validateTokenSecurity).toHaveBeenCalledWith(jwksResponse);

    try {
      await validateToken();
    } catch (err) {
      expect(err).toStrictEqual({
        jwks: jwksResponse,
        error: 'Incorrect',
      });
    }
    expect.assertions(1);
  });
});
