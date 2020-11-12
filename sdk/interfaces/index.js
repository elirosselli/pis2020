import makeRequest from '../requests';
import { REQUEST_TYPES, ERRORS } from '../utils/constants';
import { initializeErrors } from '../utils/helpers';
import {
  setParameters,
  getParameters,
  clearParameters,
  resetParameters,
} from '../configuration';

const initialize = (
  redirectUri,
  clientId,
  clientSecret,
  postLogoutRedirectUri,
  production,
  scope,
) => {
  let response;
  if (
    clientId &&
    redirectUri &&
    clientSecret &&
    postLogoutRedirectUri &&
    typeof production === 'boolean'
  ) {
    // Si los parámetros clientId, clientSecret, redirectUri y postLogoutRedirectUri no son vacíos
    // y production es de tipo booleano se hace el set de los parámetros.
    const scopeToSet = scope || ''; // Si no se pasa el scope como parámetro, se toma como undefined, entonces se debe asignar el string vacío.
    setParameters({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      production,
      scope: scopeToSet, // Puede ser vacío.
    });
    // Mensaje y código de éxito.
    response = {
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      message: ERRORS.NO_ERROR,
    };
  } else {
    // Si alguno de los parámetros es vacío se retorna el error correspondiente.
    response = initializeErrors(
      clientId,
      redirectUri,
      postLogoutRedirectUri,
      clientSecret,
      production,
    );
  }
  // Se retorna el error y el mensaje correspondiente.
  return response;
};

const login = () => makeRequest(REQUEST_TYPES.LOGIN);

const logout = () => makeRequest(REQUEST_TYPES.LOGOUT);

const getToken = () => makeRequest(REQUEST_TYPES.GET_TOKEN);

const refreshToken = () => makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);

const getUserInfo = () => makeRequest(REQUEST_TYPES.GET_USER_INFO);

const validateToken = () => makeRequest(REQUEST_TYPES.VALIDATE_TOKEN);

export {
  initialize,
  login,
  logout,
  getToken,
  getUserInfo,
  refreshToken,
  setParameters,
  getParameters,
  clearParameters,
  resetParameters,
  validateToken,
};
