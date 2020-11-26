import { Platform } from 'react-native';
import { fetch } from 'react-native-ssl-pinning';
import ERRORS from '../../utils/errors';
import {
  logout,
  getParameters,
  setParameters,
  resetParameters,
} from '../../interfaces';

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
}));

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

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

const idToken = 'idToken';
const correctLogoutEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=${mockState}`;
const correctLogoutProductionEndpoint = `https://auth.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=${mockState}`;
const invalidUrl = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=`;

const mockMutex = jest.fn();
jest.mock('async-mutex', () => ({
  Mutex: jest.fn(() => ({
    acquire: () => mockMutex,
  })),
}));

describe('configuration & security modules and logout integration', () => {
  it('calls set parameters and logout', async () => {
    setParameters({ idToken, production: false });

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
      disableAllSecurity: false,
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
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
      pkPinning: false,
      disableAllSecurity: true,
      sslPinning: false,
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(5);
  });

  it('calls set parameters and logout with invalid idTokenHint', async () => {
    try {
      setParameters({ idToken: 'invalid_id_token' });
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and logout with invalid production', async () => {
    try {
      setParameters({ idToken, production: 'invalid_production' });
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
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
      expect(error).toBe(ERRORS.INVALID_STATE);
    }

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      disableAllSecurity: false,
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and logout, fetch returns different state', async () => {
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
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=differentState`,
      }),
    );

    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_STATE);
    }

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      disableAllSecurity: false,
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and logout, fetch returns empty idToken', async () => {
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
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=&post_logout_redirect_uri=&state=${mockState}`,
      }),
    );

    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN_HINT);
    }

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      disableAllSecurity: false,
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and logout, fetch returns different idToken', async () => {
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
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=differentIdToken&post_logout_redirect_uri=&state=${mockState}`,
      }),
    );

    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN_HINT);
    }

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      disableAllSecurity: false,
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and logout, fetch returns invalid url with idToken and state', async () => {
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
      scope: '',
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: `InvalidUrl?id_token_hint=${idToken}&post_logout_redirect_uri=&state=${mockState}`,
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
      disableAllSecurity: false,
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and logout, fetch returns invalid url without idToken and state', async () => {
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
      disableAllSecurity: false,
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
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
      disableAllSecurity: false,
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
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
      disableAllSecurity: false,
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });
});
