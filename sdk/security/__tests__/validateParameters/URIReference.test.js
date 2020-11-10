import validateURIReference from '../../validateParameters/URIReference';
import { PARAMETERS, ERRORS } from '../../../utils/constants';

describe('security module validate URIReference parameters', () => {
  it('redirectUri: valid', () => {
    let redirectUri = 'sdkIdU.testing://auth';
    let sanitaizedRedirectUri = validateURIReference(
      PARAMETERS.redirectUri,
      redirectUri,
    );
    expect(sanitaizedRedirectUri).toBe(redirectUri);
    redirectUri = 'sdkIdU.testing%3A%2F%2Fauth';
    sanitaizedRedirectUri = validateURIReference(
      PARAMETERS.redirectUri,
      redirectUri,
    );
    expect(sanitaizedRedirectUri).toBe(redirectUri);
  });

  it('postLogoutRedirectUri: valid', () => {
    let postLogoutRedirectUri = 'sdkIdU.testing://logout';
    let sanitaizedPostLogoutRedirectUri = validateURIReference(
      PARAMETERS.postLogoutRedirectUri,
      postLogoutRedirectUri,
    );
    expect(sanitaizedPostLogoutRedirectUri).toBe(postLogoutRedirectUri);
    postLogoutRedirectUri = 'sdkIdU.testing%3A%2F%2Flogout';
    sanitaizedPostLogoutRedirectUri = validateURIReference(
      PARAMETERS.postLogoutRedirectUri,
      postLogoutRedirectUri,
    );
    expect(sanitaizedPostLogoutRedirectUri).toBe(postLogoutRedirectUri);
  });

  it('tokenType: valid', () => {
    let tokenType = 'bearer';
    let sanitaizedTokenType = validateURIReference(
      PARAMETERS.tokenType,
      tokenType,
    );
    expect(sanitaizedTokenType).toBe(tokenType);
    tokenType = 'Bearer';
    sanitaizedTokenType = validateURIReference(PARAMETERS.tokenType, tokenType);
    expect(sanitaizedTokenType).toBe(tokenType);
    tokenType = 'Basic';
    sanitaizedTokenType = validateURIReference(PARAMETERS.tokenType, tokenType);
    expect(sanitaizedTokenType).toBe(tokenType);
    tokenType = 'Digest';
    sanitaizedTokenType = validateURIReference(PARAMETERS.tokenType, tokenType);
    expect(sanitaizedTokenType).toBe(tokenType);
    tokenType = 'OAuth';
    sanitaizedTokenType = validateURIReference(PARAMETERS.tokenType, tokenType);
    expect(sanitaizedTokenType).toBe(tokenType);
    tokenType = 'SCRAM-SHA-1';
    sanitaizedTokenType = validateURIReference(PARAMETERS.tokenType, tokenType);
    expect(sanitaizedTokenType).toBe(tokenType);
  });

  it('URIReference: empty', () => {
    const URIReference = '';
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.postLogoutRedirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    expect.assertions(3);
  });

  it('URIReference: null', () => {
    const URIReference = null;
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.postLogoutRedirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    expect.assertions(3);
  });

  it('URIReference: undefined', () => {
    const URIReference = undefined;
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.postLogoutRedirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    expect.assertions(3);
  });

  it('URIReference: not a string', () => {
    let URIReference = 89856;
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.postLogoutRedirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
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
      validateURIReference(PARAMETERS.postLogoutRedirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
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
      validateURIReference(PARAMETERS.postLogoutRedirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    expect.assertions(9);
  });

  it('URIReference: query parameters', () => {
    let URIReference =
      'sdkIdU.testing://auth?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    let sanitaizedURIReference = validateURIReference(
      PARAMETERS.redirectUri,
      URIReference,
    );
    expect(sanitaizedURIReference).toBe(
      'sdkIdU.testing://auth?=1&=2&=3&=4&=5&=6&=7&=8&=9&=10&=11&=12&=13&=14&=15&=16&=17&=18',
    );
    URIReference =
      'sdkIdU.testing://logout?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    sanitaizedURIReference = validateURIReference(
      PARAMETERS.postLogoutRedirectUri,
      URIReference,
    );
    expect(sanitaizedURIReference).toBe(
      'sdkIdU.testing://logout?=1&=2&=3&=4&=5&=6&=7&=8&=9&=10&=11&=12&=13&=14&=15&=16&=17&=18',
    );
    URIReference =
      'bearer?redirect_uri=1&client_id=2&client_secret=3&code=4&access_token=5&refresh_token=6&token_type=7&expires_in=8&id_token=9&post_logot_redirect_uri=10&state=11&scope=12&response_type=13&nonce=14&prompt=15&acr_values=16&grant_type=17&id_token_hint=18';
    sanitaizedURIReference = validateURIReference(
      PARAMETERS.tokenType,
      URIReference,
    );
    expect(sanitaizedURIReference).toBe(
      'bearer?=1&=2&=3&=4&=5&=6&=7&=8&=9&=10&=11&=12&=13&=14&=15&=16&=17&=18',
    );
  });

  it('URIReference: with special caracters (invalids)', () => {
    let URIReference = '\0';
    try {
      validateURIReference(PARAMETERS.redirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_REDIRECT_URI);
    }
    try {
      validateURIReference(PARAMETERS.postLogoutRedirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
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
      validateURIReference(PARAMETERS.postLogoutRedirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
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
      validateURIReference(PARAMETERS.postLogoutRedirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
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
      validateURIReference(PARAMETERS.postLogoutRedirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
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
      validateURIReference(PARAMETERS.postLogoutRedirectUri, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(
        ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
      );
    }
    try {
      validateURIReference(PARAMETERS.tokenType, URIReference);
    } catch (ErrorURIReference) {
      expect(ErrorURIReference).toStrictEqual(ERRORS.INVALID_TOKEN_TYPE);
    }
    expect.assertions(15);
  });

  it('URIReference: with special caracters (valids)', () => {
    let URIReference = '12 34';
    let sanitaizedURIReference = validateURIReference(
      PARAMETERS.redirectUri,
      URIReference,
    );
    expect(sanitaizedURIReference).toBe('1234');
    sanitaizedURIReference = validateURIReference(
      PARAMETERS.postLogoutRedirectUri,
      URIReference,
    );
    expect(sanitaizedURIReference).toBe('1234');
    sanitaizedURIReference = validateURIReference(
      PARAMETERS.tokenType,
      URIReference,
    );
    expect(sanitaizedURIReference).toBe('1234');
    URIReference = '.';
    sanitaizedURIReference = validateURIReference(
      PARAMETERS.redirectUri,
      URIReference,
    );
    expect(sanitaizedURIReference).toBe(URIReference);
    sanitaizedURIReference = validateURIReference(
      PARAMETERS.postLogoutRedirectUri,
      URIReference,
    );
    expect(sanitaizedURIReference).toBe(URIReference);
    sanitaizedURIReference = validateURIReference(
      PARAMETERS.tokenType,
      URIReference,
    );
    expect(sanitaizedURIReference).toBe(URIReference);
  });
});
