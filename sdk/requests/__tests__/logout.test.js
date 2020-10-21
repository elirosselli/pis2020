import logout from '../logout';
import { getParameters } from '../../configuration';

jest.mock('../../configuration');

const mockAddEventListener = jest.fn();
const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());
const missingParamsMessage = 'Missing required parameter(s): ';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
  openURL: mockLinkingOpenUrl,
}));

const correctLogoutEndpoint1 =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=idToken&post_logout_redirect_uri=post_logout_redirect_uri1&state=2KVAEzPpazbGFD5';

const correctLogoutEndpoint2 =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=idToken&post_logout_redirect_uri=post_logout_redirect_uri2&state=';

describe('logout', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls logout with idTokenHint, postLogoutRedirectUri and state', async () => {
    getParameters.mockReturnValue({
      idToken: 'idToken',
      postLogoutRedirectUri: 'post_logout_redirect_uri1',
      state: '2KVAEzPpazbGFD5',
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: 'post_logout_redirect_uri1',
        });
    });
    const redirectUri = await logout();
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint1);
    expect(redirectUri).toBe('post_logout_redirect_uri1');
  });

  it('calls logout with idTokenHint and postLogoutRedirectUri but without state', async () => {
    getParameters.mockReturnValue({
      idToken: 'idToken',
      postLogoutRedirectUri: 'post_logout_redirect_uri2',
      state: '',
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: 'post_logout_redirect_uri2',
        });
    });
    const redirectUri = await logout();
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint2);
    expect(redirectUri).toBe('post_logout_redirect_uri2');
  });

  it('calls logout with idTokenHint and state but without postLogoutRedirectUri', async () => {
    getParameters.mockReturnValue({
      idToken: 'idToken',
      postLogoutRedirectUri: '',
      state: '2KVAEzPpazbGFD5',
    });
    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await logout();
    } catch (error) {
      expect(error).toMatchObject(
        Error(`${missingParamsMessage}postLogoutRedirectUri`),
      );
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    expect.assertions(2);
  });

  it('calls logout with postLogoutRedirectUri and state but without idTokenHint', async () => {
    getParameters.mockReturnValue({
      idToken: '',
      postLogoutRedirectUri: 'post_logout_redirect_uri',
      state: '2KVAEzPpazbGFD5',
    });
    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await logout();
    } catch (error) {
      expect(error).toMatchObject(Error(`${missingParamsMessage}idTokenHint`));
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    expect.assertions(2);
  });

  it('calls logout with state but without idTokenHint and postLogoutRedirectUri', async () => {
    getParameters.mockReturnValue({
      idToken: '',
      postLogoutRedirectUri: '',
      state: '2KVAEzPpazbGFD5',
    });
    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await logout();
    } catch (error) {
      expect(error).toMatchObject(
        Error(`${missingParamsMessage}idTokenHint, postLogoutRedirectUri`),
      );
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    expect.assertions(2);
  });

  it('calls logout with required parameters and Linking.openUrl fails', async () => {
    getParameters.mockReturnValue({
      idToken: 'idToken',
      postLogoutRedirectUri: 'post_logout_redirect_uri1',
      state: '2KVAEzPpazbGFD5',
    });
    mockLinkingOpenUrl.mockImplementation(() => Promise.reject());
    mockAddEventListener.mockImplementation();
    try {
      await logout();
    } catch (error) {
      expect(error).toMatchObject(Error("Couldn't make request"));
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint1);
    expect.assertions(3);
  });

  it('calls login with required parameters and returns invalid url', async () => {
    getParameters.mockReturnValue({
      idToken: 'idToken',
      postLogoutRedirectUri: 'post_logout_redirect_uri1',
      state: '2KVAEzPpazbGFD5',
    });
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: '',
        });
    });
    try {
      await logout();
    } catch (error) {
      expect(error).toMatchObject(Error('Invalid post logout redirect uri'));
    }
    expect(mockLinkingOpenUrl).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(correctLogoutEndpoint1);
    expect.assertions(3);
  });
});
