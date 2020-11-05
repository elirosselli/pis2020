import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { getParameters } from '../../configuration';
import logout from '../logout';

jest.mock('../../configuration');

const missingParamsMessage = 'Missing required parameter(s): ';

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

const idToken = 'idToken';
const state = '2KVAEzPpazbGFD5';
const postLogoutRedirectUri = 'app.testing://postLogout';
const correctLogoutEndpoint1 = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}`;
const correctLogoutEndpoint2 = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=`;
afterEach(() => jest.clearAllMocks());

describe('logout', () => {
  it('calls logout with idTokenHint, postLogoutRedirectUri and state', async () => {
    getParameters.mockReturnValue({
      idToken,
      postLogoutRedirectUri,
      state,
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: correctLogoutEndpoint1,
      }),
    );
    const returnedState = await logout();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint1, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(returnedState).toBe(state);
  });

  it('calls logout with idTokenHint and postLogoutRedirectUri but without state', async () => {
    getParameters.mockReturnValue({
      idToken,
      postLogoutRedirectUri,
      state: '',
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        url: correctLogoutEndpoint2,
      }),
    );
    const returnedState = await logout();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint2, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect(returnedState).toBe(undefined);
  });

  it('calls logout with idTokenHint and state but without postLogoutRedirectUri', async () => {
    const incorrectLogoutEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=&state=${state}`;
    getParameters.mockReturnValue({
      idToken,
      postLogoutRedirectUri: '',
      state,
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        url: Error(`${missingParamsMessage}postLogoutRedirectUri`),
      }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toMatchObject(
        Error(`${missingParamsMessage}postLogoutRedirectUri`),
      );
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(incorrectLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect.assertions(3);
  });

  it('calls logout with postLogoutRedirectUri and state but without idTokenHint', async () => {
    const incorrectLogoutEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}`;
    getParameters.mockReturnValue({
      idToken: '',
      postLogoutRedirectUri,
      state,
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        url: Error(`${missingParamsMessage}idTokenHint`),
      }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toMatchObject(Error(`${missingParamsMessage}idTokenHint`));
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(incorrectLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect.assertions(3);
  });

  it('calls logout with state but without idTokenHint and postLogoutRedirectUri', async () => {
    const incorrectLogoutEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=&post_logout_redirect_uri=&state=${state}`;
    getParameters.mockReturnValue({
      idToken: '',
      postLogoutRedirectUri: '',
      state,
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        url: Error(`${missingParamsMessage}idTokenHint, postLogoutRedirectUri`),
      }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toMatchObject(
        Error(`${missingParamsMessage}idTokenHint, postLogoutRedirectUri`),
      );
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(incorrectLogoutEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect.assertions(3);
  });

  it('calls logout with required parameters and response not OK', async () => {
    getParameters.mockReturnValue({
      idToken,
      postLogoutRedirectUri,
      state,
    });
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        url: Error('Response status not OK'),
      }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toMatchObject(Error('Response status not OK'));
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint1, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect.assertions(3);
  });

  it('calls logout with required parameters and returns invalid url', async () => {
    getParameters.mockReturnValue({
      idToken,
      postLogoutRedirectUri,
      state,
    });
    fetch.mockImplementation(() =>
      Promise.resolve({ status: 200, url: Error('Invalid returned url') }),
    );
    try {
      await logout();
    } catch (error) {
      expect(error).toMatchObject(Error('Invalid returned url'));
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint1, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect.assertions(3);
  });

  it('calls logout with required parameters and fails', async () => {
    getParameters.mockReturnValue({
      idToken,
      postLogoutRedirectUri,
      state,
    });
    const err = Error('error');
    fetch.mockImplementation(() => Promise.reject(err));
    try {
      await logout();
    } catch (error) {
      expect(error).toMatchObject(error);
    }
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(correctLogoutEndpoint1, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    expect.assertions(3);
  });
});
