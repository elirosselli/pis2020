import makeRequest, { REQUEST_TYPES } from '../index';
import { loginEndpoint } from '../endpoints';
import { getToken } from '../../interfaces';

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


jest.mock('rn-fetch-blob', () => ({
  fetch:  jest.fn(() => Promise.resolve()),
  config:  jest.fn(() => Promise.resolve()),
}));

describe('getToken', () => {

  it('calls getToken with incorrect code', async () => {
    const clientId = '894329';
    const clientSecret = 'cdc04f19ac0f28fb3e1ce6d42b37e85a63fb8a654691aa4484b6b94b';
    const code = 'incorrectCode';
    
    const response = await makeRequest(REQUEST_TYPES.GET_TOKEN, clientId, clientSecret, code);


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
