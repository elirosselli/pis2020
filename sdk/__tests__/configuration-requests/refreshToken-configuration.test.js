import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import REQUEST_TYPES from '../../utils/constants';
import {
  setParameters,
  getParameters,
  resetParameters,
} from '../../configuration';
import makeRequest from '../../requests';

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

afterEach(() => jest.clearAllMocks());

beforeEach(() => {
  resetParameters();
});

const correctTokenEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';
const contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
const accept = 'application/json';
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

describe('configuration module and make request type refresh token integration', () => {
  it('calls setParameters and makes a refresh token request ', async () => {
    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';

    setParameters({ clientId, clientSecret, refreshToken });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code: '',
      accessToken: '',
      refreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    fetch.mockImplementation(fetchMockImplementation);

    const encodedCredentials =
      'ODk4NTYyOmNkYzA0ZjE5YWMyczJmNWg4ZjZ3ZTZkNDJiMzdlODVhNjNmMXcyZTVmNnNkOGE0NDg0YjZiOTRi';

    const response = await makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
    expect(fetch).toHaveBeenCalledWith(correctTokenEndpoint, {
      method: 'POST',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': contentType,
        Accept: accept,
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });

    expect(response).toBe(accessToken);
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
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

  it('calls setParameters and makes a refresh token request with invalid refresh token', async () => {
    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const invalidRefreshToken = 'invalid_refresh_token';

    setParameters({
      clientId,
      clientSecret,
      refreshToken: invalidRefreshToken,
    });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code: '',
      accessToken: '',
      refreshToken: invalidRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    const error4 = 'invalid_refresh_token';
    const errorDescription = 'The provided refresh_token is invalid';
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error4,
            error_description: errorDescription,
          }),
      }),
    );

    try {
      await makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual({
        error4,
        error_description: errorDescription,
      });
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code: '',
      accessToken: '',
      refreshToken: invalidRefreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls setParameters and makes a refresh token request with invalid client id', async () => {
    const clientId = 'invalid_client_id';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';

    setParameters({ clientId, clientSecret, refreshToken });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code: '',
      accessToken: '',
      refreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    const error6 = 'invalid_client_id';
    const errorDescription = 'The provided client_id is invalid';
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error6,
            error_description: errorDescription,
          }),
      }),
    );

    try {
      await makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual({
        error6,
        error_description: errorDescription,
      });
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code: '',
      accessToken: '',
      refreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls setParameters and makes a refresh token request with invalid client secret', async () => {
    const clientId = '898562';
    const clientSecret = 'invalid_client_secret';

    setParameters({ clientId, clientSecret, refreshToken });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code: '',
      accessToken: '',
      refreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    const error5 = 'invalid_client_secret';
    const errorDescription = 'The provided client_secret is invalid';
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error5,
            error_description: errorDescription,
          }),
      }),
    );

    try {
      await makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual({
        error5,
        error_description: errorDescription,
      });
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code: '',
      accessToken: '',
      refreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });

  it('calls refreshToken and fetch fails', async () => {
    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';

    setParameters({ clientId, clientSecret, refreshToken });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code: '',
      accessToken: '',
      refreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    const error = Error('error');
    fetch.mockImplementation(() => Promise.reject(error));
    try {
      await makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toBe(error);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code: '',
      accessToken: '',
      refreshToken,
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    expect.assertions(3);
  });
});
