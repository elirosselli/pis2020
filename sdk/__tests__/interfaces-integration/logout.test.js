import { Platform } from 'react-native';
import { fetch } from 'react-native-ssl-pinning';
import ERRORS from '../../utils/errors';
import {
  logout,
  getParameters,
  setParameters,
  resetParameters,
} from '../../interfaces';

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

jest.mock('uuid', () =>
  jest.fn().mockReturnValue('b5be6251-9589-43bf-b12f-f6447dc179c0'),
);

const mockState = '3035783770';
jest.mock(
  'mersenne-twister',
  () =>
    function mockMersenne() {
      return {
        random_int: jest.fn(() => mockState),
      };
    },
);

afterEach(() => jest.clearAllMocks());

beforeEach(() => {
  resetParameters();
});

const idToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw';
const correctLogoutEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=${mockState}`;
const correctLogoutProductionEndpoint = `https://auth.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=${mockState}`;
const invalidUrl = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=`;

describe('configuration & security modules and logout integration', () => {
  it('calls set parameters and logout', async () => {
    setParameters({ idToken });

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
      idToken,
      state: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: correctLogoutEndpoint,
      }),
    );
    const response = await logout();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(response).toStrictEqual({
      state: mockState,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });

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
      state: '',
      scope: '',
    });
  });

  it('calls set parameters and logout with production set to true', async () => {
    const production = true;
    setParameters({ idToken, production });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production,
      code: '',
      accessToken: '',
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
        url: correctLogoutProductionEndpoint,
      }),
    );
    const response = await logout();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutProductionEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(response).toStrictEqual({
      state: mockState,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
  });

  it('calls set parameters and logout with empty idTokenHint', async () => {
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
      state: '',
      scope: '',
    });

    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN_HINT);
    }
    expect(fetch).not.toHaveBeenCalled();

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
      state: '',
      scope: '',
    });
    expect.assertions(4);
  });

  it('calls set parameters and logout with invalid idTokenHint', async () => {
    setParameters({ idToken: 'invalid_id_token' });
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
      state: '',
      scope: '',
    });

    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN_HINT);
    }
    expect(fetch).not.toHaveBeenCalled();

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
      state: '',
      scope: '',
    });
    expect.assertions(4);
  });

  it('calls set parameters and logout with invalid production', async () => {
    setParameters({ production: 'invalid_production' });
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
      state: '',
      scope: '',
    });

    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN_HINT);
    }
    expect(fetch).not.toHaveBeenCalled();

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
      state: '',
      scope: '',
    });
    expect.assertions(4);
  });

  it('calls set parameters and logout, fetch returns empty state', async () => {
    setParameters({ idToken });

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
      idToken,
      state: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: invalidUrl,
      }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_URL_LOGOUT);
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });

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
      idToken,
      state: mockState,
      scope: '',
    });
    expect.assertions(5);
  });

  it('calls set parameters and logout, fetch returns invalid url', async () => {
    setParameters({ idToken });

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
      idToken,
      state: '',
      scope: '',
    });
    fetch.mockImplementation(() =>
      Promise.resolve({ status: 200, url: 'InvalidUrl' }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_URL_LOGOUT);
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
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
      idToken,
      state: mockState,
      scope: '',
    });
    expect.assertions(5);
  });

  it('calls set parameters and logout, fetch fails (returning 404)', async () => {
    setParameters({ idToken });

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
      idToken,
      state: '',
      scope: '',
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        url: '',
      }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
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
      idToken,
      state: mockState,
      scope: '',
    });
    expect.assertions(5);
  });

  it('calls set parameters and logout, fetch fails (promise rejected)', async () => {
    setParameters({ idToken });

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
      idToken,
      state: '',
      scope: '',
    });
    const err = Error('error');
    fetch.mockImplementation(() => Promise.reject(err));
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
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
      idToken,
      state: mockState,
      scope: '',
    });
    expect.assertions(5);
  });
});
