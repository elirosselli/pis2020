import makeRequest, { REQUEST_TYPES } from '../requests';
import { setParameters } from '../configuration';

const initialize = (
  redirectUri,
  clientId,
  clientSecret,
  postLogoutRedirectUri,
) => {
  setParameters({ redirectUri, clientId, clientSecret, postLogoutRedirectUri });
};

const login = () => makeRequest(REQUEST_TYPES.LOGIN);

const getToken = () => makeRequest(REQUEST_TYPES.GET_TOKEN);

const logout = async () => makeRequest(REQUEST_TYPES.LOGOUT);

export { initialize, login, getToken, logout };
