import makeRequest from '../../requests';
import { refreshToken } from '../index';
import { ERRORS, REQUEST_TYPES } from '../../utils/constants';

jest.mock('../../requests');

afterEach(() => jest.clearAllMocks());

describe('refreshToken', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls refreshToken correctly', async () => {
    const newToken = '041a156232ac43c6b719c57b7217c9ee';
    makeRequest.mockReturnValue(Promise.resolve(newToken));

    const response = await refreshToken();

    expect(response).toBe(newToken);
  });

  it('calls refreshToken incorrectly', async () => {
    makeRequest.mockReturnValue(Promise.reject(ERRORS.INVALID_GRANT));
    try {
      await refreshToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_GRANT);
    }

    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.GET_REFRESH_TOKEN);
    expect.assertions(3);
  });
});
