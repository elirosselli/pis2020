/* eslint-disable prefer-promise-reject-errors */
import { Platform } from 'react-native';
import { fetch } from 'react-native-ssl-pinning';
import ERRORS from '../../utils/errors';
import {
  refreshToken,
  setParameters,
  getParameters,
  resetParameters,
} from '../../interfaces';

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
}));

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

afterEach(() => jest.clearAllMocks());

beforeEach(() => {
  resetParameters();
});

const correctTokenEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';
const correctTokenProductionEndpoint =
  'https://auth.iduruguay.gub.uy/oidc/v1/token';
const contentType = 'application/json';
const tokenType = 'bearer';
const expiresIn = 3600;
const idToken = 'idToken';
const accessToken = 'accessToken';
const correctRefreshToken = 'refreshToken';
const redirectUri = 'redirectUri';
const clientId = 'clientId';
const clientSecret = 'clientSecret';
const encodedCredentials = 'Y2xpZW50SWQ6Y2xpZW50U2VjcmV0';
const server = 'nginx/1.15.1';
const xFrameOptions = 'DENY, SAMEORIGIN';
const fetchMockImplementation = () =>
  Promise.resolve({
    status: 200,
    json: () =>
      Promise.resolve({
        access_token: accessToken,
        expires_in: expiresIn,
        id_token: idToken,
        refresh_token: correctRefreshToken,
        token_type: tokenType,
      }),
  });
const fetchMockImplementationWithInvalidOrEmptyToken = () =>
  Promise.reject({
    bodyString:
      '{"error": "invalid_grant", "error_description": "The provided authorization grant or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client"}',
    headers: {
      'Cache-Control': 'no-store',
      Connection: 'close',
      'Content-Length': '232',
      'Content-Type': contentType,
      Date: 'Thu, 05 Nov 2020 17:58:52 GMT',
      Pragma: 'no-cache',
      Server: server,
      'Set-Cookie':
        '4d98d0ba1af24ad3b3cc37c08f0d1124=727fb7ecab03f62ba5480a538f5129de; path=/; HttpOnly',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': xFrameOptions,
    },
  });
const headerContentType = 'application/x-www-form-urlencoded;charset=UTF-8';

const mockMutex = jest.fn();
jest.mock('async-mutex', () => ({
  Mutex: jest.fn(() => ({
    acquire: () => mockMutex,
  })),
}));

