import { Platform } from 'react-native';
import { fetch } from 'react-native-ssl-pinning';
import { REQUEST_TYPES } from '../../utils/constants';
import ERRORS from '../../utils/errors';
import {
  getParameters,
  setParameters,
  resetParameters,
} from '../../configuration';
import makeRequest from '../../requests';

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

describe('configuration & security modules and make request type logout integration', () => {
  it('calls set parameters and makes a logout request', async () => {
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
    const response = await makeRequest(REQUEST_TYPES.LOGOUT);
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

    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls set parameters and makes a logout request with production set to true', async () => {
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
    const response = await makeRequest(REQUEST_TYPES.LOGOUT);
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
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls set parameters and makes a logout request with empty idTokenHint', async () => {
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
      await makeRequest(REQUEST_TYPES.LOGOUT);
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
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(5);
  });

  it('calls set parameters and makes a logout request with invalid idTokenHint', async () => {
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
      state: '',
      scope: '',
    });

    try {
      await makeRequest(REQUEST_TYPES.LOGOUT);
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
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and makes a logout request with invalid production', async () => {
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
      state: '',
      scope: '',
    });

    try {
      await makeRequest(REQUEST_TYPES.LOGOUT);
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
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and makes a logout request, fetch returns empty state', async () => {
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
      await makeRequest(REQUEST_TYPES.LOGOUT);
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
      state: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and makes a logout request, fetch returns invalid url', async () => {
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
      await makeRequest(REQUEST_TYPES.LOGOUT);
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
      state: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and makes a logout request, fetch fails (returning 404)', async () => {
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
      await makeRequest(REQUEST_TYPES.LOGOUT);
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
      state: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls set parameters and makes a logout request, fetch fails (promise rejected)', async () => {
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
      await makeRequest(REQUEST_TYPES.LOGOUT);
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
      state: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });
});
