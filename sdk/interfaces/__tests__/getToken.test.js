import makeRequest from '../../requests';
import { getToken } from '../index';
import { ERRORS, REQUEST_TYPES } from '../../utils/constants';

jest.mock('../../requests');

afterEach(() => jest.clearAllMocks());

describe('getToken', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls getToken correctly', async () => {
    const token = 'c9747e3173544b7b870d48aeafa0f661';
    makeRequest.mockReturnValue(Promise.resolve(token));
    const response = await getToken();
    expect(response).toBe(token);
  });

  it('calls getToken incorrectly', async () => {
    makeRequest.mockReturnValue(Promise.reject(ERRORS.INVALID_GRANT)); // ACA ESTA BIEN O ES INVALID_CLIENT
    try {
      await getToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_GRANT);
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.GET_TOKEN);
    expect.assertions(3);
  });
});
