import makeRequest from '../requests';
import REQUEST_TYPES from '../utils/constants';
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

const refreshToken = () => makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);

const logout = async () => makeRequest(REQUEST_TYPES.LOGOUT);

export { initialize, login, getToken, refreshToken, logout };
