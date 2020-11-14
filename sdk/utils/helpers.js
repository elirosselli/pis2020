import { fetch as fetchSslPinning } from 'react-native-ssl-pinning';
import { ERRORS } from './constants';

const initializeErrors = (clientId, redirectUri, clientSecret, production) => {
  let response;
  if (!clientId) {
    // Si el client id es vacío se retorna el error correspondiente.
    response = ERRORS.INVALID_CLIENT_ID;
  } else if (!redirectUri) {
    // Si la redirect uri es vacía se retorna el error correspondiente.
    response = ERRORS.INVALID_REDIRECT_URI;
  } else if (!clientSecret) {
    // Si el client secret es vacío se retorna el error correspondiente.
    response = ERRORS.INVALID_CLIENT_SECRET;
  } else if (typeof production !== 'boolean') {
    // Si production no es booleano se retorna el error correspondiente.
    response = ERRORS.INVALID_PRODUCTION;
  }
  return response;
};

const fetch = (url, options, n = 3) => {
  const fetchOptions = { ...options };
  return fetchSslPinning(url, fetchOptions).catch(error => {
    if (n === 1) throw error;
    return fetch(url, fetchOptions, n - 1);
  });
};

export { initializeErrors, fetch };
