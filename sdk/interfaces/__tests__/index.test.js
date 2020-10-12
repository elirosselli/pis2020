import { login, initialize } from '../index';
import makeRequest from '../../requests';
import { getParameters } from '../../configuration';

jest.mock('../../requests');
const { REQUEST_TYPES } = jest.requireActual('../../requests');

const mockAddEventListener = jest.fn();
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
}));

jest.mock('rn-fetch-blob', () => ({
  config: jest.fn(() => ({ fetch: jest.fn() })),
}));

describe('initialize', () => {
  const parameters = {
    redirectUri: 'redirectUri',
    clientId: 'clientId',
    clientSecret: 'clientSecret',
  };
  initialize(
    parameters.redirectUri,
    parameters.clientId,
    parameters.clientSecret,
  );
  const responseParameters = getParameters();
  expect(responseParameters.redirectUri).toStrictEqual(parameters.redirectUri);
  expect(responseParameters.clientId).toStrictEqual(parameters.clientId);
  expect(responseParameters.clientSecret).toStrictEqual(
    parameters.clientSecret,
  );
});

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
    const code = await login();
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGIN);
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
    try {
      await login();
    } catch (error) {
      expect(error).toMatchObject(Error('Invalid authorization code'));
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGIN);
    expect.assertions(3);
  });

  it('calls login with incorrect clientId', async () => {
    makeRequest.mockReturnValue(Promise.reject(Error()));
    mockAddEventListener.mockImplementation();
    try {
      await login();
    } catch (error) {
      expect(error).toMatchObject(Error("Couldn't make request"));
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.LOGIN);
    expect.assertions(3);
  });
});
