import { login } from '../index';

const mockLinkingOpenUrl = jest.fn(() =>
  Promise.resolve({
    url: 'sdkidu.testing:////auth?code=TEST_CODE&state=TEST_STATE',
  }),
);

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: mockLinkingOpenUrl,
}));

describe('login', () => {
  it('calls correct url', async () => {
    const clientId = 'clientId';
    await login(clientId);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${clientId}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
    );
  });
});
