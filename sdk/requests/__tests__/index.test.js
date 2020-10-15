import { fetch } from 'react-native-ssl-pinning';
import makeRequest, { REQUEST_TYPES } from '../index';
import { getParameters } from '../../configuration';

jest.mock('../../configuration');

const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: mockLinkingOpenUrl,
}));

afterEach(() => jest.clearAllMocks());

describe('login', () => {
  it('calls login with clientId and redirectUri', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
    });
    await makeRequest(REQUEST_TYPES.LOGIN);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=clientId&redirect_uri=redirectUri',
    );
  });

  it('calls login without clientId and with redirectUri', async () => {
    getParameters.mockReturnValue({
      clientId: '',
      redirectUri: 'redirectUri',
    });
    const response = await makeRequest(REQUEST_TYPES.LOGIN);
    expect(response).toBe('');
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
  });

  it('calls login with clientId and without redirectUri', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: '',
    });
    await makeRequest(REQUEST_TYPES.LOGIN);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=clientId&redirect_uri=',
    );
  });
});

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

describe('getToken', () => {
  it('calls getToken with correct code', async () => {
    const code = 'f24df0c4fcb142328b843d49753946af';
    const redirectUri = 'uri';
    const tokenEndpoint = 'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';
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
            access_token: 'c9747e3173544b7b870d48aeafa0f661',
            expires_in: 3600,
            id_token:
              'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw',
            refresh_token: '041a156232ac43c6b719c57b7217c9ee',
            token_type: 'bearer',
          }),
      }),
    );

    const encodedCredentials =
      'ODk4NTYyOmNkYzA0ZjE5YWMyczJmNWg4ZjZ3ZTZkNDJiMzdlODVhNjNmMXcyZTVmNnNkOGE0NDg0YjZiOTRi';

    const response = await makeRequest(REQUEST_TYPES.GET_TOKEN);

    expect(fetch).toHaveBeenCalledWith(tokenEndpoint, {
      method: 'POST',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
    });

    expect(response).toBe('c9747e3173544b7b870d48aeafa0f661');
  });

  it('calls getToken with incorrect clientId or clientSecret or returns incorrect code', async () => {
    const error = 'invalid_grant';
    const errorDescription =
      'The provided authorization grant or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client';

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error,
            error_description: errorDescription,
          }),
      }),
    );

    try {
      await makeRequest(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual({
        error,
        error_description: errorDescription,
      });
    }
    expect.assertions(1);
  });

  it('calls getToken and fetch fails', async () => {
    const error = Error('error');
    fetch.mockImplementation(() => Promise.reject(error));
    try {
      await makeRequest(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toBe(error);
    }
    expect.assertions(1);
  });
});

describe('logout', () => {
  it('calls logout with idTokenHint and postLogoutRedirectUri', async () => {
    getParameters.mockReturnValue({
      idToken: 'idToken',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    });
    await makeRequest(REQUEST_TYPES.LOGOUT);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=idToken&post_logout_redirect_uri=postLogoutRedirectUri',
    );
  });

  it('calls logout with idTokenHint and without postLogoutRedirectUri', async () => {
    getParameters.mockReturnValue({
      idToken: 'idToken',
      postLogoutRedirectUri: '',
    });
    await makeRequest(REQUEST_TYPES.LOGOUT);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=idToken&post_logout_redirect_uri=',
    );
  });

  it('calls logout without idTokenHint and with postLogoutRedirectUri', async () => {
    getParameters.mockReturnValue({
      idToken: '',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    });
    await makeRequest(REQUEST_TYPES.LOGOUT);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=&post_logout_redirect_uri=postLogoutRedirectUri',
    );
  });
});

describe('default', () => {
  it('calls default', async () => {
    const response = await makeRequest('default');
    expect(response).toBe('default value');
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
  });
});
