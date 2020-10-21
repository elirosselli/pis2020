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

const logout = () => makeRequest(REQUEST_TYPES.LOGOUT);

const getToken = () => makeRequest(REQUEST_TYPES.GET_TOKEN);

const refreshToken = () => makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);

const getUserInfo = () => makeRequest(REQUEST_TYPES.GET_USER_INFO);

export { initialize, login, logout, getToken, getUserInfo, refreshToken };
