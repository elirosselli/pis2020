/* eslint-disable prefer-promise-reject-errors */
import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { ERRORS } from '../../utils/constants';
import {
  setParameters,
  getParameters,
  resetParameters,
} from '../../configuration';
import { getToken } from '../../interfaces';

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

afterEach(() => jest.clearAllMocks());

beforeEach(() => {
  resetParameters();
});

const correctTokenEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';
const contentType = 'application/json';
const tokenType = 'bearer';
const expiresIn = 3600;
const idToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw';
const accessToken = 'c9747e3173544b7b870d48aeafa0f661';
const refreshToken = '041a156232ac43c6b719c57b7217c9ee';
const fetchMockImplementation = () =>
  Promise.resolve({
    status: 200,
    json: () =>
      Promise.resolve({
        access_token: accessToken,
        expires_in: expiresIn,
        id_token: idToken,
        refresh_token: refreshToken,
        token_type: tokenType,
      }),
  });

describe('configuration module and get token integration', () => {
  it('calls setParameters and get token', async () => {
    const redirectUri = 'redirectUri';
    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const code = 'f24df0c4fcb142328b843d49753946af';

    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      code,
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
      idToken: '',
      state: '',
      scope: '',
    });

    fetch.mockImplementation(fetchMockImplementation);

    const encodedCredentials =
      'ODk4NTYyOmNkYzA0ZjE5YWMyczJmNWg4ZjZ3ZTZkNDJiMzdlODVhNjNmMXcyZTVmNnNkOGE0NDg0YjZiOTRi';
    const response = await getToken();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctTokenEndpoint, {
      method: 'POST',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: contentType,
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${parameters.redirectUri}`,
    });
    expect(response).toStrictEqual({
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      accessToken,
      expiresIn,
      idToken,
      refreshToken,
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
      refreshToken,
      tokenType,
      expiresIn,
      idToken,
      state: '',
      scope: '',
    });
  });

  it('calls setParameters and get token with invalid code', async () => {
    const redirectUri = 'redirectUri';
    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const code = 'invalidCode';

    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      code,
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
      idToken: '',
      state: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
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
          Server: 'nginx/1.15.1',
          'Set-Cookie':
            '4d98d0ba1af24ad3b3cc37c08f0d1124=727fb7ecab03f62ba5480a538f5129de; path=/; HttpOnly',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY, SAMEORIGIN',
        },
      }),
    );

    try {
      await getToken();
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_GRANT);
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
      state: '',
      scope: '',
    });

    expect.assertions(3);
  });

  it('calls setParameters and get token with invalid client id or client secret', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'invalidClientId';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const code = 'f24df0c4fcb142328b843d49753946af';

    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      code,
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
      idToken: '',
      state: '',
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
          Server: 'nginx/1.15.1',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY, SAMEORIGIN',
        },
      }),
    );
    try {
      await getToken();
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_CLIENT);
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
      state: '',
      scope: '',
    });

    expect.assertions(3);
  });

  it('calls setParameters and get token, fetch fails', async () => {
    const redirectUri = 'redirectUri';
    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const code = 'f24df0c4fcb142328b843d49753946af';

    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      code,
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
      await getToken();
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
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
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls setParameters and get token, returns some error', async () => {
    const redirectUri = 'redirectUri';
    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const code = 'f24df0c4fcb142328b843d49753946af';

    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      code,
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
      await getToken();
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
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
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls setParameters and get token with empty client id ', async () => {
    const redirectUri = 'redirectUri';
    const clientId = '';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const code = 'f24df0c4fcb142328b843d49753946af';

    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      code,
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
      idToken: '',
      state: '',
      scope: '',
    });

    try {
      await getToken();
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_CLIENT_ID);
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
      state: '',
      scope: '',
    });

    expect.assertions(3);
  });

  it('calls setParameters and get token with empty client secret ', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = '';
    const code = 'f24df0c4fcb142328b843d49753946af';

    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      code,
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
      idToken: '',
      state: '',
      scope: '',
    });

    try {
      await getToken();
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_CLIENT_SECRET);
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
      state: '',
      scope: '',
    });

    expect.assertions(3);
  });

  it('calls setParameters and get token with empty redirectUri ', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'f24df0c4fcb142328b843d49753946af';

    setParameters({
      clientId,
      clientSecret,
      code,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
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
      await getToken();
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_REDIRECT_URI);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
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

    expect.assertions(3);
  });

  it('calls setParameters and get token with empty code ', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = '';

    setParameters({
      clientId,
      clientSecret,
      redirectUri,
      code,
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
      idToken: '',
      state: '',
      scope: '',
    });

    try {
      await getToken();
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_AUTHORIZATION_CODE);
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
      state: '',
      scope: '',
    });

    expect.assertions(3);
  });
});
