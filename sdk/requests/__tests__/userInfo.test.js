import { fetch } from 'react-native-ssl-pinning';
import { userInfoEndpoint } from '../endpoints';
import userInfo from '../userInfo';
import { getParameters } from '../../configuration';

jest.mock('../../configuration');

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

describe('userInfo', () => {
  it('calls userInfo with correct accesToken', async () => {
    const code = 'f24df0c4fcb142328b843d49753946af';
    const redirectUri = 'uri';
    getParameters.mockReturnValue({
      clientId: '898562',
      clientSecret: 'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b',
      accessToken: 'c9747e3173544b7b870d48aeafa0f661',
      redirectUri,
      code,
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            nombre_completo: 'test',
            primer_apellido: 'test',
            primer_nombre: 'testNombre',
            segundo_apellido: 'testApellido',
            segundo_nombre: 'testSegundoNombre',
            sub: '5968',
            uid: 'uy-cid-12345678',
          }),
      }),
    );
    const response = await userInfo();

    expect(fetch).toHaveBeenCalledWith(userInfoEndpoint, {
      method: 'GET',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Bearer c9747e3173544b7b870d48aeafa0f661`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
    });
    expect(response).toStrictEqual({
      nombre_completo: 'test',
      primer_apellido: 'test',
      primer_nombre: 'testNombre',
      segundo_apellido: 'testApellido',
      segundo_nombre: 'testSegundoNombre',
      sub: '5968',
      uid: 'uy-cid-12345678',
    });
  });

  it('calls userInfo with incorrect clientId or clientSecret or returns incorrect code', async () => {
    const error = 'invalid_grant';
    const errorDescription =
      'The provided authorization grant or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client';

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error,
            error_description: errorDescription,
          }),
      }),
    );

    try {
      await userInfo();
    } catch (err) {
      expect(err).toStrictEqual({
        error,
        error_description: errorDescription,
      });
    }
    expect.assertions(1);
  });

  it('calls userInfo and fetch fails', async () => {
    const error = Error('error');
    fetch.mockImplementation(() => Promise.reject(error));
    try {
      await userInfo();
    } catch (err) {
      expect(err).toBe(error);
    }
    expect.assertions(1);
  });
});
