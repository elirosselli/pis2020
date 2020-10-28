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

describe('configuration module and make request type login integration', () => {
  it('calls initialize and makes a login request', async () => {
    const fetchRedirectUri = 'redirectUri';
    const fetchClientId = 'clientId';
    const fetchClientSecret = 'clientSecret';
    const postLogoutRedirectUri = '';
    initialize(
      fetchRedirectUri,
      fetchClientId,
      fetchClientSecret,
      postLogoutRedirectUri,
    );

    let parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');

    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `${parameters.redirectUri}?code=35773ab93b5b4658b81061ce3969efc2&state=TEST_STATE`,
        });
    });
    const code = await makeRequest(REQUEST_TYPES.LOGIN);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect(code).toBe('35773ab93b5b4658b81061ce3969efc2');
    parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('35773ab93b5b4658b81061ce3969efc2');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');
  });

  it('calls initialize and makes a login request with state', async () => {
    const fetchRedirectUri = 'redirectUri';
    const fetchClientId = 'clientId';
    const fetchClientSecret = 'clientSecret';
    const postLogoutRedirectUri = '';
    const fetchState = 'hola';
    initialize(
      fetchRedirectUri,
      fetchClientId,
      fetchClientSecret,
      postLogoutRedirectUri,
    );
    setParameters({
      state: fetchState,
    });

    let parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');
    expect(parameters.state).toBe(fetchState);

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
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('35773ab93b5b4658b81061ce3969efc2');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');
    expect(parameters.state).toBe(fetchState);
  });

  it('calls initialize and makes a login request with empty clientId', async () => {
    const fetchRedirectUri = 'redirectUri';
    const fetchClientId = '';
    const fetchClientSecret = 'clientSecret';
    const postLogoutRedirectUri = '';
    initialize(
      fetchRedirectUri,
      fetchClientId,
      fetchClientSecret,
      postLogoutRedirectUri,
    );

    let parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');
    expect(parameters.state).toBe('');
    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toMatchObject(Error(couldntMakeRequestError));
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');
    expect(parameters.state).toBe('');
  });

  it('calls initialize and makes a login request with empty redirectUri', async () => {
    const fetchRedirectUri = '';
    const fetchClientId = 'clientId';
    const fetchClientSecret = 'clientSecret';
    const postLogoutRedirectUri = '';
    initialize(
      fetchRedirectUri,
      fetchClientId,
      fetchClientSecret,
      postLogoutRedirectUri,
    );

    // TODO: no se deberia chequear al hacer login que la redirectUri no sea vacia?

    let parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');
    expect(parameters.state).toBe('');

    parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');
    expect(parameters.state).toBe('');
  });

  it('calls initialize with clientId different from RP and makes a login request', async () => {
    const badLoginEndpoint =
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20&response_type=code&client_id=qwrty&redirect_uri=redirectUri';
    const fetchRedirectUri = 'redirectUri';
    const fetchClientId = 'qwrty';
    const fetchClientSecret = 'clientSecret';
    const postLogoutRedirectUri = '';
    initialize(
      fetchRedirectUri,
      fetchClientId,
      fetchClientSecret,
      postLogoutRedirectUri,
    );

    let parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');

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
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');
  });

  it('calls initialize with redirectUri different from RP and makes a login request', async () => {
    const badLoginEndpoint2 =
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20&response_type=code&client_id=clientId&redirect_uri=qwrty';
    const fetchRedirectUri = 'qwrty';
    const fetchClientId = 'clientId';
    const fetchClientSecret = 'clientSecret';
    const postLogoutRedirectUri = '';
    initialize(
      fetchRedirectUri,
      fetchClientId,
      fetchClientSecret,
      postLogoutRedirectUri,
    );

    let parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');

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
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(badLoginEndpoint2);
    parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');
  });

  it('calls initialize and makes a login request, the user denies access to the application ', async () => {
    const fetchRedirectUri = 'redirectUri';
    const fetchClientId = 'clientId';
    const fetchClientSecret = 'clientSecret';
    const postLogoutRedirectUri = '';
    initialize(
      fetchRedirectUri,
      fetchClientId,
      fetchClientSecret,
      postLogoutRedirectUri,
    );

    let parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');

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
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');
  });

  // it('calls initialize and makes a login request with no response type', async () => {
  //   const badLoginEndpoint3 =
  //     'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20&client_id=clientId&redirect_uri=redirectUri';
  //   const fetchRedirectUri = 'redirectUri';
  //   const fetchClientId = 'clientId';
  //   const fetchClientSecret = 'clientSecret';
  //   const postLogoutRedirectUri = '';
  //   initialize(
  //     fetchRedirectUri,
  //     fetchClientId,
  //     fetchClientSecret,
  //     postLogoutRedirectUri,
  //   );

  //   let parameters = getParameters();
  //   expect(parameters.clientId).toBe(fetchClientId);
  //   expect(parameters.clientSecret).toBe(fetchClientSecret);
  //   expect(parameters.redirectUri).toBe(fetchRedirectUri);
  //   expect(parameters.code).toBe('');
  //   expect(parameters.accessToken).toBe('');
  //   expect(parameters.refreshToken).toBe('');
  //   expect(parameters.tokenType).toBe('');
  //   expect(parameters.expiresIn).toBe('');
  //   expect(parameters.idToken).toBe('');

  //   try {
  //     await makeRequest(REQUEST_TYPES.LOGIN);
  //   } catch (error) {
  //     expect(error).toMatchObject(Error(invalidAuthCodeError));
  //   }
  //   expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
  //   expect(mockLinkingOpenUrl).toHaveBeenCalledWith(badLoginEndpoint3);
  //   parameters = getParameters();
  //   expect(parameters.clientId).toBe(fetchClientId);
  //   expect(parameters.clientSecret).toBe(fetchClientSecret);
  //   expect(parameters.redirectUri).toBe(fetchRedirectUri);
  //   expect(parameters.code).toBe('');
  //   expect(parameters.accessToken).toBe('');
  //   expect(parameters.refreshToken).toBe('');
  //   expect(parameters.tokenType).toBe('');
  //   expect(parameters.expiresIn).toBe('');
  //   expect(parameters.idToken).toBe('');
  // });
});

