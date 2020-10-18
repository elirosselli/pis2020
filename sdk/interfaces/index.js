import makeRequest from '../requests';
import REQUEST_TYPES from '../utils/constants';
import { setParameters } from '../configuration';

const initialize = (redirectUri, clientId, clientSecret) => {
  setParameters({ redirectUri, clientId, clientSecret });
};

const login = () => makeRequest(REQUEST_TYPES.LOGIN);

const getToken = () => makeRequest(REQUEST_TYPES.GET_TOKEN);

const refreshToken = () => makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);

const getUserInfo = async () => makeRequest(REQUEST_TYPES.USER_INFO);

export { initialize, login, getToken, getUserInfo, refreshToken };
