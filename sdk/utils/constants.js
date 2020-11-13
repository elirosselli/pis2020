/* eslint-disable max-classes-per-file */
const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
  GET_REFRESH_TOKEN: 'getRefreshToken',
  GET_USER_INFO: 'getUserInfo',
  LOGOUT: 'logout',
  VALIDATE_TOKEN: 'validateToken',
};

const errorCodes = {
  noError: 'gubuy_no_error',
  invalidClientId: 'gubuy_invalid_client_id',
  invalidRedirectUri: 'gubuy_invalid_redirect_uri',
  invalidClientSecret: 'gubuy_invalid_client_secret',
  accessDenied: 'access_denied',
  invalidAuthorizationCode: 'gubuy_invalid_auhtorization_code',
  failedRequest: 'failed_request',
  invalidGrant: 'invalid_grant',
  invalidToken: 'invalid_token',
  invalidClient: 'invalid_client',
  invalidIdTokenHint: 'invalid_id_token_hint',
  invalidUrlLogout: 'invalid_url_logout',
  invalidIdToken: 'invalid_id_token',
  invalidLengthError: 'base64URL_to_base64_invalid_length_error',
  invalidBase64ToHexConversion: 'invalid_base64_to_hex_conversion',
};

const errorDescriptions = {
  noError: 'No error',
  invalidClientId: 'Invalid client_id parameter',
  invalidRedirectUri: 'Invalid redirect_uri parameter',
  invalidClientSecret: 'Invalid client_secret parameter',
  accessDenied: 'The resource owner or authorization server denied the request',
  invalidAuthorizationCode: 'Invalid authorization code',
  failedRequest: "Couldn't make request",
  invalidGrant:
    'The provided authorization grant or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client',
  invalidToken:
    'The access token provided is expired, revoked, malformed, or invalid for other reasons',
  invalidClient:
    'Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method)',
  invalidIdTokenHint: 'Invalid id_token_hint parameter',
  invalidUrlLogout: 'Invalid returned url for logout',
  invalidIdToken: 'Invalid id token',
  invalidLengthError:
    'Input base64url string is the wrong length to determine padding',
  invalidBase64ToHexConversion: 'Error while decoding base64 to hex',
};

class ErrorNoError extends Error {
  constructor(
    errorCode = errorCodes.noError,
    errorDescription = errorDescriptions.noError,
    ...params
  ) {
    // Pasa los argumentos restantes (incluidos los específicos del proveedor) al constructor padre.
    super(...params);
    // Información de depuración personalizada.
    this.name = 'noError';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorInvalidClientId extends Error {
  constructor(
    errorCode = errorCodes.invalidClientId,
    errorDescription = errorDescriptions.invalidClientId,
    ...params
  ) {
    super(...params);
    this.name = 'invalidClientId';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorInvalidRedirectUri extends Error {
  constructor(
    errorCode = errorCodes.invalidRedirectUri,
    errorDescription = errorDescriptions.invalidRedirectUri,
    ...params
  ) {
    super(...params);
    this.name = 'invalidRedirectUri';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorInvalidClientSecret extends Error {
  constructor(
    errorCode = errorCodes.invalidClientSecret,
    errorDescription = errorDescriptions.invalidClientSecret,
    ...params
  ) {
    super(...params);
    this.name = 'invalidClientSecret';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorAccessDenied extends Error {
  constructor(
    errorCode = errorCodes.accessDenied,
    errorDescription = errorDescriptions.accessDenied,
    ...params
  ) {
    super(...params);
    this.name = 'accessDenied';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorInvalidAuthorizationCode extends Error {
  constructor(
    errorCode = errorCodes.invalidAuthorizationCode,
    errorDescription = errorDescriptions.invalidAuthorizationCode,
    ...params
  ) {
    super(...params);
    this.name = 'invalidAuthorizationCode';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorFailedRequest extends Error {
  constructor(
    errorCode = errorCodes.failedRequest,
    errorDescription = errorDescriptions.failedRequest,
    ...params
  ) {
    super(...params);
    this.name = 'failedRequest';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorInvalidGrant extends Error {
  constructor(
    errorCode = errorCodes.invalidGrant,
    errorDescription = errorDescriptions.invalidGrant,
    ...params
  ) {
    super(...params);
    this.name = 'invalidGrant';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorInvalidToken extends Error {
  constructor(
    errorCode = errorCodes.invalidToken,
    errorDescription = errorDescriptions.invalidToken,
    ...params
  ) {
    super(...params);
    this.name = 'invalidToken';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorInvalidClient extends Error {
  constructor(
    errorCode = errorCodes.invalidClient,
    errorDescription = errorDescriptions.invalidClient,
    ...params
  ) {
    super(...params);
    this.name = 'invalidClient';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorInvalidIdTokenHint extends Error {
  constructor(
    errorCode = errorCodes.invalidIdTokenHint,
    errorDescription = errorDescriptions.invalidIdTokenHint,
    ...params
  ) {
    super(...params);
    this.name = 'invalidTokenHint';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorInvalidUrlLogout extends Error {
  constructor(
    errorCode = errorCodes.invalidUrlLogout,
    errorDescription = errorDescriptions.invalidUrlLogout,
    ...params
  ) {
    super(...params);
    this.name = 'invalidUrlLogout';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorInvalidIdToken extends Error {
  constructor(
    errorCode = errorCodes.invalidIdToken,
    errorDescription = errorDescriptions.invalidIdToken,
    ...params
  ) {
    super(...params);
    this.name = 'invalidIdToken';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorBase64InvalidLength extends Error {
  constructor(
    errorCode = errorCodes.invalidLengthError,
    errorDescription = errorDescriptions.invalidLengthError,
    ...params
  ) {
    super(...params);
    this.name = 'invalidLengthError';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

class ErrorBase64ToHexConversion extends Error {
  constructor(
    errorCode = errorCodes.invalidBase64ToHexConversion,
    errorDescription = errorDescriptions.invalidBase64ToHexConversion,
    ...params
  ) {
    super(...params);
    this.name = 'invalidBase64ToHexConversion';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

const ERRORS = {
  NO_ERROR: new ErrorNoError(),
  INVALID_CLIENT_ID: new ErrorInvalidClientId(),
  INVALID_REDIRECT_URI: new ErrorInvalidRedirectUri(),
  INVALID_CLIENT_SECRET: new ErrorInvalidClientSecret(),
  ACCESS_DENIED: new ErrorAccessDenied(),
  INVALID_AUTHORIZATION_CODE: new ErrorInvalidAuthorizationCode(),
  FAILED_REQUEST: new ErrorFailedRequest(),
  INVALID_GRANT: new ErrorInvalidGrant(),
  INVALID_TOKEN: new ErrorInvalidToken(),
  INVALID_CLIENT: new ErrorInvalidClient(),
  INVALID_ID_TOKEN_HINT: new ErrorInvalidIdTokenHint(),
  INVALID_URL_LOGOUT: new ErrorInvalidUrlLogout(),
  INVALID_ID_TOKEN: new ErrorInvalidIdToken(),
  INVALID_BASE64_LENGTH: new ErrorBase64InvalidLength(),
  INVALID_BASE64_TO_HEX_CONVERSION: new ErrorBase64ToHexConversion(),
};

export { REQUEST_TYPES, ERRORS };
