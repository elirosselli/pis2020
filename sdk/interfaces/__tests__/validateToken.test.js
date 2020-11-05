import makeRequest from '../../requests';
import { validateToken } from '../index';
import REQUEST_TYPES from '../../utils/constants';

const requestFailedMessage = "Couldn't make request";

jest.mock('../../requests');

afterEach(() => jest.clearAllMocks());

describe('validateToken', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls validateToken with valid token', async () => {
    const result = {
      jwks: 'jwks',
      error: true,
    };
    makeRequest.mockReturnValue(Promise.resolve(result));

    const response = await validateToken();

    expect(response).toBe(result);
  });
  it('calls validateToken with invalid token', async () => {
    const result = {
      jwks: 'jwks',
      error: false,
    };
    makeRequest.mockReturnValue(Promise.resolve(result));

    const response = await validateToken();

    expect(response).toBe(result);
  });
});
