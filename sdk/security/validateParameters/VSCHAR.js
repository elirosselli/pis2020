/* eslint-disable default-case */
import { PARAMETERS } from '../../utils/constants';
import ERRORS from '../../utils/errors';

const validateVSCHAR = (type, value) => {
  let validVSCHAR;
  // Se chequea que el valor no sea vacío.
  validVSCHAR = !!value;
  // Se chequea que el valor sea del tipo string.
  validVSCHAR = validVSCHAR && typeof value === 'string';
  // Se chequea que el valor contenga solo caracteres permitidos para el tipo de
  // dato VSCHAR del \x20 a \x7E hexadecimal de la tabla ASCII y que
  // no contenga secuencias sensibles de caracteres.
  validVSCHAR =
    validVSCHAR &&
    !value.match(/[^\x20-\x7E]/) &&
    !value.match(
      /(\^@|redirect_uri|client_id|client_secret|code|access_token|refresh_token|token_type|expires_in|id_token_hint|id_token|post_logout_redirect_uri|state|scope|response_type|nonce|prompt|acr_values|grant_type)/,
    );
  if (!validVSCHAR) {
    switch (type) {
      case PARAMETERS.clientId: {
        throw ERRORS.INVALID_CLIENT_ID;
      }
      case PARAMETERS.clientSecret: {
        throw ERRORS.INVALID_CLIENT_SECRET;
      }
      case PARAMETERS.code: {
        throw ERRORS.INVALID_AUTHORIZATION_CODE;
      }
      case PARAMETERS.accessToken:
      case PARAMETERS.refreshToken: {
        throw ERRORS.INVALID_TOKEN;
      }
      case PARAMETERS.idToken: {
        throw ERRORS.INVALID_ID_TOKEN;
      }
    }
  }
  return value;
};

export default validateVSCHAR;
