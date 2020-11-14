import { KJUR, KEYUTIL } from 'jsrsasign';
import { decode } from 'base-64';
import { ERRORS } from '../utils/constants';

import { base64ToHex, base64URLtoBase64 } from '../utils/encoding';

const validateTokenSecurity = (jwksResponse, idToken, clientId, issuer) => {
  // Se construye la clave pública para verificar la firma del token.
  const pubKey = KEYUTIL.getKey({
    n: base64ToHex(base64URLtoBase64(jwksResponse.keys[0].n)),
    e: base64ToHex(jwksResponse.keys[0].e),
  });

  // Se valida la firma, los campos alg, iss, aud, y que no esté expirado.
  // alg: algoritmo de la firma.
  // iss: quién creo y firmó el token.
  // aud: para quién está destinado el token
  // verifyAt: Verifica validez comparada con la hora actual.
  let isValid = KJUR.jws.JWS.verifyJWT(idToken, pubKey, {
    alg: [jwksResponse.keys[0].alg],
    iss: [issuer],
    aud: [clientId],
    verifyAt: KJUR.jws.IntDate.getNow(),
  });

  // Se obtiene el campo head del token.
  const headObj = KJUR.jws.JWS.readSafeJSONString(
    decode(idToken.split('.')[0]),
  );

  // Se obtiene el campo head del token.
  const payloadObj = KJUR.jws.JWS.readSafeJSONString(
    decode(idToken.split('.')[1]),
  );

  // Se valida el kid (identificador único) del token.
  isValid = isValid && headObj.kid === jwksResponse.keys[0].kid;

  // Lista de acr (Authentication Methods References) definidos por IDUruguay.
  const acrList = [
    'urn:iduruguay:nid:0',
    'urn:iduruguay:nid:1',
    'urn:iduruguay:nid:2',
    'urn:iduruguay:nid:3',
  ];

  // Lista de amr (Authentication Methods References) definidos por IDUruguay.
  const amrList = [
    'urn:iduruguay:am:password',
    'urn:iduruguay:am:totp',
    'urn:iduruguay:am:ci',
    'urn:iduruguay:am:idp:ae:0',
    'urn:iduruguay:am:idp:ae:1',
    'urn:iduruguay:am:idp:ae:2',
    'urn:iduruguay:am:idp:ae:3',
  ];

  // Se valida que el acr esté incluido en los definidos por IDUruguay.
  isValid = isValid && acrList.includes(payloadObj.acr);

  // Se valida que los amr estén incluido en los definidos por IDUruguay.
  isValid =
    isValid &&
    Array.isArray(payloadObj.amr) &&
    payloadObj.amr.every(v => amrList.includes(v));

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
