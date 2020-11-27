import { KJUR, KEYUTIL } from 'jsrsasign';
import { decode } from 'base-64';
import { ACR_LIST, AMR_LIST } from '../utils/constants';
import ERRORS from '../utils/errors';

import { base64ToHex, base64URLtoBase64 } from '../utils/encoding';

const validateTokenSecurity = (jwksResponse, idToken, clientId, issuer) => {
  // Se construye la clave pública para verificar la firma del token.
  let isValid;
  let headObj;
  let payloadObj;
  try {
    const pubKey = KEYUTIL.getKey({
      n: base64ToHex(base64URLtoBase64(jwksResponse.keys[0].n)),
      e: base64ToHex(jwksResponse.keys[0].e),
    });

    // Se valida la firma, los campos alg, iss, aud, y que no esté expirado.
    // alg: algoritmo de la firma.
    // iss: quién creo y firmó el token.
    // aud: para quién está destinado el token.
    // verifyAt: Verifica validez comparada con la hora actual.
    // gracePeriod: margen de error de tiempo en el cual se sigue tomando como válido el token.
    isValid = KJUR.jws.JWS.verifyJWT(idToken, pubKey, {
      alg: [jwksResponse.keys[0].alg],
      iss: [issuer],
      aud: [clientId],
      verifyAt: KJUR.jws.IntDate.getNow(),
      gracePeriod: 5,
    });

    // Se obtiene el campo head del token.
    headObj = KJUR.jws.JWS.readSafeJSONString(decode(idToken.split('.')[0]));

    // Se obtiene el campo payload del token.
    payloadObj = KJUR.jws.JWS.readSafeJSONString(decode(idToken.split('.')[1]));
  } catch (err) {
    return Promise.reject(ERRORS.INVALID_ID_TOKEN);
  }

  // Se valida el kid (identificador único) del token.
  isValid = isValid && headObj.kid === jwksResponse.keys[0].kid;

  // Se valida que el acr esté incluido en los definidos por IDUruguay.
  // ACR: es un conjunto de métodos o procedimientos de autenticación
  // que se consideran equivalentes entre sí en un contexto particular.
  isValid = isValid && ACR_LIST.includes(payloadObj.acr);

  // Se valida que los amr estén incluido en los definidos por IDUruguay.
  // AMR: es un array de strings que corresponden a identificadores de
  // métodos de autenticación usados en la autenticación.
  isValid =
    isValid &&
    Array.isArray(payloadObj.amr) &&
    payloadObj.amr.every(v => AMR_LIST.includes(v));

  if (isValid) {
    return Promise.resolve({
      jwk: jwksResponse,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  }
  return Promise.reject(ERRORS.INVALID_ID_TOKEN);
};

export default validateTokenSecurity;
