import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { userInfoEndpoint } from '../../utils/endpoints';
import getUserInfo from '../getUserInfo';
import { getParameters } from '../../configuration';
import { validateSub } from '../../security';

jest.mock('../../configuration');

jest.mock('../../security', () => ({
  validateSub: jest.fn(() => true),
}));

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('getUserInfo', () => {
  it('calls getUserInfo with correct accessToken', async () => {
    const code = 'f24df0c4fcb142328b843d49753946af';
    const redirectUri = 'uri';
    const sub = '5968';
    const uid = 'uy-cid-12345678';
    getParameters.mockReturnValue({
      clientId: '898562',
      clientSecret: 'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b',
      accessToken: 'c9747e3173544b7b870d48aeafa0f661',
      redirectUri,
      code,
      sub,
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
            uid,
          }),
      }),
    );
    const response = await getUserInfo();

    expect(fetch).toHaveBeenCalledWith(userInfoEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Bearer c9747e3173544b7b870d48aeafa0f661`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
    });

    expect(validateSub).toHaveBeenCalledWith(sub);

    expect(response).toStrictEqual({
      nombre_completo: 'test',
      primer_apellido: 'test',
      primer_nombre: 'testNombre',
      segundo_apellido: 'testApellido',
      segundo_nombre: 'testSegundoNombre',
      sub: '5968',
      uid,
    });
  });

  it('calls getUserInfo with incorrect access token', async () => {
    getParameters.mockReturnValue({
      clientId: '',
      clientSecret: '',
      code: 'incorrectAccesToken',
    });

    const error = 'invalid_token';
    const errorDescription = 'The Access Token expired';

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
      await getUserInfo();
    } catch (err) {
      expect(err).toStrictEqual({
        error,
        error_description: errorDescription,
      });
    }

    expect(validateSub).not.toHaveBeenCalled();

    expect.assertions(2);
  });

  it('calls getUserInfo but subs do not match', async () => {
    validateSub.mockImplementation(() => false);
    const code = 'f24df0c4fcb142328b843d49753946af';
    const redirectUri = 'uri';
    const sub = '5968';
    getParameters.mockReturnValue({
      clientId: '898562',
      clientSecret: 'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b',
      accessToken: 'c9747e3173544b7b870d48aeafa0f661',
      redirectUri,
      code,
      sub,
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

    const error = Error('Sub no coinciden');
    try {
      await getUserInfo();
    } catch (err) {
      expect(err).toStrictEqual(error);
    }
    expect.assertions(1);
  });

  it('calls getUserInfo and fetch fails', async () => {
    const error = Error('error');
    fetch.mockImplementation(() => Promise.reject(error));
    try {
      await getUserInfo();
    } catch (err) {
      expect(err).toBe(error);
    }
    expect.assertions(1);
  });
});
