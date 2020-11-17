import validateURIReference from '../../validateParameters/URIReference';
import { PARAMETERS } from '../../../utils/constants';
import ERRORS from '../../../utils/errors';

describe('security module validate URIReference parameters', () => {
  it('redirectUri: valid', () => {
    let redirectUri = 'sdkIdU.testing://auth';
    let validRedirectUri = validateURIReference(
      PARAMETERS.redirectUri,
      redirectUri,
    );
    expect(validRedirectUri).toBe(redirectUri);
    redirectUri = 'sdkIdU.testing%3A%2F%2Fauth';
    validRedirectUri = validateURIReference(
      PARAMETERS.redirectUri,
      redirectUri,
    );
    expect(validRedirectUri).toBe(redirectUri);
  });

  it('tokenType: valid', () => {
    let tokenType = 'bearer';
    let validTokenType = validateURIReference(PARAMETERS.tokenType, tokenType);
    expect(validTokenType).toBe(tokenType);
    tokenType = 'Bearer';
    validTokenType = validateURIReference(PARAMETERS.tokenType, tokenType);
    expect(validTokenType).toBe(tokenType);
    tokenType = 'Basic';
    validTokenType = validateURIReference(PARAMETERS.tokenType, tokenType);
    expect(validTokenType).toBe(tokenType);
    tokenType = 'Digest';
    validTokenType = validateURIReference(PARAMETERS.tokenType, tokenType);
    expect(validTokenType).toBe(tokenType);
    tokenType = 'OAuth';
    validTokenType = validateURIReference(PARAMETERS.tokenType, tokenType);
    expect(validTokenType).toBe(tokenType);
    tokenType = 'SCRAM-SHA-1';
    validTokenType = validateURIReference(PARAMETERS.tokenType, tokenType);
    expect(validTokenType).toBe(tokenType);
  });

  it('URIReference: empty', () => {
    const URIReference = '';
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    expect.assertions(2);
  });

  it('URIReference: null', () => {
    const URIReference = null;
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    expect.assertions(2);
  });

  it('URIReference: undefined', () => {
    const URIReference = undefined;
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    expect.assertions(2);
  });

  it('URIReference: not a string', () => {
    let URIReference = 89856;
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    URIReference = {};
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    URIReference = [];
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    expect.assertions(6);
  });

  it('URIReference: query parameters', () => {
    let URIReference =
      'sdkIdU.testing://auth?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toBe(ERRORS.INVALID_REDIRECT_URI);
    }
    URIReference =
      'bearer?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toBe(ERRORS.INVALID_TOKEN_TYPE);
    }
    expect.assertions(2);
  });

  it('URIReference: with special caracters (invalids)', () => {
    let URIReference = '\0';
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    URIReference = '\n';
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    URIReference = ' ';
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    URIReference = '^@';
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    URIReference = ',';
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    expect.assertions(10);
  });

  it('URIReference: with special caracters (valids)', () => {
    const URIReference = '.';
    const validURIReference = validateURIReference(
      PARAMETERS.redirectUri,
      URIReference,
    );
    expect(validURIReference).toBe(URIReference);
  });
});
