import { initialize, getToken } from '../index';
import makeRequest from '../../requests';
import { getParameters } from '../../configuration';

jest.mock('../../requests');
const { REQUEST_TYPES } = jest.requireActual('../../requests');

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

describe('getToken', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls getToken correctly', async () => {
    const token = 'c9747e3173544b7b870d48aeafa0f661';
    makeRequest.mockReturnValue(Promise.resolve(token));
    const response = await getToken();
    expect(response).toBe(token);
  });

  it('calls getToken incorrectly', async () => {
    makeRequest.mockReturnValue(Promise.reject(Error()));
    try {
      await getToken();
    } catch (error) {
      expect(error).toMatchObject(Error());
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.GET_TOKEN);
    expect.assertions(3);
  });
});
