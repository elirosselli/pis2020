import validateNQCHAR from '../../validateParameters/NQCHAR';
import { PARAMETERS, ERRORS } from '../../../utils/constants';

describe('security module validate NQCHAR parameters', () => {
  it('scope: valid', () => {
    let scope = 'personal_info';
    let sanitaizedScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(sanitaizedScope).toBe(scope);
    scope = 'profile';
    sanitaizedScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(sanitaizedScope).toBe(scope);
    scope = 'document';
    sanitaizedScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(sanitaizedScope).toBe(scope);
    scope = 'email';
    sanitaizedScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(sanitaizedScope).toBe(scope);
    scope = 'auth_info';
    sanitaizedScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(sanitaizedScope).toBe(scope);
  });

  it('NQCHAR: empty', () => {
    const NQCHAR = '';
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
    expect.assertions(1);
  });

  it('NQCHAR: null', () => {
    const NQCHAR = null;
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
    expect.assertions(1);
  });

  it('NQCHAR: undefined', () => {
    const NQCHAR = undefined;
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
    expect.assertions(1);
  });

  it('NQCHAR: not a string', () => {
    let NQCHAR = 89856;
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
    NQCHAR = {};
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
    NQCHAR = [];
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
    expect.assertions(3);
  });

  it('NQCHAR: query parameters', () => {
    const NQCHAR =
      'personal_info?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    const sanitaizedNQCHAR = validateNQCHAR(PARAMETERS.scope, NQCHAR);
    expect(sanitaizedNQCHAR).toBe(
      'personal_info?=1&=2&=3&=4&=5&=6&=7&=8&=9&=10&=11&=12&=13&=14&=15&=16&=17&=18',
    );
  });

  it('NQCHAR: with special caracters (invalids)', () => {
    let NQCHAR = '\0';
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
    NQCHAR = '\n';
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
    NQCHAR = ' ';
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
    NQCHAR = '^@';
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
    expect.assertions(4);
  });

  it('NQCHAR: with special caracters (valids)', () => {
    let NQCHAR = '12 34';
    let sanitaizedNQCHAR = validateNQCHAR(PARAMETERS.scope, NQCHAR);
    expect(sanitaizedNQCHAR).toBe('1234');
    NQCHAR = '.';
    sanitaizedNQCHAR = validateNQCHAR(PARAMETERS.scope, NQCHAR);
    expect(sanitaizedNQCHAR).toBe(NQCHAR);
    NQCHAR = ',';
    sanitaizedNQCHAR = validateNQCHAR(PARAMETERS.scope, NQCHAR);
    expect(sanitaizedNQCHAR).toBe(NQCHAR);
  });
});
