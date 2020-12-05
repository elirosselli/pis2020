/* eslint-disable prefer-promise-reject-errors */
import { Platform } from 'react-native';
import { fetch } from 'react-native-ssl-pinning';
import { REQUEST_TYPES } from '../../utils/constants';
import ERRORS from '../../utils/errors';
import {
  setParameters,
  getParameters,
  resetParameters,
} from '../../configuration';
import makeRequest from '../../requests';

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
}));

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
const accessToken = 'accessToken';
const userInfoEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/userinfo';
const userInfoProductionEndpoint =
  'https://auth.iduruguay.gub.uy/oidc/v1/userinfo';
const userId = 'uy-cid-12345678';
const idToken = 'valid.id.token';

const validFetchMockImplementation = () =>
  Promise.resolve({
    status: 200,
    json: () =>
      Promise.resolve({
        sub: mockSub,
      }),
  });

const mockMutex = jest.fn();
jest.mock('async-mutex', () => ({
  Mutex: jest.fn(() => ({
    acquire: () => mockMutex,
  })),
}));

describe('configuration & security modules and make request type get user info integration', () => {
  it('calls set parameters and makes a get user info request (no scope claims)', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });

    fetch.mockImplementation(validFetchMockImplementation);

    const response = await makeRequest(REQUEST_TYPES.GET_USER_INFO);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(userInfoEndpoint, {
      method: 'GET',
      disableAllSecurity: false,
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls set parameters and makes a get user info request with production set to true', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    const production = true;

    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken,
      production,
    });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });

    fetch.mockImplementation(validFetchMockImplementation);

    const response = await makeRequest(REQUEST_TYPES.GET_USER_INFO);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(userInfoProductionEndpoint, {
      method: 'GET',
      disableAllSecurity: true,
      pkPinning: false,
      sslPinning: false,
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
      production,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls set parameters and makes a get user info request (one scope claims)', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    const scope = 'personal_info';
    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken,
      scope,
    });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope,
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
      disableAllSecurity: false,
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope,
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls set parameters and makes a get user info request (all scopes claims)', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    const scope = 'personal_info%20profile%20document%20email%20auth_info';
    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken,
      scope,
    });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code,
      accessToken,
      idToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      scope,
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
      disableAllSecurity: false,
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope,
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls set parameters and makes a get user info request with empty accessToken', async () => {
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
      idToken,
    });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
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
      production: false,
      code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls set parameters and makes a get user info request with empty idToken', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
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
      code,
      accessToken,
      production: false,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
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
      code,
      production: false,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls set parameters and makes a get user info request with invalid accessToken', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';

    try {
      setParameters({
        clientId,
        clientSecret,
        accessToken: 'invalid_access_token',
        code,
        redirectUri,
        idToken,
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_TOKEN);
    }

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_TOKEN);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(5);
  });

  it('calls set parameters and makes a get user info request with invalid idToken', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';

    try {
      setParameters({
        clientId,
        clientSecret,
        accessToken,
        code,
        redirectUri,
        idToken: 'invalid_id_token',
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN);
    }

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_TOKEN);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(5);
  });

  it('calls set parameters and makes a get user info request with incorrectly encoded idToken', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';
    setParameters({
      clientId,
      clientSecret,
      accessToken,
      code,
      redirectUri,
      idToken: 'id.token',
    });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      code,
      production: false,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: 'id.token',
      scope: '',
    });

    fetch.mockImplementation(validFetchMockImplementation);

    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN);
    }

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(userInfoEndpoint, {
      method: 'GET',
      disableAllSecurity: false,
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

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: 'id.token',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and makes a get user info request with invalid production', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
    const redirectUri = 'redirectUri';

    try {
      setParameters({
        clientId,
        clientSecret,
        accessToken,
        code,
        redirectUri,
        idToken,
        production: 'invalid_production',
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_PRODUCTION);
    }

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_TOKEN);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(5);
  });

  it('calls set parameters and makes a get user info request with expired accessToken with WWW authenticate header', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.reject({
        headers: {
          'WWW-Authenticate':
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls set parameters and makes a get user info request with expired accessToken with Www authenticate header', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls set parameters and makes a get user info request, fetch fails', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls set parameters and makes a get user info request, fetch returns some error', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls set parameters and makes a get user info request, fetch returns some error with WWW authenticate header', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    fetch.mockImplementation(() =>
      Promise.reject({
        headers: {
          'WWW-Authenticate':
            'error="other_error", error_description="other_error_description"',
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls set parameters and makes a get user info request, fetch returns some error with Www authenticate header', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    fetch.mockImplementation(() =>
      Promise.reject({
        headers: {
          'Www-Authenticate':
            'error="other_error", error_description="other_error_description"',
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls set parameters and makes a get user info request, responseJson.sub invalid', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'correctCode';
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
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            sub: '',
          }),
      }),
    );

    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_SUB);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });
});
