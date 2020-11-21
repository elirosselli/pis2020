import { Platform } from 'react-native';
import { fetch } from '../utils/helpers';
import { validateTokenEndpoint, issuer } from '../utils/endpoints';
import ERRORS from '../utils/errors';
import { getParameters } from '../configuration';
import { validateTokenSecurity } from '../security';
import { MUTEX } from '../utils/constants';

const validateToken = async () => {
  // Tomar el semáforo para ejecutar la función.
  const mutexRelease = await MUTEX.validateTokenMutex.acquire();

  try {
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

    // Obtener la jwk del jwks endpoint.
    // JSON Web Key (JWK): estandar de representación de una clave criptográfica en formato JSON.
    // JSON Web Key Set (JWKS): conjunto de JWKs.
    // JWKS Endpoint: expone las claves y algoritmos que el OP usa. Útil para verificar la autenticidad de los tokens emitidos.
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
    // Convertir a formato json.
    const jwksResponseJson = await jwksResponse.json();
    // Validar el token en el módulo de seguridad a partir de la jwk.
    return validateTokenSecurity(jwksResponseJson, idToken, clientId, issuer());
  } catch (error) {
    return Promise.reject(ERRORS.FAILED_REQUEST);
  } finally {
    // Liberar el semáforo una vez que termina la ejecución de la función.
    mutexRelease();
  }
};

export default validateToken;
