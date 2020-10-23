import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import REQUEST_TYPES from '../utils/constants';
import {
  setParameters,
  getParameters,
  clearParameters,
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
  clearParameters();
  setParameters({
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    postLogoutRedirectUri: '',
  });
});

describe('configuration module and make request type login integration', () => {
  it('calls initialize and makes a login request', async () => {
    const correctLoginEndpoint =
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20personal_info&response_type=code&client_id=clientId&redirect_uri=redirectUri';
    const fetchRedirectUri = 'redirectUri';
    const fetchClientId = 'clientId';
    const fetchClientSecret = 'clientSecret';
    initialize(fetchRedirectUri, fetchClientId, fetchClientSecret);

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
});

describe('configuration module and make request type logout integration', () => {
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
    // expect.assertions(2);
  });

  it('calls set parameters and makes a logout request which returns non-empty state', async () => {
    // const correctLogoutEndpoint =
    //   'https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=idToken&post_logout_redirect_uri=postlogoutredirecturi&state=2KVAEzPpazbGFD5';
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
    const urlCheck = await makeRequest(REQUEST_TYPES.LOGOUT);
    const receivedState = urlCheck.match(/\?state=([^&]+)/);
    expect(receivedState[1]).toBe('2KVAEzPpazbGFD5');
    // expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    // expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint);
  });

  it('calls set parameters and makes a logout request which returns empty state', async () => {
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
    const urlCheck = await makeRequest(REQUEST_TYPES.LOGOUT);
    const receivedState = urlCheck.match(/\?state=([^&]+)/);
    // expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    // expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint);
    expect(receivedState).toBe(null);
  });
});
