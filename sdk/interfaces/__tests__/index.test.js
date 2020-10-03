import { login } from '../index';

const mockAddEventListener = jest.fn();

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
}));

// TODO: falta mockear el modulo requests

describe('login', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls login with correct clientId and return valid code', async () => {
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url:
            'sdkidu.testing:////auth?code=35773ab93b5b4658b81061ce3969efc2&state=TEST_STATE',
        });
    });

    const clientId = 'clientId';
    const code = await login(clientId);
    expect(code).toBe('35773ab93b5b4658b81061ce3969efc2');
  });

  it('calls login with correct clientId and return invalid code', async () => {
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url: 'sdkidu.testing:////auth?code=&state=TEST_STATE',
        });
    });
    const clientId = 'clientId';
    try {
      await login(clientId);
    } catch (error) {
      expect(error).toMatchObject(Error('Invalid authorization code'));
    }
    expect.assertions(1);
  });
});
