/* eslint-disable prefer-promise-reject-errors */
import { Platform } from 'react-native';
import { ERRORS } from '../../utils/constants';
import { fetch } from '../../utils/helpers';
import getUserInfo from '../getUserInfo';
import { getParameters } from '../../configuration';
import { validateSub } from '../../security';

jest.mock('../../configuration');

jest.mock('../../security', () => ({
  validateSub: jest.fn(() => true),
}));

jest.mock('../../utils/helpers', () => ({
  ...jest.requireActual('../../utils/helpers'),
  fetch: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

const idToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw';

describe('getUserInfo', () => {
  it('calls getUserInfo with correct accessToken', async () => {
    const userInfoEndpoint =
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/userinfo';
    const code = 'f24df0c4fcb142328b843d49753946af';
    const redirectUri = 'uri';
    const sub = '5968';
    const uid = 'uy-cid-12345678';
    getParameters.mockReturnValue({
      clientId: '898562',
      clientSecret: 'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b',
      accessToken: 'c9747e3173544b7b870d48aeafa0f661',
      redirectUri,
      code,
      idToken,
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            nombre_completo: 'test',
            primer_apellido: 'test',
            primer_nombre: 'testNombre',
            segundo_apellido: 'testApellido',
            segundo_nombre: 'testSegundoNombre',
            sub: '5968',
            uid,
          }),
      }),
    );
    const response = await getUserInfo();

    expect(fetch).toHaveBeenCalledWith(
      userInfoEndpoint,
      {
        method: 'GET',
        pkPinning: Platform.OS === 'ios',
        sslPinning: {
          certs: ['certificate'],
        },
        headers: {
          Authorization: `Bearer c9747e3173544b7b870d48aeafa0f661`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        },
      },
      5,
    );
    expect(validateSub).toHaveBeenCalledWith(sub);
    expect(response).toStrictEqual({
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      nombre_completo: 'test',
      primer_apellido: 'test',
      primer_nombre: 'testNombre',
      segundo_apellido: 'testApellido',
      segundo_nombre: 'testSegundoNombre',
      uid,
      sub,
    });
  });

  it('calls getUserInfo with incorrect access token', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      accessToken: 'incorrectAccessToken',
      idToken,
    });

    fetch.mockImplementation(() =>
      Promise.reject({
        headers: {
          'Www-Authenticate':
            'error="invalid_token", error_description="The access token provided is expired, revoked, malformed, or invalid for other reasons"',
        },
      }),
    );

    try {
      await getUserInfo();
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    expect.assertions(1);
  });

  it('calls getUserInfo and returns some error', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      accessToken: 'correctAccessToken',
      idToken,
    });

    fetch.mockImplementation(() =>
      Promise.reject({
        headers: {
          'some-error':
            'error="some_error", error_description="Error different from invalid access token"',
        },
      }),
    );

    try {
      await getUserInfo();
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.FAILED_REQUEST);
    }

    expect(validateSub).not.toHaveBeenCalled();

    expect.assertions(2);
  });

  it('calls getUserInfo but subs do not match', async () => {
    validateSub.mockImplementation(() => false);
    const code = 'f24df0c4fcb142328b843d49753946af';
    const redirectUri = 'uri';
    const sub = '5968';
    getParameters.mockReturnValue({
      clientId: '898562',
      clientSecret: 'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b',
      accessToken: 'c9747e3173544b7b870d48aeafa0f661',
      redirectUri,
      code,
      idToken,
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            nombre_completo: 'test',
            primer_apellido: 'test',
            primer_nombre: 'testNombre',
            segundo_apellido: 'testApellido',
            segundo_nombre: 'testSegundoNombre',
            sub,
            uid: 'uy-cid-12345678',
          }),
      }),
    );

    try {
      await getUserInfo();
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_SUB);
    }

    expect(validateSub).toHaveBeenCalledWith(sub);
    expect.assertions(2);
  });

  it('calls getUserInfo and returns some error with www authenticate header', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      accessToken: 'correctAccessToken',
      idToken,
    });

    fetch.mockImplementation(() =>
      Promise.reject({
        headers: {
          'Www-Authenticate':
            'error="other_error", error_description="The access token provided is expired, revoked, malformed, or invalid for other reasons"',
        },
      }),
    );

    try {
      await getUserInfo();
    } catch (err) {
      expect(err).toStrictEqual(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });

  it('calls getUserInfo with empty access Token', async () => {
    const code = 'code';
    const redirectUri = 'uri';
    getParameters.mockReturnValue({
      clientId: '898562',
      clientSecret: 'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b',
      accessToken: '',
      redirectUri,
      code,
    });

    try {
      await getUserInfo();
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_TOKEN);
    }
    expect.assertions(1);
  });
});

it('calls getUserInfo with empty Id Token', async () => {
  const code = 'f24df0c4fcb142328b843d49753946af';
  const redirectUri = 'uri';
  getParameters.mockReturnValue({
    clientId: '898562',
    clientSecret: 'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b',
    accessToken: 'correctAccessToken',
    redirectUri,
    code,
    idToken: '',
  });

  try {
    await getUserInfo();
  } catch (err) {
    expect(err).toBe(ERRORS.INVALID_ID_TOKEN);
  }
  expect.assertions(1);
});

it('calls getUserInfo and fetch fails', async () => {
  getParameters.mockReturnValue({
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    redirectUri: 'redirectUri',
    postLogoutRedirectUri: 'postLogoutRedirectUri',
    accessToken: 'accessToken',
    idToken,
  });

  fetch.mockImplementation(() =>
    Promise.resolve({
      status: 400,
      json: () => Promise.resolve(),
    }),
  );

  try {
    await getUserInfo();
  } catch (err) {
    expect(err).toStrictEqual(ERRORS.FAILED_REQUEST);
  }
  expect.assertions(1);
});
