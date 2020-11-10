import validateParameters from '../../validateParameters';
import { PARAMETERS, ERRORS } from '../../../utils/constants';

describe('security module', () => {
  it('clientId: valid', () => {
    const clientId = '898562';
    const sanitaizedClientId = validateParameters(
      PARAMETERS.clientId,
      clientId,
    );
    expect(sanitaizedClientId).toBe(clientId);
  });

  it('clientId: invalid', () => {
    const clientId = '';
    try {
      validateParameters(PARAMETERS.clientId, clientId);
    } catch (ErrorClientId) {
      expect(ErrorClientId).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
  });

  it('clientSecret: valid', () => {
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const sanitaizedClientSecret = validateParameters(
      PARAMETERS.clientSecret,
      clientSecret,
    );
    expect(sanitaizedClientSecret).toBe(clientSecret);
  });

  it('clientSecret: invalid', () => {
    const clientSecret = '';
    try {
      validateParameters(PARAMETERS.clientSecret, clientSecret);
    } catch (ErrorClientSecret) {
      expect(ErrorClientSecret).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
  });

  it('code: valid', () => {
    const code = '35773ab93b5b4658b81061ce3969efc2';
    const sanitaizedCode = validateParameters(PARAMETERS.code, code);
    expect(sanitaizedCode).toBe(code);
  });

  it('code: invalid', () => {
    const code = '';
    try {
      validateParameters(PARAMETERS.code, code);
    } catch (ErrorCode) {
      expect(ErrorCode).toStrictEqual(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
  });

  it('accessToken: valid', () => {
    const accessToken = 'c9747e3173544b7b870d48aeafa0f661';
    const sanitaizedAccessToken = validateParameters(
      PARAMETERS.accessToken,
      accessToken,
    );
    expect(sanitaizedAccessToken).toBe(accessToken);
  });

  it('accessToken: invalid', () => {
    const accessToken = '';
    try {
      validateParameters(PARAMETERS.accessToken, accessToken);
    } catch (ErrorAccessToken) {
      expect(ErrorAccessToken).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
  });

  it('refreshToken: valid', () => {
    const refreshToken = '041a156232ac43c6b719c57b7217c9ee';
    const sanitaizedRefreshToken = validateParameters(
      PARAMETERS.refreshToken,
      refreshToken,
    );
    expect(sanitaizedRefreshToken).toBe(refreshToken);
  });

  it('refreshToken: invalid', () => {
    const refreshToken = '';
    try {
      validateParameters(PARAMETERS.refreshToken, refreshToken);
    } catch (ErrorRefreshToken) {
      expect(ErrorRefreshToken).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
  });

  it('state: valid', () => {
    const state = '0cf37136-efbb-44d0-993f-fb1e8b928e47';
    const sanitaizedState = validateParameters(PARAMETERS.state, state);
    expect(sanitaizedState).toBe(state);
  });

  it('state: invalid', () => {
    const state = '';
    try {
      validateParameters(PARAMETERS.state, state);
    } catch (ErrorState) {
      expect(ErrorState).toStrictEqual(ERRORS.INVALID_STATE);
    }
  });

  it('redirectUri: valid', () => {
    const redirectUri = 'sdkIdU.testing://auth';
    const sanitaizedRedirectUri = validateParameters(
      PARAMETERS.redirectUri,
      redirectUri,
    );
    expect(sanitaizedRedirectUri).toBe(redirectUri);
  });

  it('redirectUri: invalid', () => {
    const redirectUri = '';
    try {
      validateParameters(PARAMETERS.redirectUri, redirectUri);
    } catch (ErrorRedirectUri) {
      expect(ErrorRedirectUri).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
  });

  it('postLogoutRedirectUri: valid', () => {
    const postLogoutRedirectUri = 'sdkIdU.testing://logout';
    const sanitaizedPostLogoutRedirectUri = validateParameters(
      PARAMETERS.postLogoutRedirectUri,
      postLogoutRedirectUri,
    );
    expect(sanitaizedPostLogoutRedirectUri).toBe(postLogoutRedirectUri);
  });

  it('postLogoutRedirectUri: invalid', () => {
    const postLogoutRedirectUri = '';
    try {
      validateParameters(
        PARAMETERS.postLogoutRedirectUri,
        postLogoutRedirectUri,
      );
    } catch (ErrorPostLogoutRedirectUri) {
      expect(ErrorPostLogoutRedirectUri).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
    }
  });

  it('tokenType: valid', () => {
    const tokenType = 'bearer';
    const sanitaizedTokenType = validateParameters(
      PARAMETERS.tokenType,
      tokenType,
    );
    expect(sanitaizedTokenType).toBe(tokenType);
  });

  it('tokenType: invalid', () => {
    const tokenType = '';
    try {
      validateParameters(PARAMETERS.tokenType, tokenType);
    } catch (ErrorTokenType) {
      expect(ErrorTokenType).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
  });

  it('scope: valid', () => {
    const scope = 'personal_info';
    const sanitaizedScope = validateParameters(PARAMETERS.scope, scope);
    expect(sanitaizedScope).toBe(scope);
  });

  it('scope: invalid', () => {
    const scope = '';
    try {
      validateParameters(PARAMETERS.scope, scope);
    } catch (ErrorScope) {
      expect(ErrorScope).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
  });

  it('expiresIn: valid', () => {
    const expiresIn = 132531;
    const sanitaizedExpiresIn = validateParameters(
      PARAMETERS.expiresIn,
      expiresIn,
    );
    expect(sanitaizedExpiresIn).toBe(expiresIn);
  });

  it('expiresIn: invalid', () => {
    const expiresIn = '';
    try {
      validateParameters(PARAMETERS.expiresIn, expiresIn);
    } catch (ErrorExpiresIn) {
      expect(ErrorExpiresIn).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
  });

  it('idToken: valid', () => {
    const idToken =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw';
    const sanitaizedIdToken = validateParameters(PARAMETERS.idToken, idToken);
    expect(sanitaizedIdToken).toBe(idToken);
  });

  it('calles validateParameters with wrong type: invalid', () => {
    try {
      validateParameters('wrong type', 'value');
    } catch (error) {
      expect(error).toStrictEqual(Error('Invalid parameter type'));
    }
  });
});
