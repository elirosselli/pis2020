/* eslint-disable sonarjs/cognitive-complexity */
import validateVSCHAR from '../../validateParameters/VSCHAR';
import { PARAMETERS } from '../../../utils/constants';
import ERRORS from '../../../utils/errors';

describe('security module validate VSCHAR parameters', () => {
  it('clientId: valid', () => {
    const clientId = '898562';
    const validClientId = validateVSCHAR(PARAMETERS.clientId, clientId);
    expect(validClientId).toBe(clientId);
  });

  it('clientSecret: valid', () => {
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const validClientSecret = validateVSCHAR(
      PARAMETERS.clientSecret,
      clientSecret,
    );
    expect(validClientSecret).toBe(clientSecret);
  });

  it('code: valid', () => {
    const code = '35773ab93b5b4658b81061ce3969efc2';
    const validCode = validateVSCHAR(PARAMETERS.code, code);
    expect(validCode).toBe(code);
  });

  it('accessToken: valid', () => {
    const accessToken = 'c9747e3173544b7b870d48aeafa0f661';
    const validAccessToken = validateVSCHAR(
      PARAMETERS.accessToken,
      accessToken,
    );
    expect(validAccessToken).toBe(accessToken);
  });

  it('refreshToken: valid', () => {
    const refreshToken = '041a156232ac43c6b719c57b7217c9ee';
    const validRefreshToken = validateVSCHAR(
      PARAMETERS.refreshToken,
      refreshToken,
    );
    expect(validRefreshToken).toBe(refreshToken);
  });

  it('idToken: valid', () => {
    const idToken =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw';
    const validIdToken = validateVSCHAR(PARAMETERS.idToken, idToken);
    expect(validIdToken).toBe(idToken);
  });

  it('VSCHAR: empty', () => {
    const VSCHAR = '';
    try {
      validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    try {
      validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
    try {
      validateVSCHAR(PARAMETERS.code, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    try {
      validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    try {
      validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    expect.assertions(5);
  });

  it('VSCHAR: null', () => {
    const VSCHAR = null;
    try {
      validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    try {
      validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
    try {
      validateVSCHAR(PARAMETERS.code, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    try {
      validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    try {
      validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    expect.assertions(5);
  });

  it('VSCHAR: undefined', () => {
    const VSCHAR = undefined;
    try {
      validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    try {
      validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
    try {
      validateVSCHAR(PARAMETERS.code, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    try {
      validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    try {
      validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    expect.assertions(5);
  });

  it('VSCHAR: not a string', () => {
    let VSCHAR = 89856;
    try {
      validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    try {
      validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
    try {
      validateVSCHAR(PARAMETERS.code, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    try {
      validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    try {
      validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    VSCHAR = {};
    try {
      validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    try {
      validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
    try {
      validateVSCHAR(PARAMETERS.code, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    try {
      validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    try {
      validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    VSCHAR = [];
    try {
      validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    try {
      validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
    try {
      validateVSCHAR(PARAMETERS.code, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    try {
      validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    try {
      validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    expect.assertions(15);
  });

  it('VSCHAR: query parameters', () => {
    let VSCHAR =
      '89856?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    try {
      validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toBe(ERRORS.INVALID_CLIENT_ID);
    }
    VSCHAR =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    try {
      validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toBe(ERRORS.INVALID_CLIENT_SECRET);
    }
    VSCHAR =
      '35773ab93b5b4658b81061ce3969efc2?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    try {
      validateVSCHAR(PARAMETERS.code, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toBe(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    VSCHAR =
      'c9747e3173544b7b870d48aeafa0f661?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    try {
      validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toBe(ERRORS.INVALID_TOKEN);
    }
    VSCHAR =
      '041a156232ac43c6b719c57b7217c9ee?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    try {
      validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toBe(ERRORS.INVALID_TOKEN);
    }
    expect.assertions(5);
  });

  it('VSCHAR: with special caracters (invalids)', () => {
    let VSCHAR = '\0';
    try {
      validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    try {
      validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
    try {
      validateVSCHAR(PARAMETERS.code, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    try {
      validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    try {
      validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    VSCHAR = '\n';
    try {
      validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    try {
      validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
    try {
      validateVSCHAR(PARAMETERS.code, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    try {
      validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    try {
      validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    VSCHAR = '^@';
    try {
      validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    try {
      validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_CLIENT_SECRET);
    }
    try {
      validateVSCHAR(PARAMETERS.code, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    try {
      validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    try {
      validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_TOKEN);
    }
    expect.assertions(15);
  });

  it('VSCHAR: with special caracters (valids)', () => {
    let VSCHAR = '12 34';
    let validVSCHAR = validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    expect(validVSCHAR).toStrictEqual('12 34');
    validVSCHAR = validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    expect(validVSCHAR).toStrictEqual('12 34');
    validVSCHAR = validateVSCHAR(PARAMETERS.code, VSCHAR);
    expect(validVSCHAR).toStrictEqual('12 34');
    validVSCHAR = validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    expect(validVSCHAR).toStrictEqual('12 34');
    validVSCHAR = validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    expect(validVSCHAR).toStrictEqual('12 34');
    VSCHAR = '.';
    validVSCHAR = validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    expect(validVSCHAR).toStrictEqual(VSCHAR);
    validVSCHAR = validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    expect(validVSCHAR).toStrictEqual(VSCHAR);
    validVSCHAR = validateVSCHAR(PARAMETERS.code, VSCHAR);
    expect(validVSCHAR).toStrictEqual(VSCHAR);
    validVSCHAR = validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    expect(validVSCHAR).toStrictEqual(VSCHAR);
    validVSCHAR = validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    expect(validVSCHAR).toStrictEqual(VSCHAR);
    VSCHAR = ',';
    validVSCHAR = validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    expect(validVSCHAR).toStrictEqual(VSCHAR);
    validVSCHAR = validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    expect(validVSCHAR).toStrictEqual(VSCHAR);
    validVSCHAR = validateVSCHAR(PARAMETERS.code, VSCHAR);
    expect(validVSCHAR).toStrictEqual(VSCHAR);
    validVSCHAR = validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    expect(validVSCHAR).toStrictEqual(VSCHAR);
    validVSCHAR = validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    expect(validVSCHAR).toStrictEqual(VSCHAR);
  });
});
