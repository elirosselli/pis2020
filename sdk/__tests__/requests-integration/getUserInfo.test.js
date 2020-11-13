/* eslint-disable prefer-promise-reject-errors */
import { Platform } from 'react-native';
import { fetch } from 'react-native-ssl-pinning';
import { REQUEST_TYPES, ERRORS } from '../../utils/constants';
import {
  setParameters,
  getParameters,
  resetParameters,
} from '../../configuration';
import makeRequest from '../../requests';

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
const userId = 'uy-cid-12345678';

describe('configuration module and make request type get user info integration', () => {
  it('calls set parameters and makes a get user info request with all scopes', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
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
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
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

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
  });

  it('calls set parameters and makes a get user info request with personal_info scope', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
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
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      nombre_completo: 'test',
      primer_apellido: 'test',
      primer_nombre: 'testNombre',
      segundo_apellido: 'testApellido',
      segundo_nombre: 'testSegundoNombre',
      sub: '5968',
      uid: userId,
      rid: 'rid',
    });

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
  });

  it('calls set parameters and makes a get user info request with no claims', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
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

    expect(response).toStrictEqual({
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
  });

  it('calls set parameters and makes a get user info request with expired access token', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
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
      Promise.reject({
        headers: {
          'Www-Authenticate':
            'error="invalid_token", error_description="The access token provided is expired, revoked, malformed, or invalid for other reasons"',
        },
      }),
    );

    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_TOKEN);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls set parameters, makes a get user info request and fetch fails', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
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
        status: 400,
        json: () => Promise.resolve(),
      }),
    );
    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls set parameters, makes a get user info request and returns some error', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
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
      Promise.reject({
        headers: {
          'some-error':
            'error="some_error", error_description="Error different from invalid access token"',
        },
      }),
    );
    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls set parameters, makes a get user info request and returns some error with www authenticate header', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
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
      Promise.reject({
        headers: {
          'Www-Authenticate':
            'error="other_error", error_description="The access token provided is expired, revoked, malformed, or invalid for other reasons"',
        },
      }),
    );
    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls set parameters and makes a get user info request with empty access token', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    setParameters({
      clientId,
      clientSecret,
      accessToken: '',
      code,
      redirectUri,
    });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
      code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_TOKEN);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      production: false,
      code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });
});
