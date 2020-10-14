import makeRequest, { REQUEST_TYPES } from '../requests';
import { setParameters } from '../configuration';

const initialize = (redirectUri, clientId, clientSecret) => {
  setParameters({ redirectUri, clientId, clientSecret });
};

const login = () => makeRequest(REQUEST_TYPES.LOGIN);

const getToken = () => makeRequest(REQUEST_TYPES.GET_TOKEN);

const refreshToken = async () => {
  try {
    return makeRequest(REQUEST_TYPES.GET_REFRESH_TOKEN);
  } catch (error) {
    return error;
  }
};

export { initialize, login, getToken, refreshToken };
