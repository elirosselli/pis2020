/* eslint-disable prefer-promise-reject-errors */
import { Platform } from 'react-native';
import { fetch } from '../../utils/helpers';
import getUserInfo from '../getUserInfo';
import { getParameters } from '../../configuration';
import { ERRORS } from '../../utils/constants';

jest.mock('../../configuration');

jest.unmock('../../utils/helpers');

const myModule = require('../../utils/helpers');

myModule.fetch = jest.fn();

describe('getUserInfo', () => {
  it('calls getUserInfo with correct accessToken', async () => {
    const userInfoEndpoint =
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/userinfo';
    const code = 'f24df0c4fcb142328b843d49753946af';
    const redirectUri = 'uri';
    getParameters.mockReturnValue({
      clientId: '898562',
      clientSecret: 'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b',
      accessToken: 'c9747e3173544b7b870d48aeafa0f661',
      redirectUri,
      code,
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
            uid: 'uy-cid-12345678',
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
    expect(response).toStrictEqual({
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

  it('calls getUserInfo with incorrect access token', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      accessToken: 'incorrectAccessToken',
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
    expect.assertions(1);
  });

  it('calls getUserInfo and returns some error with www authenticate header', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      accessToken: 'correctAccessToken',
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
    const code = 'jeje';
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

it('calls getUserInfo and fetch fails', async () => {
  getParameters.mockReturnValue({
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    redirectUri: 'redirectUri',
    postLogoutRedirectUri: 'postLogoutRedirectUri',
    accessToken: 'accessToken',
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
