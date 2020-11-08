import { KJUR, KEYUTIL } from 'jsrsasign';
import { decode } from 'base-64';
import { getParameters } from '../configuration';
import { issuer } from '../utils/endpoints';

import { base64ToHex, base64URLtoBase64 } from '../utils/encoding';

const validateTokenSecurity = jwksResponse => {
  const { idToken } = getParameters();

  // Se construye la clave publica para verificar la firma del token.
  const pubKey = KEYUTIL.getKey({
    n: base64ToHex(base64URLtoBase64(jwksResponse.keys[0].n)),
    e: base64ToHex(jwksResponse.keys[0].e),
  });

  // Se valida la firma, los campos alg, iss, aud, y que no esté expirado.
  // alg: algoritmo de la firma.
  // iss: quien creo y firmó el token.
  // aud: para quien está destinado el token
  let isValid = KJUR.jws.JWS.verifyJWT(idToken, pubKey, {
    alg: [jwksResponse.keys[0].alg],
    iss: [issuer],
    aud: [getParameters().clientId],
    verifyAt: KJUR.jws.IntDate.getNow(), // Verifica validez comparada con la hora actual.
  });

  // Se obtiene el campo head del token.
  const headObj = KJUR.jws.JWS.readSafeJSONString(
    decode(idToken.split('.')[0]),
  );

  // Se valida el kid del token.
  isValid = isValid && headObj.kid === jwksResponse.keys[0].kid;

  return Promise.resolve({ jwk: jwksResponse, error: isValid });
};

export default validateTokenSecurity;