// For get token and refresh token
const expectedIdToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw';
const correctTokenEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';

describe('configuration module and make request type get token integration', () => {
  it('calls setParameters and makes a get token request', async () => {
    const fetchRedirectUri = 'redirectUri';
    const fetchClientId = '898562';
    const fetchClientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const fetchCode = 'f24df0c4fcb142328b843d49753946af';
    const returnedAccessToken = 'c9747e3173544b7b870d48aeafa0f661';

    setParameters({
      clientId: fetchClientId,
      clientSecret: fetchClientSecret,
      redirectUri: fetchRedirectUri,
      code: fetchCode,
    });
    let parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe(fetchCode);
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe('');
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: returnedAccessToken,
            expires_in: 3600,
            id_token: expectedIdToken,
            refresh_token: '041a156232ac43c6b719c57b7217c9ee',
            token_type: 'bearer',
          }),
      }),
    );

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
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
      body: `grant_type=authorization_code&code=${parameters.code}&redirect_uri=${parameters.redirectUri}`,
    });

    expect(response).toBe(returnedAccessToken);
    parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe(fetchCode);
    expect(parameters.accessToken).toBe(returnedAccessToken);
    expect(parameters.refreshToken).toBe('041a156232ac43c6b719c57b7217c9ee');
    expect(parameters.tokenType).toBe('bearer');
    expect(parameters.expiresIn).toBe(3600);
    expect(parameters.idToken).toBe(expectedIdToken);
  });
});

