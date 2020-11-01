import REQUEST_TYPES from '../../utils/constants';
import {
  setParameters,
  getParameters,
  resetParameters,
} from '../../configuration';
import { initialize } from '../../interfaces';
import makeRequest from '../../requests';

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

const correctLoginEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20&response_type=code&client_id=clientId&redirect_uri=redirectUri';
const invalidAuthCodeError = 'Invalid authorization code';
const couldntMakeRequestError = "Couldn't make request";
const mockAddEventListenerError = (eventType, eventHandler) => {
  if (eventType === 'url')
    eventHandler({
      url: `https://mi-testing.iduruguay.gub.uy/error/?errorCode=OIDC_ERROR`,
    });
};

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
    expect.assertions(3);
  });

  it('calls initialize and makes a login request with empty redirectUri', async () => {
    const redirectUri = '';
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
          url: `${parameters.redirectUri}?code=35773ab93b5b4658b81062ce3969efc2`,
        });
    });
    const code = await makeRequest(REQUEST_TYPES.LOGIN);
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

    mockAddEventListener.mockImplementation(mockAddEventListenerError);

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
    expect.assertions(5);
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

    mockAddEventListener.mockImplementation(mockAddEventListenerError);

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
    expect.assertions(5);
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
    expect.assertions(5);
  });

  it('calls set parameters, makes a login request with correct parameters and Linking.openUrl fails', async () => {
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
    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toMatchObject(Error("Couldn't make request"));
    }
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
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect.assertions(5);
  });
});
