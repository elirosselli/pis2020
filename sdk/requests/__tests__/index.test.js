import makeRequest from '../index';

const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: mockLinkingOpenUrl,
  addEventListener: jest.fn(),
}));

afterEach(() => jest.clearAllMocks());

describe('login', () => {
  it('calls login with clientId', async () => {
    const clientId = 'clientId';
    await makeRequest('login', clientId);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${clientId}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
    );
  });
});

it('calls login without clientId', () => {
  const response = makeRequest('login', '');
  expect(response).toBe('');
  expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
});

describe('default', () => {
  it('calls default with clientId', () => {
    const response = makeRequest('default', 'clientId');
    expect(response).toBe('default value');
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
  });

  it('calls default without clientId', () => {
    const response = makeRequest('default', '');
    expect(response).toBe('default value');
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
  });
});
