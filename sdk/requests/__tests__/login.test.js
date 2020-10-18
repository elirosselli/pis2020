import login from '../login';
import { getParameters } from '../../configuration';

jest.mock('../../configuration');

const mockAddEventListener = jest.fn();
const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
  openURL: mockLinkingOpenUrl,
}));

const correctLoginEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20personal_info&response_type=code&client_id=clientId&redirect_uri=redirectUri';

describe('login', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls login with correct clientId, correct redirectUri and return valid code', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url:
            'redirectUri?code=35773ab93b5b4658b81061ce3969efc2&state=TEST_STATE',
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
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: 'redirectUri?code=&state=TEST_STATE',
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
