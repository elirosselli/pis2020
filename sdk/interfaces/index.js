import makeRequest from '../requests';
import { REQUEST_TYPES, ERRORS } from '../utils/constants';
import { initializeErrors } from '../utils/helpers';
import { setParameters } from '../configuration';

const initialize = (
  redirectUri,
  clientId,
  clientSecret,
  postLogoutRedirectUri,
  scope,
) => {
  let response;
  if (clientId && redirectUri && clientSecret && postLogoutRedirectUri) {
    // Si los parametros clientId, redirectUri y postLogoutRedirectUri no son vacíos se hace el set de los parametros
    setParameters({
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
      scope, // Puede ser vacio
    });
    // Mensaje y código de éxito
    response = { name: 'Success', message: ERRORS.NO_ERROR };
  } else {
    // Si alguno de los parametros es vacío se retorna el error correspondiente
    response = initializeErrors(
      clientId,
      redirectUri,
      postLogoutRedirectUri,
      clientSecret,
    );
  }
  // Se retorna el error y el mensaje correspondiente
  return response;
};

const login = () => makeRequest(REQUEST_TYPES.LOGIN);

const logout = () => makeRequest(REQUEST_TYPES.LOGOUT);

const getToken = () => makeRequest(REQUEST_TYPES.GET_TOKEN);

const refreshToken = () => makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);

const getUserInfo = () => makeRequest(REQUEST_TYPES.GET_USER_INFO);

export { initialize, login, logout, getToken, getUserInfo, refreshToken };
