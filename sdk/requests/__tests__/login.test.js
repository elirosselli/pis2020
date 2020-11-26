import login from '../login';
import { getParameters } from '../../configuration';
import ERRORS from '../../utils/errors';

jest.mock('../../configuration');

const mockState = '3035783770';

jest.mock('../../security', () => ({
  generateRandomState: jest.fn(() => mockState),
}));

const mockAddEventListener = jest.fn();
const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
  openURL: mockLinkingOpenUrl,
}));

const mockMutex = jest.fn();
jest.mock('async-mutex', () => ({
  Mutex: jest.fn(() => ({
    acquire: () => mockMutex,
  })),
}));

const correctLoginEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20correctScope&response_type=code&client_id=clientId&redirect_uri=redirectUri&state=${mockState}`;

describe('login', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls login with correct clientId, correct redirectUri and returns valid code', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
      clientSecret: 'clientSecret',
      scope: 'correctScope',
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `redirectUri?code=35773ab93b5b4658b81061ce3969efc2&state=${mockState}`,
        });
    });
    const response = await login();
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect(response).toStrictEqual({
      code: '35773ab93b5b4658b81061ce3969efc2',
      state: mockState,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('calls login with correct clientId, correct redirectUri and return invalid code', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
      clientSecret: 'clientSecret',
      scope: 'correctScope',
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: 'redirectUri?code=&state=3035783770',
        });
    });
    try {
      await login();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls login with correct clientId and Linking.openUrl fails', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
      clientSecret: 'clientSecret',
      scope: 'correctScope',
    });
    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await login();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls login with empty clientId', async () => {
    getParameters.mockReturnValue({
      clientId: '',
    });
    mockAddEventListener.mockImplementation();
    try {
      await login();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(3);
  });

  it('calls login with empty redirectUri', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: '',
    });
    mockAddEventListener.mockImplementation();
    try {
      await login();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_REDIRECT_URI);
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(3);
  });

  it('calls login with empty clientSecret', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
      clientSecret: '',
    });
    mockAddEventListener.mockImplementation();
    try {
      await login();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_SECRET);
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(3);
  });

  it('calls login with correct clientId, correct redirectUri and return different state', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
      clientSecret: 'clientSecret',
      scope: 'correctScope',
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url:
            'redirectUri?code=35773ab93b5b4658b81061ce3969efc2&state=invalid_state',
        });
    });
    try {
      await login();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_STATE);
    }
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect.assertions(4);
  });

  it('calls login with correct clientId, correct redirectUri and return empty state', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
      clientSecret: 'clientSecret',
      scope: 'correctScope',
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: 'redirectUri?code=35773ab93b5b4658b81061ce3969efc2&state=',
        });
    });
    try {
      await login();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_STATE);
    }
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect.assertions(4);
  });

  it('calls login with correct clientId, correct redirectUri and user denies access', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
      clientSecret: 'clientSecret',
      scope: 'correctScope',
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url:
            'sdkidu.testing://auth?error=access_denied&error_description=The%20resource%20owner%20or%20authorization%20server%20denied%20the%20request',
        });
    });
    try {
      await login();
    } catch (error) {
      expect(error).toBe(ERRORS.ACCESS_DENIED);
    }
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
  });
});