describe('configuration & security modules and refresh token integration', () => {
  it('calls setParameters and refresh token', async () => {
    setParameters({
      clientId,
      clientSecret,
      refreshToken: correctRefreshToken,
      redirectUri,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    fetch.mockImplementation(fetchMockImplementation);

    const response = await refreshToken();
    expect(fetch).toHaveBeenCalledWith(correctTokenEndpoint, {
      method: 'POST',
      disableAllSecurity: false,
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': headerContentType,
        Accept: contentType,
      },
      body: `grant_type=refresh_token&refresh_token=${correctRefreshToken}`,
    });

    expect(response).toStrictEqual({
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      accessToken,
      expiresIn,
      idToken,
      refreshToken: correctRefreshToken,
      tokenType,
    });
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken,
      refreshToken: correctRefreshToken,
      tokenType,
      expiresIn,
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls setParameters and refresh token with production set to true', async () => {
    setParameters({
      clientId,
      clientSecret,
      refreshToken: correctRefreshToken,
      redirectUri,
      production: true,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: true,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    fetch.mockImplementation(fetchMockImplementation);

    const response = await refreshToken();
    expect(fetch).toHaveBeenCalledWith(correctTokenProductionEndpoint, {
      method: 'POST',
      disableAllSecurity: true,
      pkPinning: false,
      sslPinning: false,
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': headerContentType,
        Accept: contentType,
      },
      body: `grant_type=refresh_token&refresh_token=${correctRefreshToken}`,
    });

    expect(response).toStrictEqual({
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      accessToken,
      expiresIn,
      idToken,
      refreshToken: correctRefreshToken,
      tokenType,
    });
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: true,
      code: '',
      accessToken,
      refreshToken: correctRefreshToken,
      tokenType,
      expiresIn,
      idToken,
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls setParameters and refresh token with empty clientId', async () => {
    try {
      setParameters({
        clientId: '',
        clientSecret,
        refreshToken: correctRefreshToken,
        redirectUri,
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId: '',
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId: '',
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls setParameters and refresh token with empty clientSecret', async () => {
    try {
      setParameters({
        clientId,
        clientSecret: '',
        refreshToken: correctRefreshToken,
        redirectUri,
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_SECRET);
    }

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_SECRET);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls setParameters and refresh token with empty redirectUri', async () => {
    try {
      setParameters({
        clientId,
        clientSecret,
        refreshToken: correctRefreshToken,
        redirectUri: '',
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_REDIRECT_URI);
    }

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_REDIRECT_URI);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls setParameters and refresh token with empty refreshToken', async () => {
    try {
      setParameters({
        clientId,
        clientSecret,
        refreshToken: '',
        redirectUri,
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_TOKEN);
    }

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    fetch.mockImplementation(fetchMockImplementationWithInvalidOrEmptyToken);

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_GRANT);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
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
    expect.assertions(4);
  });

  it('calls setParameters and refresh token with invalid clientId', async () => {
    try {
      setParameters({
        clientId: 'invalid_client_id',
        clientSecret,
        redirectUri,
        refreshToken: correctRefreshToken,
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
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
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
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

  it('calls setParameters and refresh token with invalid clientSecret', async () => {
    try {
      setParameters({
        clientId,
        clientSecret: 'invalid_client_secret',
        redirectUri,
        refreshToken: correctRefreshToken,
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_SECRET);
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
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
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

  it('calls setParameters and refresh token with invalid redirectUri', async () => {
    try {
      setParameters({
        clientId,
        clientSecret,
        redirectUri: 'invalid_redirect_uri',
        refreshToken: correctRefreshToken,
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_REDIRECT_URI);
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
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
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

  it('calls setParameters and refresh token with invalid refreshToken', async () => {
    try {
      setParameters({
        clientId,
        clientSecret,
        redirectUri,
        refreshToken: 'invalid_refresh_token',
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
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
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

  it('calls setParameters and refresh token with invalid production', async () => {
    try {
      setParameters({
        clientId,
        clientSecret,
        redirectUri,
        refreshToken: correctRefreshToken,
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
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
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

  it('calls setParameters and refresh token, fetch returns that token is invalid', async () => {
    const invalidRefreshToken = 'invalidRefreshToken';

    setParameters({
      clientId,
      clientSecret,
      refreshToken: invalidRefreshToken,
      redirectUri,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: invalidRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    fetch.mockImplementation(fetchMockImplementationWithInvalidOrEmptyToken);

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_GRANT);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: invalidRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls setParameters and refresh token, fetch returns that client is invalid', async () => {
    setParameters({
      clientId,
      clientSecret,
      refreshToken: correctRefreshToken,
      redirectUri,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.reject({
        bodyString:
          '{"error": "invalid_client", "error_description": "Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method)"}',
        headers: {
          'Cache-Control': 'no-store',
          Connection: 'close',
          'Content-Length': '176',
          'Content-Type': contentType,
          Date: 'Thu, 05 Nov 2020 18:06:45 GMT',
          Pragma: 'no-cache',
          Server: server,
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': xFrameOptions,
        },
      }),
    );

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls setParameters and refresh token, fetch returns some error', async () => {
    setParameters({
      clientId,
      clientSecret,
      refreshToken: correctRefreshToken,
      redirectUri,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    fetch.mockImplementation(() =>
      Promise.reject({
        headers: {
          'some-error':
            'error="some_error", error_description="Caught error different from invalid_grant and invalid_client"',
        },
      }),
    );
    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls setParameters and refresh token, fetch fails', async () => {
    setParameters({
      clientId,
      clientSecret,
      refreshToken: correctRefreshToken,
      redirectUri,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () => Promise.resolve(),
      }),
    );
    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('refresh token does not erase code from parameters', async () => {
    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      code: 'correctCode',
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: 'correctCode',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_GRANT);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: 'correctCode',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls setParameters and refresh token, fetch returns invalid accessToken', async () => {
    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      refreshToken: correctRefreshToken,
    });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: 'invalid_access_token',
            expires_in: expiresIn,
            id_token: idToken,
            refresh_token: correctRefreshToken,
            token_type: tokenType,
          }),
      }),
    );

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctTokenEndpoint, {
      method: 'POST',
      disableAllSecurity: false,
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': headerContentType,
        Accept: contentType,
      },
      body: `grant_type=refresh_token&refresh_token=${parameters.refreshToken}`,
    });

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls setParameters and refresh token, fetch returns invalid expiresIn', async () => {
    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      refreshToken: correctRefreshToken,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: accessToken,
            expires_in: 'invalid_expires_in',
            id_token: idToken,
            refresh_token: correctRefreshToken,
            token_type: tokenType,
          }),
      }),
    );

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctTokenEndpoint, {
      method: 'POST',
      disableAllSecurity: false,
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': headerContentType,
        Accept: contentType,
      },
      body: `grant_type=refresh_token&refresh_token=${parameters.refreshToken}`,
    });

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls setParameters and refresh token, fetch returns invalid idToken', async () => {
    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      refreshToken: correctRefreshToken,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: accessToken,
            expires_in: expiresIn,
            id_token: 'invalid_id_token',
            refresh_token: correctRefreshToken,
            token_type: tokenType,
          }),
      }),
    );

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctTokenEndpoint, {
      method: 'POST',
      disableAllSecurity: false,
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': headerContentType,
        Accept: contentType,
      },
      body: `grant_type=refresh_token&refresh_token=${parameters.refreshToken}`,
    });

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls setParameters and refresh token, fetch returns invalid refreshToken', async () => {
    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      refreshToken: correctRefreshToken,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: accessToken,
            expires_in: expiresIn,
            id_token: idToken,
            refresh_token: 'invalid_refresh_token',
            token_type: tokenType,
          }),
      }),
    );

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctTokenEndpoint, {
      method: 'POST',
      disableAllSecurity: false,
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': headerContentType,
        Accept: contentType,
      },
      body: `grant_type=refresh_token&refresh_token=${parameters.refreshToken}`,
    });

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls setParameters and refresh token, fetch returns invalid tokenType', async () => {
    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      refreshToken: correctRefreshToken,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: accessToken,
            expires_in: expiresIn,
            id_token: idToken,
            refresh_token: correctRefreshToken,
            token_type: 'invalid_token_type',
          }),
      }),
    );

    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctTokenEndpoint, {
      method: 'POST',
      disableAllSecurity: false,
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': headerContentType,
        Accept: contentType,
      },
      body: `grant_type=refresh_token&refresh_token=${parameters.refreshToken}`,
    });

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: correctRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });
});
