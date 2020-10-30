import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import REQUEST_TYPES from '../utils/constants';
import {
  setParameters,
  getParameters,
  resetParameters,
} from '../configuration';
import makeRequest from '../requests';

const mockAddEventListener = jest.fn();
const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
  openURL: mockLinkingOpenUrl,
}));

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

afterEach(() => jest.clearAllMocks());

beforeEach(() => {
  resetParameters();
});

const contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
const accept = 'application/json';
const accessToken = 'c9747e3173544b7b870d48aeafa0f661';
const userInfoEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/userinfo';

describe('configuration module and make request type user info integration', () => {
  const userId = 'uy-cid-12345678';

  it('calls set parameters and makes a user info request with all scopes', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
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
            uid: userId,
            name: 'name',
            given_name: 'given_name',
            family_name: 'family_name',
            pais_documento: 'pais_documento',
            tipo_documento: 'tipo_documento',
            numero_documento: 'numero_documento',
            email: 'email',
            email_verified: 'email_verified',
            rid: 'rid',
            nid: 'nid',
            ae: 'ae',
          }),
      }),
    );

    const response = await makeRequest(REQUEST_TYPES.GET_USER_INFO);

    expect(fetch).toHaveBeenCalledWith(userInfoEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Bearer ${parameters.accessToken}`,
        'Content-Type': contentType,
        Accept: accept,
      },
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toStrictEqual({
      nombre_completo: 'test',
      primer_apellido: 'test',
      primer_nombre: 'testNombre',
      segundo_apellido: 'testApellido',
      segundo_nombre: 'testSegundoNombre',
      sub: '5968',
      uid: userId,
      name: 'name',
      given_name: 'given_name',
      family_name: 'family_name',
      pais_documento: 'pais_documento',
      tipo_documento: 'tipo_documento',
      numero_documento: 'numero_documento',
      email: 'email',
      email_verified: 'email_verified',
      rid: 'rid',
      nid: 'nid',
      ae: 'ae',
    });
  });

  it('calls set parameters and makes a user info request with personal_info scope', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
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
            uid: userId,
            rid: 'rid',
          }),
      }),
    );

    const response = await makeRequest(REQUEST_TYPES.GET_USER_INFO);

    expect(fetch).toHaveBeenCalledWith(userInfoEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Bearer ${parameters.accessToken}`,
        'Content-Type': contentType,
        Accept: accept,
      },
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toStrictEqual({
      nombre_completo: 'test',
      primer_apellido: 'test',
      primer_nombre: 'testNombre',
      segundo_apellido: 'testApellido',
      segundo_nombre: 'testSegundoNombre',
      sub: '5968',
      uid: userId,
      rid: 'rid',
    });
  });

  it('calls set parameters and makes a user info request with no claims', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({}),
      }),
    );

    const response = await makeRequest(REQUEST_TYPES.GET_USER_INFO);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(userInfoEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Bearer ${parameters.accessToken}`,
        'Content-Type': contentType,
        Accept: accept,
      },
    });

    expect(response).toStrictEqual({});
  });

  it('calls set parameters and makes a user info request with expired access token', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    const error1 = 'invalid_token';
    const errorDescription = 'The Access Token expired';
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error1,
            error_description: errorDescription,
          }),
      }),
    );

    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toStrictEqual({
        error1,
        error_description: errorDescription,
      });
    }
    expect.assertions(2);
  });
});
