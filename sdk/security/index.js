import { KJUR, KEYUTIL } from 'jsrsasign';
import { getParameters } from '../configuration';
import { issuer } from '../utils/endpoints';
import { base64ToHex, base64URLtoBase64 } from '../utils/encoding';

export const validateTokenSecurity = jwksResponse => {
  const { idToken, accessToken } = getParameters();
  console.log(idToken);
  console.log(accessToken);
  // const pubKey = new RSAKey();
  // pubKey.setPublic(jwksResponse.keys[0].n, jwksResponse.keys[0].e);

  const pubKey = KEYUTIL.getKey({
    n: base64ToHex(base64URLtoBase64(jwksResponse.keys[0].n)),
    e: base64ToHex(jwksResponse.keys[0].e),
  });
  const isValid = KJUR.jws.JWS.verifyJWT(idToken, pubKey, {
    alg: [jwksResponse.keys[0].alg],
    iss: [issuer],
    aud: [getParameters().clientId],
    verifyAt: KJUR.jws.IntDate.getNow(), // Verifica validez comparada con la hora actual
    jti: 'asas',
  });
  console.log(isValid);
  return Promise.resolve({ jwk: jwksResponse, error: 'Correcto' });
};

export default validateTokenSecurity;
