import { getParameters, resetParameters } from '../../configuration';
import { initialize } from '../../interfaces';
import { ERRORS } from '../../utils/constants';

afterEach(() => jest.clearAllMocks());

beforeEach(() => {
  resetParameters();
});

describe('configuration module and initialize integration', () => {
  it('calls initialize with correct parameters (no scope)', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';

    const response = initialize(
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      false,
    );

    expect(response).toStrictEqual({
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });

    expect(getParameters()).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
  });

  it('calls initialize with correct parameters (with scope)', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    const scope = 'scope';

    const response = initialize(
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      false,
      scope,
    );

    expect(response).toStrictEqual({
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });

    expect(getParameters()).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope,
    });
  });

  it('calls initialize with empty clientId', async () => {
    const redirectUri = 'redirectUri';
    const clientId = '';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';

    const response = initialize(
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      false,
    );

    expect(response).toStrictEqual(ERRORS.INVALID_CLIENT_ID);

    // Los parámetros no se deberían setear.
    expect(getParameters()).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      postLogoutRedirectUri: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
  });

  it('calls initialize with empty clientSecret', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = '';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';

    const response = initialize(
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      false,
    );

    expect(response).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);

    // Los parámetros no se deberían setear.
    expect(getParameters()).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      postLogoutRedirectUri: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
  });

  it('calls initialize with empty redirectUri', async () => {
    const redirectUri = '';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';

    const response = initialize(
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      false,
    );

    expect(response).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);

    // Los parámetros no se deberían setear.
    expect(getParameters()).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      postLogoutRedirectUri: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
  });

  it('calls initialize with empty postLogoutRedirectUri', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const postLogoutRedirectUri = '';

    const response = initialize(
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      false,
    );

    expect(response).toStrictEqual(ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI);

    // Los parámetros no se deberían setear.
    expect(getParameters()).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      postLogoutRedirectUri: '',
      production: false,
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
    });
  });
});
