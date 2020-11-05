import makeRequest from '../index';
import { ERRORS, REQUEST_TYPES } from '../../utils/constants';
import login from '../login';
import logout from '../logout';
import getTokenOrRefresh from '../getTokenOrRefresh';
import getUserInfo from '../getUserInfo';
import validateToken from '../validateToken';

jest.mock('../login');
jest.mock('../logout');
jest.mock('../getTokenOrRefresh');
jest.mock('../getUserInfo');
jest.mock('../validateToken');
jest.mock('../../configuration');

afterEach(() => jest.clearAllMocks());
const getTokenOrRefreshMockImpl = () =>
  Promise.resolve({
    token: 'token',
    message: ERRORS.NO_ERROR,
    errorCode: ERRORS.NO_ERROR.errorCode,
    errorDescription: ERRORS.NO_ERROR.errorDescription,
    expiresIn: 3600,
    idToken: 'idToken',
    refreshToken: 'refreshToken',
    tokenType: 'tokenType',
  });

describe('login', () => {
  it('calls login and works correctly', async () => {
    const code = 'code';
    login.mockImplementation(() =>
      Promise.resolve({
        code,
        message: ERRORS.NO_ERROR,
        errorCode: ERRORS.NO_ERROR.errorCode,
        errorDescription: ERRORS.NO_ERROR.errorDescription,
      }),
    );
    const response = await makeRequest(REQUEST_TYPES.LOGIN);
    expect(response).toStrictEqual({
      code,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('calls login and fails', async () => {
    login.mockImplementation(() => Promise.reject(ERRORS.FAILED_REQUEST));
    try {
      await makeRequest(REQUEST_TYPES.LOGIN);
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });
});

describe('getToken', () => {
  it('calls getToken and works correctly', async () => {
    const token = 'token';
    const expiresIn = 3600;
    const idToken = 'idToken';
    const refreshToken = 'refreshToken';
    const tokenType = 'tokenType';
    getTokenOrRefresh.mockImplementation(getTokenOrRefreshMockImpl);
    const response = await makeRequest(REQUEST_TYPES.GET_TOKEN);
    expect(response).toStrictEqual({
      token,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      expiresIn,
      idToken,
      refreshToken,
      tokenType,
    });
  });

  it('calls getToken and fails', async () => {
    getTokenOrRefresh.mockImplementation(() =>
      Promise.reject(ERRORS.FAILED_REQUEST),
    );
    try {
      await makeRequest(REQUEST_TYPES.GET_TOKEN);
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });
});

describe('refreshToken', () => {
  it('calls refreshToken and works correctly', async () => {
    const token = 'token';
    const expiresIn = 3600;
    const idToken = 'idToken';
    const refreshToken = 'refreshToken';
    const tokenType = 'tokenType';
    getTokenOrRefresh.mockImplementation(getTokenOrRefreshMockImpl);
    const response = await makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
    expect(response).toStrictEqual({
      token,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      expiresIn,
      idToken,
      refreshToken,
      tokenType,
    });
  });

  it('calls refreshToken and fails', async () => {
    getTokenOrRefresh.mockImplementation(() =>
      Promise.reject(ERRORS.FAILED_REQUEST),
    );
    try {
      await makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });
});

describe('getUserInfo', () => {
  it('calls getUserInfo and works correctly', async () => {
    getUserInfo.mockImplementation(() =>
      Promise.resolve({
        message: ERRORS.NO_ERROR,
        errorCode: ERRORS.NO_ERROR.errorCode,
        errorDescription: ERRORS.NO_ERROR.errorDescription,
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
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
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
    getUserInfo.mockImplementation(() => Promise.reject(ERRORS.FAILED_REQUEST));

    try {
      await makeRequest(REQUEST_TYPES.GET_USER_INFO);
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });
});

describe('logout', () => {
  it('calls logout and works correctly', async () => {
    logout.mockImplementation(() =>
      Promise.resolve({
        message: ERRORS.NO_ERROR,
        errorCode: ERRORS.NO_ERROR.errorCode,
        errorDescription: ERRORS.NO_ERROR.errorDescription,
        state: 'state',
      }),
    );
    const response = await makeRequest(REQUEST_TYPES.LOGOUT);
    expect(response).toStrictEqual({
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      state: 'state',
    });
  });

  it('calls logout and fails', async () => {
    logout.mockImplementation(() => Promise.reject(ERRORS.FAILED_REQUEST));
    try {
      await makeRequest(REQUEST_TYPES.LOGOUT);
    } catch (err) {
      expect(err).toBe(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });
});

describe('validateToken', () => {
  it('calls validateToken with valid token', async () => {
    const result = {
      jwks: 'jwks',
      error: true,
    };
    validateToken.mockReturnValue(Promise.resolve(result));

    const response = await makeRequest(REQUEST_TYPES.VALIDATE_TOKEN);

    expect(response).toBe(result);
  });
  it('calls validateToken with invalid token', async () => {
    const result = {
      jwks: 'jwks',
      error: false,
    };
    validateToken.mockReturnValue(Promise.resolve(result));

    const response = await makeRequest(REQUEST_TYPES.VALIDATE_TOKEN);

    expect(response).toBe(result);
  });
});

describe('default', () => {
  it('calls default', async () => {
    const response = await makeRequest('default');
    expect(response).toBe('default value');
  });
});
