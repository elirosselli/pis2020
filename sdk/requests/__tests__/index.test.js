import makeRequest, { REQUEST_TYPES } from '../index';
import { loginEndpoint } from '../endpoints';

const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: mockLinkingOpenUrl,
}));

afterEach(() => jest.clearAllMocks());

describe('login', () => {
  it('calls login with clientId', async () => {
    const clientId = 'clientId';
    await makeRequest(REQUEST_TYPES.LOGIN, clientId);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(loginEndpoint(clientId));
  });

  it('calls login without clientId', () => {
    const response = makeRequest(REQUEST_TYPES.LOGIN, '');
    expect(response).toBe('');
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
  });
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
