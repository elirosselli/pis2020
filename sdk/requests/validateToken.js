import { Platform } from 'react-native';
import { fetch } from 'react-native-ssl-pinning';
import { validateTokenEndpoint } from '../utils/endpoints';
import { validateTokenSecurity } from '../security';

const validateToken = async () => {
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
  const jwksResponseJson = await jwksResponse.json();

  return validateTokenSecurity(jwksResponseJson);
};

export default validateToken;
