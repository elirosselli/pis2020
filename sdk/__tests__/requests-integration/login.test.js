import { REQUEST_TYPES } from '../../utils/constants';
import ERRORS from '../../utils/errors';
import {
  getParameters,
  setParameters,
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

const mockState = '3035783770';
jest.mock(
  'mersenne-twister',
  () =>
    function mockMersenne() {
      return {
        random_int: jest.fn(() => mockState),
      };
    },
);

afterEach(() => jest.clearAllMocks());

beforeEach(() => {
  resetParameters();
});

const correctLoginEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20&response_type=code&client_id=clientId&redirect_uri=redirectUri&state=${mockState}`;
const correctLoginProductionEndpoint = `https://auth.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20&response_type=code&client_id=clientId&redirect_uri=redirectUri&state=${mockState}`;
const correctLoginEndpointWithScope = `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20correctScope&response_type=code&client_id=clientId&redirect_uri=redirectUri&state=${mockState}`;

const mockAddEventListenerError = (eventType, eventHandler) => {
  if (eventType === 'url')
    eventHandler({
      url: `https://mi-testing.iduruguay.gub.uy/error/?errorCode=OIDC_ERROR`,
    });
};

const mockAddEventListenerSuccess = (eventType, eventHandler) => {
  if (eventType === 'url')
    eventHandler({
      url: `redirectUri?code=35773ab93b5b4658b81061ce3969efc2&state=${mockState}`,
    });
};

const mockMutex = jest.fn();
jest.mock('async-mutex', () => ({
  Mutex: jest.fn(() => ({
    acquire: () => mockMutex,
  })),
}));

describe('configuration & security modules and make request type login integration', () => {
  it('calls initialize and makes a login request', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    initialize(redirectUri, clientId, clientSecret, false);

    let parameters = getParameters();
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
      scope: '',
    });

    mockAddEventListener.mockImplementation(mockAddEventListenerSuccess);
    const response = await makeRequest(REQUEST_TYPES.LOGIN);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect(response).toStrictEqual({
      code: '35773ab93b5b4658b81061ce3969efc2',
      state: mockState,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: response.code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls initialize and makes a login request with production set to true', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const production = true;
    initialize(redirectUri, clientId, clientSecret, production);

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation(mockAddEventListenerSuccess);
    const response = await makeRequest(REQUEST_TYPES.LOGIN);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      correctLoginProductionEndpoint,
    );
    expect(response).toStrictEqual({
      code: '35773ab93b5b4658b81061ce3969efc2',
      state: mockState,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production,
      code: response.code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls initialize and makes a login request with scope', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const scope = 'correctScope';
    initialize(redirectUri, clientId, clientSecret, false, scope);

    let parameters = getParameters();
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
      scope,
    });

    mockAddEventListener.mockImplementation(mockAddEventListenerSuccess);
    const response = await makeRequest(REQUEST_TYPES.LOGIN);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      correctLoginEndpointWithScope,
    );
    expect(response).toStrictEqual({
      code: '35773ab93b5b4658b81061ce3969efc2',
      state: mockState,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: response.code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope,
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls initialize and makes a login request with empty clientId', async () => {
    const redirectUri = 'redirectUri';
    const clientId = '';
    const clientSecret = 'clientSecret';

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      initialize(redirectUri, clientId, clientSecret, false);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();

    // No se tiene que haber setteado ninguno de los parámetros.
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls initialize and makes a login request with empty clientSecret', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = '';

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      initialize(redirectUri, clientId, clientSecret, false);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_SECRET);
    }

    parameters = getParameters();

    // No se tiene que haber setteado ninguno de los parámetros.
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation();

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls initialize and makes a login request with empty redirectUri', async () => {
    const redirectUri = '';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      initialize(redirectUri, clientId, clientSecret, false);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_REDIRECT_URI);
    }

    parameters = getParameters();

    // No se tiene que haber setteado ninguno de los parámetros.
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation();

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls initialize and makes a login request with invalid clientId', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'invalid_client_id';
    const clientSecret = 'clientSecret';

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      initialize(redirectUri, clientId, clientSecret, false);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();

    // No se tiene que haber setteado ninguno de los parámetros.
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation();

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls initialize and makes a login request with invalid clientSecret', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'invalid_client_secret';

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      initialize(redirectUri, clientId, clientSecret, false);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_SECRET);
    }

    parameters = getParameters();

    // No se tiene que haber setteado ninguno de los parámetros.
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation();

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls initialize and makes a login request with invalid redirectUri', async () => {
    const redirectUri = 'invalid_redirect_uri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      initialize(redirectUri, clientId, clientSecret, false);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_REDIRECT_URI);
    }

    parameters = getParameters();

    // No se tiene que haber setteado ninguno de los parámetros.
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation();

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls initialize and makes a login request with invalid production', async () => {
    const redirectUri = 'invalid_redirect_uri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const production = 'invalid_production';

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      initialize(redirectUri, clientId, clientSecret, production);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_PRODUCTION);
    }

    parameters = getParameters();

    // No se tiene que haber setteado ninguno de los parámetros.
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation();

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls initialize and makes a login request with invalid scope', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      initialize(redirectUri, clientId, clientSecret, false, 'invalid_scope');
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_SCOPE);
    }

    parameters = getParameters();

    // No se tiene que haber setteado ninguno de los parámetros.
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation();

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls initialize and makes a login request with correct parameters, fetch returns different state', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    initialize(redirectUri, clientId, clientSecret, false);

    let parameters = getParameters();
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
      scope: '',
    });

    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `${parameters.redirectUri}?code=35773ab93b5b4658b81061ce3969efc2&state=differentState`,
        });
    });

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_STATE);
    }

    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(5);
  });

  it('calls initialize and makes a login request with correct parameters, fetch returns empty state', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    initialize(redirectUri, clientId, clientSecret, false);

    let parameters = getParameters();
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
      scope: '',
    });

    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `${parameters.redirectUri}?code=35773ab93b5b4658b81061ce3969efc2&state=`,
        });
    });

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_STATE);
    }

    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(5);
  });

  it('calls initialize with clientId different from RP and then calls login', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'invalidClientId';
    const clientSecret = 'clientSecret';
    initialize(redirectUri, clientId, clientSecret, false);

    let parameters = getParameters();
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
      scope: '',
    });

    mockAddEventListener.mockImplementation(mockAddEventListenerError);

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(5);
  });

  it('calls initialize with redirectUri different from RP and then calls login', async () => {
    const redirectUri = 'invalidRedirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    initialize(redirectUri, clientId, clientSecret, false);

    let parameters = getParameters();
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
      scope: '',
    });

    mockAddEventListener.mockImplementation(mockAddEventListenerError);

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(5);
  });

  it('calls initialize and makes a login request, the user denies access to the application ', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    initialize(redirectUri, clientId, clientSecret, false);

    let parameters = getParameters();
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
      expect(error).toBe(ERRORS.ACCESS_DENIED);
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(5);
  });

  it('calls initialize and makes a login request with correct parameters, Linking.openUrl fails', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    initialize(redirectUri, clientId, clientSecret, false);

    let parameters = getParameters();
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
      scope: '',
    });
    mockLinkingOpenUrl.mockImplementationOnce(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
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
      scope: '',
    });
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(5);
  });

  it('calls initialize and makes a login request with correct parameters, fetch returns invalid authorization code', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    initialize(redirectUri, clientId, clientSecret, false);

    let parameters = getParameters();
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
      scope: '',
    });

    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `${parameters.redirectUri}?code=invalid_code&state=${mockState}`,
        });
    });

    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
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
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls setParameters and makes a login request with undefined scope', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const production = false;

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    const result = setParameters({
      redirectUri,
      clientId,
      clientSecret,
      production,
      scope: undefined,
    });
    expect(result).toStrictEqual(ERRORS.NO_ERROR);

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation(mockAddEventListenerSuccess);
    expect(mockAddEventListener).toHaveBeenCalledTimes(0);

    const response = await makeRequest(REQUEST_TYPES.LOGIN);
    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect(response).toStrictEqual({
      code: '35773ab93b5b4658b81061ce3969efc2',
      state: mockState,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      production: false,
      code: response.code,
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls setParameters and makes a login request with all invalid parameters', async () => {
    const redirectUri = 'invalid_redirect_uri';
    const clientId = 'invalid_client_id';
    const clientSecret = 'invalid_client_secret';
    const production = 'invalid_client_production';

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      setParameters({
        redirectUri,
        clientId,
        clientSecret,
        production,
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_REDIRECT_URI);
    }

    parameters = getParameters();

    // No se tiene que haber setteado ninguno de los parámetros.
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });

  it('calls setParameters and makes a login request with invalid parameter type', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const production = false;

    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    try {
      setParameters({
        redirectUri,
        clientId,
        clientSecret,
        production,
        wrongType: 'value',
      });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_PARAMETER_TYPE);
    }

    parameters = getParameters();

    // No se tiene que haber setteado ninguno de los parámetros.
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });

    mockAddEventListener.mockImplementation();
    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      scope: '',
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(6);
  });
});
