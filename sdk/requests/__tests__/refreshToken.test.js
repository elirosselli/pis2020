import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { ERRORS, REQUEST_TYPES } from '../../utils/constants';
import { getParameters } from '../../configuration';
import getTokenOrRefresh from '../getTokenOrRefresh';

jest.mock('../../configuration');

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

describe('refreshToken', () => {
  it('calls refreshToken with correct refreshToken', async () => {
    // Mockear la funcion fetch
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: 'c9747e3173544b7b870d48aeafa0f661',
            expires_in: 3600,
            id_token:
              'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw',
            refresh_token: '041a156232ac43c6b719c57b7217c9ee',
            token_type: 'bearer',
          }),
      }),
    );

    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const tokenEndpoint = 'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';
    const refreshToken = '541a156232ac43c6b719c57b7217c9ea';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    const redirectUri = 'redirectUri';

    // Mockear getParameters
    getParameters.mockReturnValue({
      clientId,
      clientSecret,
      refreshToken: '541a156232ac43c6b719c57b7217c9ea',
      postLogoutRedirectUri,
      redirectUri,
      code: 'correctCode',
    });

    const encodedCredentials =
      'ODk4NTYyOmNkYzA0ZjE5YWMyczJmNWg4ZjZ3ZTZkNDJiMzdlODVhNjNmMXcyZTVmNnNkOGE0NDg0YjZiOTRi';

    const response = await getTokenOrRefresh(REQUEST_TYPES.GET_REFRESH_TOKEN);

    // Chequeo de parametros enviados
    expect(fetch).toHaveBeenCalledWith(tokenEndpoint, {
      method: 'POST',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });

    // Chequeo de respuestas
    expect(response.accessToken).toBe('c9747e3173544b7b870d48aeafa0f661');
    expect(response.refreshToken).toBe('041a156232ac43c6b719c57b7217c9ee');
    expect(response.expiresIn).toBe(3600);
    expect(response.idToken).toBe(
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw',
    );
    expect(response.tokenType).toBe('bearer');
    expect(response.message).toBe(ERRORS.NO_ERROR);
  });

  it('calls refreshToken with incorrect clientId or clientSecret', async () => {
    getParameters.mockReturnValue({
      clientId: 'sdasd',
      clientSecret: 'asdasd',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      refreshToken: 'correctRefreshToken',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error: 'invalid_client',
            error_description:
              'Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method)',
          }),
      }),
    );

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_CLIENT);
    }
    expect.assertions(1);
  });

  it('calls refreshToken with invalid refresh token', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      refreshToken: 'incorrectRefreshToken',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error: 'invalid_grant',
            error_description:
              'The provided authorization grant or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client',
          }),
      }),
    );

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_GRANT);
    }
    expect.assertions(1);
  });

  it('calls refreshToken with empty clientId', async () => {
    getParameters.mockReturnValue({
      clientId: '',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    });

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_CLIENT_ID);
    }
    expect.assertions(1);
  });

  it('calls refreshToken with empty clientSecret', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: '',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    });

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
    expect.assertions(1);
  });

  it('calls refreshToken with empty redirectUri', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: '',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    });

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    expect.assertions(1);
  });

  it('calls refreshToken with empty refreshToken', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      refreshToken: '',
    });

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_GRANT);
    }
    expect.assertions(1);
  });

  it('calls refreshToken and fetch fails', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'asdasd',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      refreshToken: 'correctRefreshToken',
    });
    fetch.mockImplementation(() => Promise.reject());
    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });

  it('calls refreshToken and returns some error', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      refreshToken: 'correctRefreshToken',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error: 'some_error',
            error_description:
              'This is some error, different from invalid_client or invalid_grant',
          }),
      }),
    );

    try {
      await getTokenOrRefresh(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });
});
