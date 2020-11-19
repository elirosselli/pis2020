import { Platform } from 'react-native';
import { fetch } from '../utils/helpers';
import { validateTokenEndpoint, issuer } from '../utils/endpoints';
import ERRORS from '../utils/errors';
import { getParameters } from '../configuration';
import { validateTokenSecurity } from '../security';

const validateToken = async () => {
  var now = require("performance-now");
  var start = now();
  const { idToken, clientId } = getParameters();

  // Si alguno de los parámetros obligatorios para la request
  // no se encuentra inicializado, se rechaza la promesa y se
  // retorna un error que especifica cuál parámetro
  // faltó.
  if (!idToken) {
    return Promise.reject(ERRORS.INVALID_ID_TOKEN);
  }
  if (!clientId) {
    return Promise.reject(ERRORS.INVALID_CLIENT_ID);
  }

  try {
    // Obtener la jwk del jwks endpoint.
    // JSON Web Key (JWK): estandar de representación de una clave criptográfica en formato JSON.
    // JSON Web Key Set (JWKS): conjunto de JWKs.
    // JWKS Endpoint: expone las claves y algoritmos que el OP usa. Útil para verificar la autenticidad de los tokens emitidos.
    var end = now();

    const jwksResponse = await fetch(validateTokenEndpoint(), {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Accept: 'application/json; charset=utf-8',
      },
    });

    var start2 = now();
    // Convertir a formato json.
    const jwksResponseJson = await jwksResponse.json();
    // Validar el token en el módulo de seguridad a partir de la jwk.
    var resp = await validateTokenSecurity(jwksResponseJson, idToken, clientId, issuer());
    var end2 = now();
    resp.tiempo = (end2 - start2) + (end - start);
    return resp;
  } catch (error) {
    return Promise.reject(ERRORS.FAILED_REQUEST);
  }
};

export default validateToken;
