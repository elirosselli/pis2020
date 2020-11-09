<<<<<<< HEAD
/* eslint-disable import/prefer-default-export */
import { ERRORS } from './constants';

const initializeErrors = (
  clientId,
  redirectUri,
  postLogoutRedirectUri,
  clientSecret,
) => {
  let response;
  if (!clientId) {
    // Si el client id es vacío se retorna el error correspondiente.
    response = ERRORS.INVALID_CLIENT_ID;
  } else if (!redirectUri) {
    // Si la redirect uri es vacía se retorna el error correspondiente.
    response = ERRORS.INVALID_REDIRECT_URI;
  } else if (!postLogoutRedirectUri) {
    // Si el post logout redirect uri es vacío se retorna el error correspondiente.
    response = ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI;
  } else if (!clientSecret) {
    // Si el client secret es vacío se retorna el error correspondiente.
    response = ERRORS.INVALID_CLIENT_SECRET;
  }
  return response;
};

export { initializeErrors };
=======
import { fetch as fetchSslPinning } from 'react-native-ssl-pinning';

export const fetch = (url, options, n = 3) => {
  const fetchOptions = { ...options };
  return fetchSslPinning(url, fetchOptions).catch(error => {
    if (n === 1) throw error;
    return fetch(url, fetchOptions, n - 1);
  });
};

export default fetch;
>>>>>>> helpers file
