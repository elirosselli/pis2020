import { Platform } from 'react-native';
import { fetch } from '../../utils/helpers';
import { getParameters } from '../../configuration';
import ERRORS from '../../utils/errors';
import logout from '../logout';

jest.mock('../../configuration');

jest.mock('../../utils/helpers', () => ({
  ...jest.requireActual('../../utils/helpers'),
  fetch: jest.fn(),
}));

jest.mock('../../configuration');

jest.mock('../../security', () => ({
  generateRandomState: jest.fn(),
}));

const idToken = 'idToken';
const mockState = '3035783770';
const correctLogoutEndpoint1 = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=${mockState}`;
const correctLogoutEndpoint2 = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=`;

const mockFunc = jest.fn();
jest.mock('async-mutex', () => ({
  Mutex: jest.fn(() => ({
    acquire: () => mockFunc,
  })),
}));

afterEach(() => jest.clearAllMocks());

describe('logout', () => {
  it('calls logout with idTokenHint and state', async () => {
    getParameters.mockReturnValue({
      idToken,
      state: mockState,
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: correctLogoutEndpoint1,
      }),
    );
    const result = await logout();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint1, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      state: mockState,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('calls logout with idTokenHint but without state', async () => {
    getParameters.mockReturnValue({
      idToken,
      state: '',
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: correctLogoutEndpoint2,
      }),
    );
    const result = await logout();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint2, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('calls logout without idTokenHint', async () => {
    getParameters.mockReturnValue({
      idToken: '',
      state: mockState,
    });
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN_HINT);
    }
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it('calls logout with required parameters and response not OK', async () => {
    getParameters.mockReturnValue({
      idToken,
      state: mockState,
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        url: 'something',
      }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it('calls logout with required parameters and returns invalid url', async () => {
    getParameters.mockReturnValue({
      idToken,
      state: mockState,
    });
    fetch.mockImplementation(() =>
      Promise.resolve({ status: 200, url: 'badUrl' }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_URL_LOGOUT);
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint1, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls logout with required parameters and fails', async () => {
    getParameters.mockReturnValue({
      idToken,
      state: mockState,
    });
    fetch.mockImplementation(() => Promise.reject());
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint1, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });
});
