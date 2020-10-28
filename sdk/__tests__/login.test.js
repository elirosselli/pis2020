import { login } from '../index';
import { initialize } from '../interfaces';
import { getParameters, setParameters } from '../configuration';

const mockAddEventListener = jest.fn();
const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
  openURL: mockLinkingOpenUrl,
}));

afterEach(() => jest.clearAllMocks());

describe('login', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls initialize and login and works correctly', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const redirectUri = 'redirectUri';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    const scope = 'scope';

    const correctLoginEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

    initialize(redirectUri, clientId, clientSecret, postLogoutRedirectUri);
    setParameters({ scope });

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

    expect(getParameters().clientId).toBe(clientId);
    expect(getParameters().clientSecret).toBe(clientSecret);
    expect(getParameters().redirectUri).toBe(redirectUri);
    expect(getParameters().postLogoutRedirectUri).toBe(postLogoutRedirectUri);
    expect(getParameters().scope).toBe(scope);
  });

  // Se tiene que tener un conjunto de parámetros previamente seteados.  El usuario deniega el acceso a la aplicación.
  // Se retorna código de error correspondiente. ?????????

  it('calls initialize and login with incorrect data', async () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const redirectUri = 'redirectUri';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    const scope = 'scope';

    const correctLoginEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

    initialize(redirectUri, clientId, clientSecret, postLogoutRedirectUri);
    setParameters({ scope });

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

    expect(getParameters().clientId).toBe(clientId);
    expect(getParameters().clientSecret).toBe(clientSecret);
    expect(getParameters().redirectUri).toBe(redirectUri);
    expect(getParameters().postLogoutRedirectUri).toBe(postLogoutRedirectUri);
    expect(getParameters().scope).toBe(scope);
    expect.assertions(8);
  });
});
