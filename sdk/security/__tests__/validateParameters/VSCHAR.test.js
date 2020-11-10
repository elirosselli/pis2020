/* eslint-disable sonarjs/cognitive-complexity */
import validateVSCHAR from '../../validateParameters/VSCHAR';
import { PARAMETERS, ERRORS } from '../../../utils/constants';

describe('security module validate VSCHAR parameters', () => {
  it('clientId: valid', () => {
    const clientId = '898562';
    const sanitaizedClientId = validateVSCHAR(PARAMETERS.clientId, clientId);
    expect(sanitaizedClientId).toBe(clientId);
  });

  it('clientSecret: valid', () => {
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const sanitaizedClientSecret = validateVSCHAR(
      PARAMETERS.clientSecret,
      clientSecret,
    );
    expect(sanitaizedClientSecret).toBe(clientSecret);
  });

  it('code: valid', () => {
    const code = '35773ab93b5b4658b81061ce3969efc2';
    const sanitaizedCode = validateVSCHAR(PARAMETERS.code, code);
    expect(sanitaizedCode).toBe(code);
  });

  it('accessToken: valid', () => {
    const accessToken = 'c9747e3173544b7b870d48aeafa0f661';
    const sanitaizedAccessToken = validateVSCHAR(
      PARAMETERS.accessToken,
      accessToken,
    );
    expect(sanitaizedAccessToken).toBe(accessToken);
  });

  it('refreshToken: valid', () => {
    const refreshToken = '041a156232ac43c6b719c57b7217c9ee';
    const sanitaizedRefreshToken = validateVSCHAR(
      PARAMETERS.refreshToken,
      refreshToken,
    );
    expect(sanitaizedRefreshToken).toBe(refreshToken);
  });

  it('state: valid', () => {
    const state = '0cf37136-efbb-44d0-993f-fb1e8b928e47';
    const sanitaizedState = validateVSCHAR(PARAMETERS.state, state);
    expect(sanitaizedState).toBe(state);
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
    try {
      validateVSCHAR(PARAMETERS.state, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_STATE);
    }
    expect.assertions(6);
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
    try {
      validateVSCHAR(PARAMETERS.state, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_STATE);
    }
    expect.assertions(6);
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
    try {
      validateVSCHAR(PARAMETERS.state, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_STATE);
    }
    expect.assertions(6);
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
    try {
      validateVSCHAR(PARAMETERS.state, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_STATE);
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
    try {
      validateVSCHAR(PARAMETERS.state, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_STATE);
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
    try {
      validateVSCHAR(PARAMETERS.state, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_STATE);
    }
    expect.assertions(18);
  });

  it('VSCHAR: query parameters', () => {
    let VSCHAR =
      '89856?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    let sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    expect(sanitaizedVSCHAR).toBe(
      '89856?=1&=2&=3&=4&=5&=6&=7&=8&=9&=10&=11&=12&=13&=14&=15&=16&=17&=18',
    );
    VSCHAR =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    expect(sanitaizedVSCHAR).toBe(
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b?=1&=2&=3&=4&=5&=6&=7&=8&=9&=10&=11&=12&=13&=14&=15&=16&=17&=18',
    );
    VSCHAR =
      '35773ab93b5b4658b81061ce3969efc2?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.code, VSCHAR);
    expect(sanitaizedVSCHAR).toBe(
      '35773ab93b5b4658b81061ce3969efc2?=1&=2&=3&=4&=5&=6&=7&=8&=9&=10&=11&=12&=13&=14&=15&=16&=17&=18',
    );
    VSCHAR =
      'c9747e3173544b7b870d48aeafa0f661?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    expect(sanitaizedVSCHAR).toBe(
      'c9747e3173544b7b870d48aeafa0f661?=1&=2&=3&=4&=5&=6&=7&=8&=9&=10&=11&=12&=13&=14&=15&=16&=17&=18',
    );
    VSCHAR =
      '041a156232ac43c6b719c57b7217c9ee?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    expect(sanitaizedVSCHAR).toBe(
      '041a156232ac43c6b719c57b7217c9ee?=1&=2&=3&=4&=5&=6&=7&=8&=9&=10&=11&=12&=13&=14&=15&=16&=17&=18',
    );
    VSCHAR =
      '0cf37136-efbb-44d0-993f-fb1e8b928e47?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.state, VSCHAR);
    expect(sanitaizedVSCHAR).toBe(
      '0cf37136-efbb-44d0-993f-fb1e8b928e47?=1&=2&=3&=4&=5&=6&=7&=8&=9&=10&=11&=12&=13&=14&=15&=16&=17&=18',
    );
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
    try {
      validateVSCHAR(PARAMETERS.state, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_STATE);
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
    try {
      validateVSCHAR(PARAMETERS.state, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_STATE);
    }
    VSCHAR = ' ';
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
    try {
      validateVSCHAR(PARAMETERS.state, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_STATE);
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
    try {
      validateVSCHAR(PARAMETERS.state, VSCHAR);
    } catch (ErrorVSCHAR) {
      expect(ErrorVSCHAR).toStrictEqual(ERRORS.INVALID_STATE);
    }
    expect.assertions(24);
  });

  it('VSCHAR: with special caracters (valids)', () => {
    let VSCHAR = '12 34';
    let sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual('12 34');
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual('12 34');
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.code, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual('12 34');
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual('12 34');
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual('12 34');
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.state, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual('12 34');
    VSCHAR = '.';
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.code, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.state, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
    VSCHAR = ',';
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.clientId, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.clientSecret, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.code, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.accessToken, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.refreshToken, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
    sanitaizedVSCHAR = validateVSCHAR(PARAMETERS.state, VSCHAR);
    expect(sanitaizedVSCHAR).toStrictEqual(VSCHAR);
  });
});
