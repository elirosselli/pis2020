import { Platform } from 'react-native';
import { fetch } from 'react-native-ssl-pinning';
import { validateTokenEndpoint } from '../utils/endpoints';
import { validateTokenSecurity } from '../security';
import { ERRORS } from '../utils/constants';

const validateToken = async () => {
  try {
    // Obtener la jwk del jwks endpoint.
    // JSON Web Key (JWK): estandar de representación de una clave criptográfica en formato JSON.
    // JSON Web Key Set (JWKS): conjunto de JWKs.
    // JWKS Endpoint: expone las claves y algoritmos que el OP usa. Útil para verificar la autenticidad de los tokens emitidos.
    const jwksResponse = await fetch(validateTokenEndpoint, {
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
    return validateTokenSecurity(jwksResponseJson);
  } catch (error) {
    return Promise.reject(ERRORS.FAILED_REQUEST);
  }
};

export default validateToken;
