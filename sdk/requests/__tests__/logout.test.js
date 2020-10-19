import logout from '../logout';
import { getParameters } from '../../configuration';

jest.mock('../../configuration');

const mockAddEventListener = jest.fn();
const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());
const missingParams = 'Missing required parameter(s): ';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
  openURL: mockLinkingOpenUrl,
}));

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
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=idToken&post_logout_redirect_uri=post_logout_redirect_uri1&state=2KVAEzPpazbGFD5',
    );
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
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=idToken&post_logout_redirect_uri=post_logout_redirect_uri2&state=',
    );
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
        Error(`${missingParams}postLogoutRedirectUri`),
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
      expect(error).toMatchObject(Error(`${missingParams}idTokenHint`));
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
        Error(`${missingParams}idTokenHint, postLogoutRedirectUri`),
      );
    }
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
    expect.assertions(2);
  });
});
