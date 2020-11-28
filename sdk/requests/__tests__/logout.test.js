import { Platform } from 'react-native';
import { fetch } from '../../utils/helpers';
import { getParameters } from '../../configuration';
import ERRORS from '../../utils/errors';
import logout from '../logout';

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
}));

jest.mock('../../configuration');

jest.mock('../../utils/helpers', () => ({
  ...jest.requireActual('../../utils/helpers'),
  fetch: jest.fn(),
}));

jest.mock('../../configuration');

const mockState = '3035783770';

jest.mock('../../security', () => ({
  generateRandomState: jest.fn(() => mockState),
}));

const idToken = 'idToken';
const correctLogoutEndpoint1 = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=${mockState}`;

const mockMutex = jest.fn();
jest.mock('async-mutex', () => ({
  Mutex: jest.fn(() => ({
    acquire: () => mockMutex,
  })),
}));

afterEach(() => jest.clearAllMocks());

describe('logout', () => {
  it('calls logout with idTokenHint and state', async () => {
    getParameters.mockReturnValue({ idToken, production: false });
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
      disableAllSecurity: false,
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      state: mockState,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('calls logout without idTokenHint', async () => {
    getParameters.mockReturnValue({ idToken: '', production: false });
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN_HINT);
    }
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls logout with required parameters and response not OK', async () => {
    getParameters.mockReturnValue({ idToken });
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
    expect(mockMutex).toHaveBeenCalledTimes(1);
  });

  it('calls logout with required parameters and fetch returns invalid url with idToken and state', async () => {
    getParameters.mockReturnValue({ idToken, production: false });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: `InvalidUrl?id_token_hint=${idToken}&post_logout_redirect_uri=&state=${mockState}`,
      }),
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
      disableAllSecurity: false,
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls logout with required parameters and fetch returns invalid url without idToken and state', async () => {
    getParameters.mockReturnValue({ idToken, production: false });
    fetch.mockImplementation(() =>
      Promise.resolve({ status: 200, url: 'InvalidUrl' }),
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
      disableAllSecurity: false,
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls logout with required parameters and fetch fails', async () => {
    getParameters.mockReturnValue({ idToken, production: false });
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
      disableAllSecurity: false,
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls logout with required parameters and fetch returns empty state', async () => {
    getParameters.mockReturnValue({ idToken, production: false });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=`,
      }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_STATE);
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint1, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      disableAllSecurity: false,
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls logout with required parameters and fetch returns different state', async () => {
    getParameters.mockReturnValue({ idToken, production: false });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=differentState`,
      }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_STATE);
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint1, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      disableAllSecurity: false,
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls logout with required parameters and fetch returns empty idToken', async () => {
    getParameters.mockReturnValue({ idToken, production: false });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=&post_logout_redirect_uri=&state=${mockState}`,
      }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN_HINT);
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint1, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      disableAllSecurity: false,
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });

  it('calls logout with required parameters and fetch returns different idToken', async () => {
    getParameters.mockReturnValue({ idToken, production: false });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=differentIdToken&post_logout_redirect_uri=&state=${mockState}`,
      }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN_HINT);
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint1, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      disableAllSecurity: false,
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(mockMutex).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });
});
