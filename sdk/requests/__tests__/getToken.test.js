/* eslint-disable prefer-promise-reject-errors */
import { Platform } from 'react-native';
import { fetch } from '../../utils/helpers';
import { ERRORS, REQUEST_TYPES } from '../../utils/constants';
import { getParameters } from '../../configuration';
import getTokenOrRefresh from '../getTokenOrRefresh';

jest.mock('../../configuration');

jest.mock('../../utils/helpers', () => ({
  ...jest.requireActual('../../utils/helpers'),
  fetch: jest.fn(),
}));

const contentType = 'application/json';

describe('getToken', () => {
  it('calls getToken with correct code', async () => {
    const code = 'f24df0c4fcb142328b843d49753946af';
    const redirectUri = 'uri';
    const tokenEndpoint = 'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';
    const accessToken = 'c9747e3173544b7b870d48aeafa0f661';
    const expiresIn = 3600;
    const idToken =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw';
    const refreshToken = '041a156232ac43c6b719c57b7217c9ee';
    const tokenType = 'bearer';

    getParameters.mockReturnValue({
      clientId: '898562',
      clientSecret: 'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b',
      redirectUri,
      code,
    });

    fetch.mockImplementation(() =>
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
      }),
    );

    const encodedCredentials =
      'ODk4NTYyOmNkYzA0ZjE5YWMyczJmNWg4ZjZ3ZTZkNDJiMzdlODVhNjNmMXcyZTVmNnNkOGE0NDg0YjZiOTRi';

    const response = await getTokenOrRefresh(REQUEST_TYPES.GET_TOKEN);

    expect(fetch).toHaveBeenCalledWith(
      tokenEndpoint,
      {
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
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
      },
      5,
    );

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
  });

  it('calls getToken with incorrect clientId or clientSecret ', async () => {
    getParameters.mockReturnValue({
      clientId: 'invalidClientId',
      clientSecret: 'invalidClientSecret',
      redirectUri: 'redirectUri',
      code: 'corrrectCode',
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
      await getTokenOrRefresh(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_CLIENT);
    }
    expect.assertions(1);
  });

  it('calls getToken with expired or invalid code ', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      code: 'correctCode',
      accessToken: 'incorrectAccessToken',
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
      await getTokenOrRefresh(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_GRANT);
    }
    expect.assertions(1);
  });

  it('calls getToken and fetch fails', async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () => Promise.resolve(),
      }),
    );
    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });

  it('calls getToken with empty clientId', async () => {
    getParameters.mockReturnValue({
      clientId: '',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      code: 'code',
      accessToken: 'accessToken',
    });

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    expect.assertions(1);
  });

  it('calls getToken with empty clientSecret', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: '',
      redirectUri: 'redirectUri',
      code: 'code',
      accessToken: 'accessToken',
    });

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
    expect.assertions(1);
  });

  it('calls getToken with empty redirectUri', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: '',
      code: 'code',
      accessToken: 'accessToken',
    });

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    expect.assertions(1);
  });

  it('calls getToken with empty code', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      code: '',
      accessToken: 'accessToken',
    });

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    expect.assertions(1);
  });

  it('calls getToken and returns some error', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      code: 'correctCode',
      accessToken: 'accessToken',
    });

    fetch.mockImplementation(() =>
      Promise.reject({
        headers: {
          'some-error':
            'error="some_error", error_description="Error different from invalid grant or invalid client"',
        },
      }),
    );

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });
});
