import { initialize, getParameters, resetParameters } from '../../interfaces';
import ERRORS from '../../utils/errors';

afterEach(() => jest.clearAllMocks());

beforeEach(() => {
  resetParameters();
});

describe('configuration module and initialize integration', () => {
  it('calls initialize with correct parameters (no scope)', async () => {
    const redirectUri = 'redirectUri';
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';

    const response = initialize(redirectUri, clientId, clientSecret, false);

    expect(response).toStrictEqual({
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });

    expect(getParameters()).toStrictEqual({
      redirectUri,
      clientId,
      clientSecret,
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
    const scope = 'correctScope';

    const response = initialize(
      redirectUri,
      clientId,
      clientSecret,
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

    try {
      initialize(redirectUri, clientId, clientSecret, false);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }

    // Los parámetros no se deberían setear.
    expect(getParameters()).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
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

    try {
      initialize(redirectUri, clientId, clientSecret, false);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_SECRET);
    }

    // Los parámetros no se deberían setear.
    expect(getParameters()).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
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

    try {
      initialize(redirectUri, clientId, clientSecret, false);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_REDIRECT_URI);
    }

    // Los parámetros no se deberían setear.
    expect(getParameters()).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
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
    expect.assertions(2);
  });
});
