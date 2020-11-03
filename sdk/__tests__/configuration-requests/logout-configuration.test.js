import REQUEST_TYPES from '../../utils/constants';
import {
  setParameters,
  getParameters,
  resetParameters,
} from '../../configuration';
import makeRequest from '../../requests';

const missingParamsMessage = 'Missing required parameter(s): ';
const mockAddEventListener = jest.fn();
const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
  openURL: mockLinkingOpenUrl,
}));

afterEach(() => jest.clearAllMocks());

beforeEach(() => {
  resetParameters();
});

const idToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw';
const state = '2KVAEzPpazbGFD5';
const postLogoutRedirectUri = 'app.testing://postLogout';
const correctLogoutEndpoint1 = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}`;
const correctLogoutEndpoint2 = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=`;

describe('configuration module and make request type logout integration', () => {
  it('calls set parameters and makes a logout request which returns non-empty state', async () => {
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
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint1);
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
    const returnedState = await makeRequest(REQUEST_TYPES.LOGOUT);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint2);
    expect(returnedState).toBe(undefined);
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
    setParameters({ idToken, state });

    let parameters = getParameters();
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

    parameters = getParameters();
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
    expect.assertions(4);
  });

  it('calls set parameters, makes a logout request with required parameters and returns invalid url', async () => {
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
          url: '',
        });
    });
    try {
      await makeRequest(REQUEST_TYPES.LOGOUT);
    } catch (error) {
      expect(error).toMatchObject(Error('Invalid post logout redirect uri'));
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint1);
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
      idToken,
      state,
      scope: '',
    });
    expect.assertions(5);
  });

  it('calls set parameters with empty postLogoutRedirectUri and makes a logout request which returns error', async () => {
    setParameters({ postLogoutRedirectUri, state });

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
      idToken: '',
      state,
      scope: '',
    });
    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.LOGOUT);
    } catch (error) {
      expect(error).toMatchObject(Error(`${missingParamsMessage}idTokenHint`));
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
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
      state,
      scope: '',
    });
    expect.assertions(4);
  });

  it('calls set parameters with empty idTokenHint and postLogoutRedirectUri, and makes a logout request which returns error', async () => {
    setParameters({ state });

    let parameters = getParameters();
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
      idToken: '',
      state,
      scope: '',
    });
    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.LOGOUT);
    } catch (error) {
      expect(error).toMatchObject(
        Error(`${missingParamsMessage}idTokenHint, postLogoutRedirectUri`),
      );
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    parameters = getParameters();
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
      idToken: '',
      state,
      scope: '',
    });
    expect.assertions(4);
  });
});
