import { login } from '../index';
import makeRequest from '../../requests';

describe('login', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls login with correct clientId and return valid code', async () => {
    jest.mock('react-native/Libraries/Linking/Linking', () => ({
      addEventListener: jest.fn((eventType, eventHandler) => {
        if (eventType === 'url')
          eventHandler({
            url:
              'sdkidu.testing:////auth?code=35773ab93b5b4658b81061ce3969efc2&state=TEST_STATE',
          });
      }),
      removeEventListener: jest.fn(),
    }));
    const clientId = 'clientId';
    const code = await login(clientId);
    expect(code).toBe('35773ab93b5b4658b81061ce3969efc2');
  });

  it('calls login with correct clientId and return invalid code', async () => {
    jest.mock('react-native/Libraries/Linking/Linking', () => ({
      addEventListener: jest.fn((eventType, eventHandler) => {
        if (eventType === 'url')
          eventHandler({
            url: 'sdkidu.testing:////auth?code=&state=TEST_STATE',
          });
      }),
      removeEventListener: jest.fn(),
    }));
    const clientId = 'clientId';
    const code = await login(clientId);
    expect(code).toBe(Error('Invalid authorization code'));
  });
});
