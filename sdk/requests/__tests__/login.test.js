import login from '../login';
import { getParameters } from '../../configuration';

jest.mock('../../configuration');

jest.mock('../../security', () => ({
  generateRandomState: jest.fn(),
}));

const mockAddEventListener = jest.fn();
const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
  openURL: mockLinkingOpenUrl,
}));

const mockState = '123456random-state';

const correctLoginEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20scope&response_type=code&client_id=clientId&redirect_uri=redirectUri&state=${mockState}`;

describe('login', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls login with correct clientId, correct redirectUri and return valid code', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
      scope: 'scope',
      state: mockState,
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: `redirectUri?code=35773ab93b5b4658b81061ce3969efc2&state=${mockState}`,
        });
    });
    const code = await login();
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect(code).toBe('35773ab93b5b4658b81061ce3969efc2');
  });

  it('calls login with correct clientId, correct redirectUri and return invalid code', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
      scope: 'scope',
      state: mockState,
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: 'redirectUri?code=&state=123456random-state',
        });
    });
    try {
      await login();
    } catch (error) {
      expect(error).toMatchObject(Error('Invalid authorization code'));
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect.assertions(3);
  });

  it('calls login with correct clientId and Linking.openUrl fails', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
      scope: 'scope',
      state: mockState,
    });
    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await login();
    } catch (error) {
      expect(error).toMatchObject(Error("Couldn't make request"));
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLoginEndpoint);
    expect.assertions(3);
  });

  it('calls login with incorrect clientId', async () => {
    getParameters.mockReturnValue({
      clientId: '',
    });
    mockAddEventListener.mockImplementation();
    try {
      await login();
    } catch (error) {
      expect(error).toMatchObject(Error("Couldn't make request"));
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    expect.assertions(2);
  });
});
