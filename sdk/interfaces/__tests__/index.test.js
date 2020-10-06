import { login } from '../index';
import makeRequest from '../../requests';

jest.mock('../../requests');
const { REQUEST_TYPES } = jest.requireActual('../../requests');

const mockAddEventListener = jest.fn();
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
}));

describe('login', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls login with correct clientId and return valid code', async () => {
    makeRequest.mockReturnValue(Promise.resolve());
    mockAddEventListener.mockImplementation((eventType, eventHandler) => {
      if (eventType === 'url')
        eventHandler({
          url:
            'sdkidu.testing:////auth?code=35773ab93b5b4658b81061ce3969efc2&state=TEST_STATE',
        });
    });

    const clientId = 'clientId';
    const code = await login(clientId);
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGIN, clientId);
    expect(code).toBe('35773ab93b5b4658b81061ce3969efc2');
  });

  it('calls login with correct clientId and return invalid code', async () => {
    makeRequest.mockReturnValue(Promise.resolve());
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
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGIN, clientId);
    expect.assertions(3);
  });

  it('calls login with incorrect clientId', async () => {
    makeRequest.mockReturnValue(Promise.reject(Error()));
    mockAddEventListener.mockImplementation();
    const clientId = 'incorrectClientId';
    try {
      await login(clientId);
    } catch (error) {
      expect(error).toMatchObject(Error("Couldn't make request"));
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGIN, clientId);
    expect.assertions(3);
  });
});
