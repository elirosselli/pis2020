import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import REQUEST_TYPES from '../utils/constants';
import {
  setParameters,
  getParameters,
  resetParameters,
} from '../configuration';
import { initialize } from '../interfaces';
import makeRequest from '../requests';

const missingParamsMessage = 'Missing required parameter(s): ';
const mockAddEventListener = jest.fn();
const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
  openURL: mockLinkingOpenUrl,
}));

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

afterEach(() => jest.clearAllMocks());

beforeEach(() => {
  resetParameters();
});
const correctLoginEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20&response_type=code&client_id=clientId&redirect_uri=redirectUri';
const invalidAuthCodeError = 'Invalid authorization code';
const couldntMakeRequestError = "Couldn't make request";

// FIXME: with empty redirectUri
describe('configuration module and make request type login integration', () => {
  it('calls initialize and makes a login request', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    initialize(redirectUri, clientId, clientSecret, postLogoutRedirectUri);

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `${parameters.redirectUri}?code=35773ab93b5b4658b81061ce3969efc2`,
        });
    });
    const code = await makeRequest(REQUEST_TYPES.LOGIN);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect(code).toBe('35773ab93b5b4658b81061ce3969efc2');
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
  });

  it('calls initialize and makes a login request with state', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    const state = 'state';
    initialize(redirectUri, clientId, clientSecret, postLogoutRedirectUri);

    setParameters({ state });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state,
      scope: '',
    });

    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `${parameters.redirectUri}?code=35773ab93b5b4658b81061ce3969efc2&state=${parameters.state}`,
        });
    });
    const code = await makeRequest(REQUEST_TYPES.LOGIN);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect(code).toBe('35773ab93b5b4658b81061ce3969efc2');
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state,
      scope: '',
    });
  });

  it('calls initialize and makes a login request with empty clientId', async () => {
    const redirectUri = 'redirectUri';
    const clientId = '';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    initialize(redirectUri, clientId, clientSecret, postLogoutRedirectUri);

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toMatchObject(Error(couldntMakeRequestError));
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
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

  // FIXME:
  it('calls initialize and makes a login request with empty redirectUri', async () => {
    const redirectUri = '';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    initialize(redirectUri, clientId, clientSecret, postLogoutRedirectUri);

    // TODO: Agregar test al agregar chequeos de redirectUri vacía en login.
  });

  it('calls initialize with clientId different from RP and makes a login request', async () => {
    const badLoginEndpoint =
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20&response_type=code&client_id=invalidClientId&redirect_uri=redirectUri';
    const redirectUri = 'redirectUri';
    const clientId = 'invalidClientId';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    initialize(redirectUri, clientId, clientSecret, postLogoutRedirectUri);

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `https://mi-testing.iduruguay.gub.uy/error/?errorCode=OIDC_ERROR`,
        });
    });

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toMatchObject(Error(invalidAuthCodeError));
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(badLoginEndpoint);
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
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

  it('calls initialize with redirectUri different from RP and makes a login request', async () => {
    const badLoginEndpoint =
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20&response_type=code&client_id=clientId&redirect_uri=invalidRedirectUri';
    const redirectUri = 'invalidRedirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    initialize(redirectUri, clientId, clientSecret, postLogoutRedirectUri);

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    // eslint-disable-next-line sonarjs/no-identical-functions
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `https://mi-testing.iduruguay.gub.uy/error/?errorCode=OIDC_ERROR`,
        });
    });

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toMatchObject(Error(invalidAuthCodeError));
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(badLoginEndpoint);
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
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

  it('calls initialize and makes a login request, the user denies access to the application ', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    initialize(redirectUri, clientId, clientSecret, postLogoutRedirectUri);

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    // eslint-disable-next-line sonarjs/no-identical-functions
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `sdkidu.testing://auth?error=access_denied&error_description=The%20resource%20owner%20or%20authorization%20server%20denied%20the%20request`,
        });
    });

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toMatchObject(Error(invalidAuthCodeError));
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
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
});

// For get token and refresh token
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

