import { ERRORS } from './constants';

const initializeErrors = (
  clientId,
  redirectUri,
  postLogoutRedirectUri,
  clientSecret,
) => {
  let response;
  if (!clientId) {
    // Si el client id es vacio se retorna el error correspondiente
    response = ERRORS.INVALID_CLIENT_ID;
  } else if (!redirectUri) {
    // Si la redirect uri es vacia se retorna el error correspondiente
    response = ERRORS.INVALID_REDIRECT_URI;
  } else if (!postLogoutRedirectUri) {
    // Si el post logout redirect uri es vacio se retorna el error correspondiente
    response = ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI;
  } else if (!clientSecret) {
    // Si el client secret es vacio se retorna el error correspondiente
    response = ERRORS.INVALID_CLIENT_SECRET;
  }
  return response;
};

const getTokenErrors = (
  clientId,
  redirectUri,
  postLogoutRedirectUri,
  clientSecret,
  code,
) => {
  let response = initializeErrors(
    clientId,
    redirectUri,
    postLogoutRedirectUri,
    clientSecret,
  );
  if (!response && !code) {
    // Si el client secret es vacio se retorna el error correspondiente
    response = ERRORS.INVALID_AUTHORIZATION_CODE;
  }
  return response;
};

export { initializeErrors, getTokenErrors };
