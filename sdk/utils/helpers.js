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
