import { KJUR, KEYUTIL } from 'jsrsasign';
import { getParameters } from '../configuration';
import { issuer } from '../utils/endpoints';
import { decode } from 'base-64';

export const validateTokenSecurity = jwksResponse => {
  const { idToken, accessToken } = getParameters();
  console.log(idToken);
  console.log(accessToken);
  // const pubKey = new RSAKey();
  // pubKey.setPublic(jwksResponse.keys[0].n, jwksResponse.keys[0].e);

  const base64ToHex = str => {
    const raw = str;
    let result = '';
    for (let i = 0; i < raw.length; i += 1) {
      const hex = raw.charCodeAt(i).toString(16);
      result += hex.length === 2 ? hex : `0${hex}`;
    }
    return result.toUpperCase();
  };

  
  // console.log(base64ToHex(decode(jwksResponse.keys[0].e)));
  // const pubKey = KEYUTIL.getKey({
  //   n: jwksResponse.keys[0].n,
  //   e: base64ToHex(decode(jwksResponse.keys[0].e)),
  // });
  // console.log(pubKey);
  const pubkey = KEYUTIL.getKey(`-----BEGIN PUBLIC KEY-----
  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHGni+BdhlfT9+rtBLy/b95dr6
  fTcGtR/UKBYjHCNcP3n/FAlkirVR2ISde+CHUEmHAQ2eXv60BfjxhZHlvsHhRN9A
  KmPHdxZ4eDGqU8VvDyTKJZ+NV7pdMImKgv+p56eJ8Sl6JpTTFmxklCD0/1zuVVFi
  YQQVlDf11IfgzFAlpQIDAQAB
  -----END PUBLIC KEY-----
  `);
  console.log(pubkey);
  const isValid = KJUR.jws.JWS.verifyJWT(idToken, pubkey, {
    alg: [jwksResponse.keys[0].alg],
    iss: [issuer],
    aud: [getParameters().clientId],
  });
  console.log(isValid);
  return Promise.resolve({ jwk: jwksResponse, error: 'Correcto' });
};

export default validateTokenSecurity;
