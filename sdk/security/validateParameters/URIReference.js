/* eslint-disable default-case */
import { PARAMETERS, ERRORS } from '../../utils/constants';

const validateURIReference = (type, value) => {
  let validURIReference;
  // Se chequea que el valor no sea vacío.
  validURIReference = !!value;
  // Se chequea que el valor sea del tipo string.
  validURIReference = validURIReference && typeof value === 'string';
  // Se chequea que el valor contenga solo caracteres permitidos para el tipo de
  // dato URIReference de la 'a' a la 'z', de la 'A' a la 'Z', de 0 a 9,
  // alguno de estos (_.-/:&?=%) caracteres y que no contenga secuencias
  // sensibles de caracteres.
  validURIReference =
    validURIReference &&
    value
      .replace(
        /[^a-zA-Z0-9_.\-/:&?=%]*(\^@|redirect_uri|client_id|client_secret|code|access_token|refresh_token|token_type|expires_in|id_token_hint|id_token|post_logot_redirect_uri|state|scope|response_type|nonce|prompt|acr_values|grant_type)*/g,
        '',
      )
      .trim();
  if (!validURIReference) {
    switch (type) {
      case PARAMETERS.redirectUri: {
        throw ERRORS.INVALID_REDIRECT_URI;
      }
      case PARAMETERS.postLogoutRedirectUri: {
        throw ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI;
      }
      case PARAMETERS.tokenType: {
        throw ERRORS.INVALID_TOKEN_TYPE;
      }
    }
  }
  return validURIReference;
};

export default validateURIReference;