describe('configuration module and make request type refresh token integration', () => {
  it('calls setParameters and makes a refresh token request ', async () => {
    const fetchClientId = '898562';
    // const fetchRedirectUri = 'redirectUri';
    const fetchClientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const fetchRefreshToken = '041a156232ac43c6b719c57b7217c9ee';
    const returnedAccessToken = 'c9747e3173544b7b870d48aeafa0f661';
    const returnedRefreshToken = '041a156232ac43c6b719c57b7217c9ea';

    setParameters({
      clientId: fetchClientId,
      clientSecret: fetchClientSecret,
      refreshToken: fetchRefreshToken,
    });
    let parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe('');
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe(fetchRefreshToken);
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: returnedAccessToken,
            expires_in: 3600,
            id_token: expectedIdToken,
            refresh_token: returnedRefreshToken,
            token_type: 'bearer',
          }),
      }),
    );

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
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
      body: `grant_type=refresh_token&refresh_token=${fetchRefreshToken}`, // Se usa el refresh token viejo, ya que la funcion makeRequest cambia el valor de parameters.refreshToken
    });

    expect(response).toBe(returnedAccessToken);
    parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.clientSecret).toBe(fetchClientSecret);
    expect(parameters.redirectUri).toBe('');
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe(returnedAccessToken);
    expect(parameters.refreshToken).toBe(returnedRefreshToken);
    expect(parameters.tokenType).toBe('bearer');
    expect(parameters.expiresIn).toBe(3600);
    expect(parameters.idToken).toBe(expectedIdToken);
  });

  it('calls setParameters with invalid refresh token and makes a refresh token request which returns error', async () => {
    const fetchClientId = '898562';
    const fetchRedirectUri = 'redirectUri';
    const fetchRefreshToken = '';

    setParameters({
      clientId: fetchClientId,
      redirectUri: fetchRedirectUri,
      refreshToken: fetchRefreshToken,
    });
    const parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe(fetchRefreshToken);
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');

    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (error) {
      expect(error).toMatchObject(
        Error(`invalid_grant`),
        // error = 'invalid_grant';
        // errorDescription =
        //   'The provided authorization grant or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client';
      );
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    // expect.assertions(2);
  });

  it('calls setParameters with empty refresh token and makes a refresh token request which returns error', async () => {
    const fetchClientId = '898562';
    const fetchRedirectUri = 'redirectUri';
    const fetchRefreshToken = 'invalid_refresh_token';

    setParameters({
      clientId: fetchClientId,
      redirectUri: fetchRedirectUri,
      refreshToken: fetchRefreshToken,
    });
    const parameters = getParameters();
    expect(parameters.clientId).toBe(fetchClientId);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    expect(parameters.code).toBe('');
    expect(parameters.accessToken).toBe('');
    expect(parameters.refreshToken).toBe(fetchRefreshToken);
    expect(parameters.tokenType).toBe('');
    expect(parameters.expiresIn).toBe('');
    expect(parameters.idToken).toBe('');

    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (error) {
      expect(error).toMatchObject(Error(`invalid_grant`));
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    // expect.assertions(2);
  });
});

describe('configuration module and make request type logout integration', () => {
  it('calls set parameters and makes a logout request which returns non-empty state', async () => {
    const correctLogoutEndpoint =
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=idToken&post_logout_redirect_uri=postLogoutRedirectUri&state=2KVAEzPpazbGFD5';
    const fetchIdToken = 'idToken';
    const fetchPostLogoutRedirectUri = 'postLogoutRedirectUri';
    const fetchState = '2KVAEzPpazbGFD5';
    setParameters({
      idToken: fetchIdToken,
      postLogoutRedirectUri: fetchPostLogoutRedirectUri,
      state: fetchState,
    });

    const parameters = getParameters();
    expect(parameters.idToken).toBe(fetchIdToken);
    expect(parameters.postLogoutRedirectUri).toBe(fetchPostLogoutRedirectUri);
    expect(parameters.state).toBe(fetchState);

    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `${parameters.postLogoutRedirectUri.toLowerCase()}?state=${
            parameters.state
          }`,
        });
    });

    const state = await makeRequest(REQUEST_TYPES.LOGOUT);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint);
    expect(state).toBe('2KVAEzPpazbGFD5');
  });

  it('calls set parameters and makes a logout request which returns empty state', async () => {
    const correctLogoutEndpoint =
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=idToken&post_logout_redirect_uri=postLogoutRedirectUri&state=';
    const fetchIdToken = 'idToken';
    const fetchPostLogoutRedirectUri = 'postLogoutRedirectUri';
    const fetchState = '';
    setParameters({
      idToken: fetchIdToken,
      postLogoutRedirectUri: fetchPostLogoutRedirectUri,
      state: fetchState,
    });

    const parameters = getParameters();
    expect(parameters.idToken).toBe(fetchIdToken);
    expect(parameters.postLogoutRedirectUri).toBe(fetchPostLogoutRedirectUri);
    expect(parameters.state).toBe(fetchState);

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
  });

  it('calls set parameters with empty postLogoutRedirectUri and makes a logout request which returns error', async () => {
    const fetchIdToken = 'idToken';
    const fetchState = '2KVAEzPpazbGFD5';
    setParameters({
      idToken: fetchIdToken,
      state: fetchState,
    });

    const parameters = getParameters();
    expect(parameters.idToken).toBe(fetchIdToken);
    expect(parameters.postLogoutRedirectUri).toBe('');
    expect(parameters.state).toBe(fetchState);
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
    expect.assertions(5);
  });
});

