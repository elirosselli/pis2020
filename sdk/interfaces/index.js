import makeRequest, { REQUEST_TYPES } from '../requests';
import { setParameters } from '../configuration';

const initialize = (redirectUri, clientId, clientSecret) => {
  setParameters({ redirectUri, clientId, clientSecret });
};

const login = () => makeRequest(REQUEST_TYPES.LOGIN);

const getToken = () => makeRequest(REQUEST_TYPES.GET_TOKEN);

export { initialize, login, getToken };
