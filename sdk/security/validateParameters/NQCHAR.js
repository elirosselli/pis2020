import { PARAMETERS, ERRORS } from '../../utils/constants';

const validateNQCHAR = (type, value) => {
  let validNQCHAR;
  // Se chequea que el valor no sea vacío.
  validNQCHAR = !!value;
  // Se chequea que el valor sea del tipo string.
  validNQCHAR = validNQCHAR && typeof value === 'string';
  // Se chequea que el valor contenga solo caracteres permitidos para el tipo de
  // dato NQCHAR \x21, del \x23 a \x5B y del \x5D a \x7E hexadecimal de la tabla
  // ASCII y que no contenga secuencias sensibles de caracteres.
  validNQCHAR =
    validNQCHAR &&
    value
      .replace(
        /[^\x21\x23-\x5B\x5D-\x7E]*(\^@|redirect_uri|client_id|client_secret|code|access_token|refresh_token|token_type|expires_in|id_token_hint|id_token|post_logot_redirect_uri|state|scope|response_type|nonce|prompt|acr_values|grant_type)*/g,
        '',
      )
      .trim();
  if (!validNQCHAR && type === PARAMETERS.scope) {
    throw ERRORS.INVALID_SCOPE;
  }
  return validNQCHAR;
};

export default validateNQCHAR;
