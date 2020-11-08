import { Platform } from 'react-native';
import { fetch } from 'react-native-ssl-pinning';
import { validateTokenEndpoint } from '../utils/endpoints';
import { validateTokenSecurity } from '../security';

const validateToken = async () => {
  try {
    // Obtener la jwk del jwks endpoint.
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
    return Promise.reject(error);
  }
};

export default validateToken;
