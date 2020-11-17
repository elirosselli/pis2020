import validateBOOLEAN from '../../validateParameters/BOOLEAN';
import { PARAMETERS } from '../../../utils/constants';
import ERRORS from '../../../utils/errors';

describe('security module validate BOOLEAN parameters', () => {
  it('production: valid', () => {
    let production = true;
    let validProduction = validateBOOLEAN(PARAMETERS.production, production);
    expect(validProduction).toBe(production);
    production = false;
    validProduction = validateBOOLEAN(PARAMETERS.production, production);
    expect(validProduction).toBe(production);
  });

  it('BOOLEAN: empty', () => {
    const BOOLEAN = '';
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    expect.assertions(1);
  });

  it('BOOLEAN: null', () => {
    const BOOLEAN = null;
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    expect.assertions(1);
  });

  it('BOOLEAN: undefined', () => {
    const BOOLEAN = undefined;
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    expect.assertions(1);
  });

  it('BOOLEAN: not a boolean', () => {
    let BOOLEAN = '89856';
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    BOOLEAN = {};
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    BOOLEAN = [];
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    BOOLEAN = 1214;
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    expect.assertions(4);
  });

  it('BOOLEAN: with special caracters (invalids)', () => {
    let BOOLEAN = '\0';
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    BOOLEAN = '\n';
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    BOOLEAN = ' ';
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    BOOLEAN = '12 34';
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    BOOLEAN = '^@';
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    BOOLEAN = '.';
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    BOOLEAN = ',';
    try {
      validateBOOLEAN(PARAMETERS.production, BOOLEAN);
    } catch (ErrorBOOLEAN) {
      expect(ErrorBOOLEAN).toStrictEqual(ERRORS.INVALID_PRODUCTION);
    }
    expect.assertions(7);
  });
});