describe('configuration module and make request type get token integration', () => {
  it('calls setParameters and makes a get token request', async () => {
    const redirectUri = 'redirectUri';
    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const code = 'f24df0c4fcb142328b843d49753946af';

    setParameters({ clientId, clientSecret, redirectUri, code });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
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

    const response = await makeRequest(REQUEST_TYPES.GET_TOKEN);

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
      body: `grant_type=authorization_code&code=${parameters.code}&redirect_uri=${parameters.redirectUri}`,
    });

    expect(response).toBe(accessToken);
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken,
      refreshToken,
      tokenType,
      expiresIn,
      idToken,
      state: '',
      scope: '',
    });
  });

  it('calls setParameters and makes a get token request with invalid code', async () => {
    const redirectUri = 'redirectUri';
    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const code = 'f24df0c4fcb142328b843d49753946af';

    setParameters({ clientId, clientSecret, redirectUri, code });
    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    const error = 'invalid_code';
    const errorDescription =
      'The provided authorization code is invalid or expired';
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

    expect.assertions(2);
  });

  it('calls setParameters and makes a get token request with invalid client id', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'invalidClientId';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const code = 'f24df0c4fcb142328b843d49753946af';

    setParameters({ clientId, clientSecret, redirectUri, code });
    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    const error2 = 'invalid_client_id';
    const errorDescription = 'The provided client_id is invalid';
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error2,
            error_description: errorDescription,
          }),
      }),
    );

    try {
      await makeRequest(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual({
        error2,
        error_description: errorDescription,
      });
    }

    expect.assertions(2);
  });

  it('calls setParameters and makes a get token request with invalid client secret', async () => {
    const redirectUri = 'redirectUri';
    const clientId = '898562';
    const clientSecret = 'invalidClientSecret';
    const code = 'f24df0c4fcb142328b843d49753946af';

    setParameters({ clientId, clientSecret, redirectUri, code });
    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    const error3 = 'invalid_client_secret';
    const errorDescription = 'The provided client_secret is invalid';
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error3,
            error_description: errorDescription,
          }),
      }),
    );

    try {
      await makeRequest(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toStrictEqual({
        error3,
        error_description: errorDescription,
      });
    }

    expect.assertions(2);
  });
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
    const parameters = getParameters();
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
    expect.assertions(2);
  });

  it('calls setParameters and makes a refresh token request with invalid client id', async () => {
    const clientId = 'invalid_client_id';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';

    setParameters({ clientId, clientSecret, refreshToken });
    const parameters = getParameters();
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
    expect.assertions(2);
  });

  it('calls setParameters and makes a refresh token request with invalid client secret', async () => {
    const clientId = '898562';
    const clientSecret = 'invalid_client_secret';

    setParameters({ clientId, clientSecret, refreshToken });
    const parameters = getParameters();
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
    expect.assertions(2);
  });
});

describe('configuration module and make request type logout integration', () => {
  it('calls set parameters and makes a logout request which returns non-empty state', async () => {
    const correctLogoutEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=postLogoutRedirectUri&state=2KVAEzPpazbGFD5`;
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    const state = '2KVAEzPpazbGFD5';
    setParameters({ idToken, postLogoutRedirectUri, state });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      postLogoutRedirectUri,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state,
      scope: '',
    });

    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `${parameters.postLogoutRedirectUri.toLowerCase()}?state=${
            parameters.state
          }`,
        });
    });

    const returnedState = await makeRequest(REQUEST_TYPES.LOGOUT);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint);
    expect(returnedState).toBe(state);
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      postLogoutRedirectUri,
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

  it('calls set parameters and makes a logout request which returns empty state', async () => {
    const correctLogoutEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=postLogoutRedirectUri&state=`;
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    setParameters({ idToken, postLogoutRedirectUri });

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      postLogoutRedirectUri,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: parameters.postLogoutRedirectUri.toLowerCase(),
        });
    });
    const state = await makeRequest(REQUEST_TYPES.LOGOUT);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint);
    expect(state).toBe(undefined);
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      postLogoutRedirectUri,
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

  it('calls set parameters with empty postLogoutRedirectUri and makes a logout request which returns error', async () => {
    const state = '2KVAEzPpazbGFD5';
    setParameters({ idToken, state });

    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      postLogoutRedirectUri: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state,
      scope: '',
    });

    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.LOGOUT);
    } catch (error) {
      expect(error).toMatchObject(
        Error(`${missingParamsMessage}postLogoutRedirectUri`),
      );
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    expect.assertions(3);
  });
});

const userInfoEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/userinfo';

describe('configuration module and make request type user info integration', () => {
  const userId = 'uy-cid-12345678';

  it('calls set parameters and makes a user info request with all scopes', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
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
            sub: '5968',
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
      nombre_completo: 'test',
      primer_apellido: 'test',
      primer_nombre: 'testNombre',
      segundo_apellido: 'testApellido',
      segundo_nombre: 'testSegundoNombre',
      sub: '5968',
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
  });

  it('calls set parameters and makes a user info request with personal_info scope', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
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
            sub: '5968',
            uid: userId,
            rid: 'rid',
          }),
      }),
    );

    const response = await makeRequest(REQUEST_TYPES.GET_USER_INFO);

    expect(fetch).toHaveBeenCalledWith(userInfoEndpoint, {
      method: 'GET',
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
      nombre_completo: 'test',
      primer_apellido: 'test',
      primer_nombre: 'testNombre',
      segundo_apellido: 'testApellido',
      segundo_nombre: 'testSegundoNombre',
      sub: '5968',
      uid: userId,
      rid: 'rid',
    });
  });

  it('calls set parameters and makes a user info request with no claims', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({}),
      }),
    );

    const response = await makeRequest(REQUEST_TYPES.GET_USER_INFO);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(userInfoEndpoint, {
      method: 'GET',
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

    expect(response).toStrictEqual({});
  });

  it('calls set parameters and makes a user info request with expired access token', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const code = 'code';
    const redirectUri = 'redirectUri';
    setParameters({ clientId, clientSecret, accessToken, code, redirectUri });

    const parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri: '',
      code,
      accessToken,
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });

    const error1 = 'invalid_token';
    const errorDescription = 'The Access Token expired';
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error1,
            error_description: errorDescription,
          }),
      }),
    );

    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toStrictEqual({
        error1,
        error_description: errorDescription,
      });
    }
    expect.assertions(2);
  });
});
