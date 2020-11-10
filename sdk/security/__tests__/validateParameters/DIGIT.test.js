import validateDIGIT from '../../validateParameters/DIGIT';
import { PARAMETERS, ERRORS } from '../../../utils/constants';

describe('security module validate DIGIT parameters', () => {
  it('expiresIn: valid', () => {
    let expiresIn = 132531;
    let sanitaizedExpiresIn = validateDIGIT(PARAMETERS.expiresIn, expiresIn);
    expect(sanitaizedExpiresIn).toBe(expiresIn);
    expiresIn = 123;
    sanitaizedExpiresIn = validateDIGIT(PARAMETERS.expiresIn, expiresIn);
    expect(sanitaizedExpiresIn).toBe(expiresIn);
    expiresIn = 5124;
    sanitaizedExpiresIn = validateDIGIT(PARAMETERS.expiresIn, expiresIn);
    expect(sanitaizedExpiresIn).toBe(expiresIn);
  });

  it('DIGIT: empty', () => {
    const DIGIT = '';
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    expect.assertions(1);
  });

  it('DIGIT: null', () => {
    const DIGIT = null;
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    expect.assertions(1);
  });

  it('DIGIT: undefined', () => {
    const DIGIT = undefined;
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    expect.assertions(1);
  });

  it('DIGIT: not a number', () => {
    let DIGIT = '89856';
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    DIGIT = {};
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    DIGIT = [];
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    expect.assertions(3);
  });

  it('DIGIT: to big', () => {
    const DIGIT = 31536000123;
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    expect.assertions(1);
  });

  it('DIGIT: with special caracters (invalids)', () => {
    let DIGIT = '\0';
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    DIGIT = '\n';
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    DIGIT = ' ';
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    DIGIT = '12 34';
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    DIGIT = '^@';
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    DIGIT = '.';
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    DIGIT = ',';
    try {
      validateDIGIT(PARAMETERS.expiresIn, DIGIT);
    } catch (ErrorDIGIT) {
      expect(ErrorDIGIT).toStrictEqual(ERRORS.INVALID_EXPIRES_IN);
    }
    expect.assertions(7);
  });
});
