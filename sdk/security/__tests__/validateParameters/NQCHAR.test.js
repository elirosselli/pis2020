import validateNQCHAR from '../../validateParameters/NQCHAR';
import { PARAMETERS, ERRORS } from '../../../utils/constants';

describe('security module validate NQCHAR parameters', () => {
  it('scope: valid', () => {
    let scope = 'personal_info';
    let validScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(validScope).toBe(scope);
    scope = 'profile';
    validScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(validScope).toBe(scope);
    scope = 'document';
    validScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(validScope).toBe(scope);
    scope = 'email';
    validScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(validScope).toBe(scope);
    scope = 'auth_info';
    validScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(validScope).toBe(scope);
    scope = 'profile document email';
    validScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(validScope).toBe('profile%20document%20email');
    scope = 'profile%20document%20email';
    validScope = validateNQCHAR(PARAMETERS.scope, scope);
    expect(validScope).toBe(scope);
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
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toBe(ERRORS.INVALID_SCOPE);
    }
    expect.assertions(1);
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
    NQCHAR = '^@';
    try {
      validateNQCHAR(PARAMETERS.scope, NQCHAR);
    } catch (ErrorNQCHAR) {
      expect(ErrorNQCHAR).toStrictEqual(ERRORS.INVALID_SCOPE);
    }
    expect.assertions(3);
  });

  it('NQCHAR: with special caracters (valids)', () => {
    let NQCHAR = ' ';
    let validNQCHAR = validateNQCHAR(PARAMETERS.scope, NQCHAR);
    expect(validNQCHAR).toBe('%20');
    NQCHAR = '.';
    validNQCHAR = validateNQCHAR(PARAMETERS.scope, NQCHAR);
    expect(validNQCHAR).toBe(NQCHAR);
    NQCHAR = ',';
    validNQCHAR = validateNQCHAR(PARAMETERS.scope, NQCHAR);
    expect(validNQCHAR).toBe(NQCHAR);
  });
});
