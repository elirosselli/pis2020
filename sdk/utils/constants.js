const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
  GET_REFRESH_TOKEN: 'getRefreshToken',
  GET_USER_INFO: 'getUserInfo',
  LOGOUT: 'logout',
};

const errorCodes = {
  noError: 'gubuy_no_error',
  invalidClientId: 'gubuy_invalid_client_id',
  invalidRedirectUri: 'gubuy_invalid_redirect_uri',
  invalidClientSecret: 'gubuy_invalid_client_secret',
  invalidPostLogoutRedirecrtUri: 'gubuy_invalid_post_logout_redirect_uri',
  accessDenied: 'access_denied',
  invalidAuthorizationCode: 'gubuy_invalid_auhtorization_code',
  failedRequest: 'failed_request',
};

const errorDescriptions = {
  noError: 'No hay error',
  invalidClientId: 'Parámetro client_id inválido',
  invalidRedirectUri: 'Parámetro redirect_uri inválido',
  invalidClientSecret: 'Parámetro client_secret inválido',
  invalidPostLogoutRedirecrtUri: 'Parámetro post_logout_redirect_uri inválido',
  accessDenied: 'The resource owner or authorization server denied the request',
  invalidAuthorizationCode: 'Invalid authorization code',
  failedRequest: "Couldn't make request",
};

const noError = {
  description: errorDescriptions.noError,
  code: errorCodes.noError,
};

class ErrorInvalidClientId extends Error {
  constructor(
    errorCode = errorCodes.invalidClientId,
    errorDescription = errorDescriptions.invalidClientId,
    ...params
  ) {
    // Pasa los argumentos restantes (incluidos los específicos del proveedor) al constructor padre
    super(...params);

    // Mantiene un seguimiento adecuado de la pila para el lugar donde se lanzó nuestro error (solo disponible en V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorInvalidClientId);
    }

    this.name = 'invalidClientId';
    // Información de depuración personalizada
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}

// const invalidClientId = Error("descripcion");
// invalidClientId.name = errorCodes.invalidClientId;
// invalidClientId.state = "hola";

// const invalidClientId = Error({
//   description: errorDescriptions.invalidClientId,
//   code: errorCodes.invalidClientId,
// });

const invalidRedirectUri = Error({
  description: errorDescriptions.invalidRedirectUri,
  code: errorCodes.invalidRedirectUri,
});

const invalidClientSecret = Error({
  description: errorDescriptions.invalidClientSecret,
  code: errorCodes.invalidClientSecret,
});

const invalidPostLogoutRedirecrtUri = Error({
  description: errorDescriptions.invalidPostLogoutRedirecrtUri,
  code: errorCodes.invalidPostLogoutRedirecrtUri,
});

const accessDenied = Error({
  description: errorDescriptions.accessDenied,
  code: errorCodes.accessDenied,
});

const invalidAuthorizationCode = Error({
  description: errorDescriptions.invalidAuthorizationCode,
  code: errorCodes.invalidAuthorizationCode,
});

const failedRequest = Error({
  description: errorDescriptions.failedRequest,
  code: errorCodes.failedRequest,
});

const ERRORS = {
  NO_ERROR: noError,
  INVALID_CLIENT_ID: new ErrorInvalidClientId(),
  INVALID_REDIRECT_URI: invalidRedirectUri,
  INVALID_POST_LOGOUT_REDIRECT_URI: invalidPostLogoutRedirecrtUri,
  INVALID_CLIENT_SECRET: invalidClientSecret,
  ACCESS_DENIED: accessDenied,
  INVALID_AUTHORIZATION_CODE: invalidAuthorizationCode,
  FAILED_REQUEST: failedRequest,
};

export { REQUEST_TYPES, ERRORS };
