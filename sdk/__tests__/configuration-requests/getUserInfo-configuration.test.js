/* eslint-disable prefer-promise-reject-errors */
import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { REQUEST_TYPES, ERRORS } from '../../utils/constants';
import {
  setParameters,
  getParameters,
  resetParameters,
} from '../../configuration';
import makeRequest from '../../requests';

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

const mockSub = '5485';

jest.mock('jsrsasign', () => ({
  __esModule: true,
  default: {
    jws: {
      JWS: { readSafeJSONString: jest.fn(() => ({ sub: mockSub })) },
    },
  },
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
const idToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw';

describe('configuration module and make request type get user info integration', () => {
  it('calls set parameters and makes a get user info request with all scopes', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken,
    });

    let parameters = getParameters();
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
      idToken,
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
            sub: mockSub,
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
      sub: mockSub,
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
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
    });
  });

  it('calls set parameters and makes a get user info request with personal_info scope', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken,
    });

    let parameters = getParameters();
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
      idToken,
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
            sub: mockSub,
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
      sub: mockSub,
      uid: userId,
      rid: 'rid',
    });

    parameters = getParameters();
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
      idToken,
      state: '',
      scope: '',
    });
  });

  it('calls set parameters and makes a get user info request with no claims', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken,
    });

    let parameters = getParameters();
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
      idToken,
      state: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            sub: mockSub,
          }),
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
      sub: mockSub,
    });

    parameters = getParameters();
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
      idToken,
      state: '',
      scope: '',
    });
  });

  it('calls set parameters and makes a get user info request with expired access token', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken,
    });

    let parameters = getParameters();
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
      idToken,
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
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls getUserInfo and fetch fails', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken,
    });

    let parameters = getParameters();
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
      idToken,
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
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls getUserInfo and returns some error', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken,
    });

    let parameters = getParameters();
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
      idToken,
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
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls getUserInfo and returns some error with www authenticate header', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken,
    });

    let parameters = getParameters();
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
      idToken,
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
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls getUserInfo with empty access token', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({
      clientId,
      clientSecret,
      accessToken: '',
      code,
      redirectUri,
      idToken,
    });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
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
      code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls getUserInfo with empty id token', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken: '',
    });

    let parameters = getParameters();
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
    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_ID_TOKEN);
    }
    parameters = getParameters();
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
    expect.assertions(3);
  });
});