describe('configuration module and make request type user info integration', () => {
  const userInfoEndpoint =
    'https://auth-testing.iduruguay.gub.uy/oidc/v1/userinfo';
  const userId = 'uy-cid-12345678';

  it('calls set parameters and makes a user info request with all scopes', async () => {
    const fetchClientId = 'clientId';
    const fetchClientSecret = 'clientSecret';
    const fetchAccessToken = 'accessToken';
    const fetchCode = 'code';
    const fetchRedirectUri = 'redirectUri';
    setParameters({
      clientId: fetchClientId,
      clientSecret: fetchClientSecret,
      accessToken: fetchAccessToken,
      code: fetchCode,
      redirectUri: fetchRedirectUri,
    });
    const parameters = getParameters();
    expect(parameters.code).toBe(fetchCode);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
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
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
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
    const fetchClientId = 'clientId';
    const fetchClientSecret = 'clientSecret';
    const fetchAccessToken = 'accessToken';
    const fetchCode = 'code';
    const fetchRedirectUri = 'redirectUri';
    setParameters({
      clientId: fetchClientId,
      clientSecret: fetchClientSecret,
      accessToken: fetchAccessToken,
      code: fetchCode,
      redirectUri: fetchRedirectUri,
    });
    const parameters = getParameters();
    expect(parameters.code).toBe(fetchCode);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
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
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
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
    const fetchClientId = 'clientId';
    const fetchClientSecret = 'clientSecret';
    const fetchAccessToken = 'accessToken';
    const fetchCode = 'code';
    const fetchRedirectUri = 'redirectUri';
    setParameters({
      clientId: fetchClientId,
      clientSecret: fetchClientSecret,
      accessToken: fetchAccessToken,
      code: fetchCode,
      redirectUri: fetchRedirectUri,
    });
    const parameters = getParameters();
    expect(parameters.code).toBe(fetchCode);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
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
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
    });

    expect(response).toStrictEqual({});
  });

  it('calls set parameters and makes a user info request with expired access token', async () => {
    const fetchClientId = 'clientId';
    const fetchClientSecret = 'clientSecret';
    const fetchAccessToken = 'accessToken';
    const fetchCode = 'code';
    const fetchRedirectUri = 'redirectUri';
    setParameters({
      clientId: fetchClientId,
      clientSecret: fetchClientSecret,
      accessToken: fetchAccessToken,
      code: fetchCode,
      redirectUri: fetchRedirectUri,
    });
    const parameters = getParameters();
    expect(parameters.code).toBe(fetchCode);
    expect(parameters.redirectUri).toBe(fetchRedirectUri);
    const error = 'invalid_token';
    const errorDescription = 'The Access Token expired';
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
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toStrictEqual({
        error,
        error_description: errorDescription,
      });
    }

    expect(fetch).toHaveBeenCalledWith(userInfoEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Bearer ${parameters.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
    });
    expect.assertions(4);
  });
});
