import makeRequest from '../index';
import REQUEST_TYPES from '../constants';
import login from '../login';
import getTokenOrRefresh from '../getTokenOrRefresh';

jest.mock('../login');
jest.mock('../getTokenOrRefresh');
jest.mock('../../configuration');

afterEach(() => jest.clearAllMocks());

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

describe('login', () => {
  it('calls login and works correctly', async () => {
    const code = 'code';
    login.mockImplementation(() => Promise.resolve(code));
    const response = await makeRequest(REQUEST_TYPES.LOGIN);
    expect(response).toBe(code);
  });

  it('calls login and fails', async () => {
    const error = Error('error');
    login.mockImplementation(() => Promise.reject(error));
    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (err) {
      expect(err).toBe(error);
    }
    expect.assertions(1);
  });
});

describe('getToken', () => {
  it('calls getToken and works correctly', async () => {
    const token = 'token';
    getTokenOrRefresh.mockImplementation(() => Promise.resolve(token));
    const response = await makeRequest(REQUEST_TYPES.GET_TOKEN);
    expect(response).toBe(token);
  });

  it('calls getToken and fails', async () => {
    const error = Error('error');
    getTokenOrRefresh.mockImplementation(() => Promise.reject(error));
    try {
      await makeRequest(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toBe(error);
    }
    expect.assertions(1);
  });
});

describe('refreshToken', () => {
  it('calls refreshToken and works correctly', async () => {
    const token = 'token';
    getTokenOrRefresh.mockImplementation(() => Promise.resolve(token));
    const response = await makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
    expect(response).toBe(token);
  });

  it('calls refreshToken and fails', async () => {
    const error = Error('error');
    getTokenOrRefresh.mockImplementation(() => Promise.reject(error));
    try {
      await makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toBe(error);
    }
    expect.assertions(1);
  });
});

describe('default', () => {
  it('calls default', async () => {
    const response = await makeRequest('default');
    expect(response).toBe('default value');
  });
});
