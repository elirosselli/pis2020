import makeRequest from '../../requests';
import { refreshToken } from '../index';
import REQUEST_TYPES from '../../utils/constants';

const requestFailedMessage = "Couldn't make request";

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
    makeRequest.mockReturnValue(
      Promise.reject(new Error(requestFailedMessage)),
    );
    try {
      await refreshToken();
    } catch (error) {
      expect(error).toMatchObject(Error(requestFailedMessage));
    }

    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.GET_REFRESH_TOKEN);
    expect.assertions(3);
  });
});
