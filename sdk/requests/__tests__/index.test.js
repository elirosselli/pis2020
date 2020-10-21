import makeRequest from '../index';
import REQUEST_TYPES from '../../utils/constants';
import login from '../login';
import logout from '../logout';
import getTokenOrRefresh from '../getTokenOrRefresh';
import getUserInfo from '../getUserInfo';

jest.mock('../login');
jest.mock('../logout');
jest.mock('../getTokenOrRefresh');
jest.mock('../getUserInfo');
jest.mock('../../configuration');

afterEach(() => jest.clearAllMocks());

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

describe('getUserInfo', () => {
  it('calls getUserInfo and works correctly', async () => {
    getUserInfo.mockImplementation(() =>
      Promise.resolve({
        nombre_completo: 'test',
        primer_apellido: 'test',
        primer_nombre: 'testNombre',
        segundo_apellido: 'testApellido',
        segundo_nombre: 'testSegundoNombre',
        sub: '5968',
        uid: 'uy-cid-12345678',
      }),
    );

    const userInfo = await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    expect(userInfo).toStrictEqual({
      nombre_completo: 'test',
      primer_apellido: 'test',
      primer_nombre: 'testNombre',
      segundo_apellido: 'testApellido',
      segundo_nombre: 'testSegundoNombre',
      sub: '5968',
      uid: 'uy-cid-12345678',
    });
  });

  it('calls getUserInfo and fails', async () => {
    const error = Error('An error occurred');
    getUserInfo.mockImplementation(() => Promise.reject(error));

    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toBe(error);
    }
    expect.assertions(1);
  });
});

describe('logout', () => {
  it('calls logout and works correctly', async () => {
    const redirectUri = 'postLogoutRedirectUri';
    logout.mockImplementation(() => Promise.resolve(redirectUri));
    const response = await makeRequest(REQUEST_TYPES.LOGOUT);
    expect(response).toBe(redirectUri);
  });

  it('calls logout and fails', async () => {
    const error = Error('error');
    logout.mockImplementation(() => Promise.reject(error));
    try {
      await makeRequest(REQUEST_TYPES.LOGOUT);
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
