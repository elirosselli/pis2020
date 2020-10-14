import { login, initialize, getToken } from '../index';
import makeRequest from '../../requests';
import { getParameters } from '../../configuration';

jest.mock('../../requests');
const { REQUEST_TYPES } = jest.requireActual('../../requests');

const mockAddEventListener = jest.fn();
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
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

describe('getToken', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls getToken correctly', async () => {
    const token = 'c9747e3173544b7b870d48aeafa0f661';
    makeRequest.mockReturnValue(Promise.resolve(token));

    const response = await getToken();

    expect(response).toBe(token);
  });

  it('calls getToken incorrectly', async () => {
    makeRequest.mockReturnValue(
      Promise.reject(new Error("Couldn't make request")),
    );
    try {
      await getToken();
    } catch (error) {
      expect(error).toMatchObject(Error("Couldn't make request"));
    }

    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.GET_TOKEN);
    expect.assertions(3);
  });
});
