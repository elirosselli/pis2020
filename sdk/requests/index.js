import login from './login';
import getToken from './getToken';
import REQUEST_TYPES from './constants';

const makeRequest = async type => {
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return login();
    }
    case REQUEST_TYPES.GET_TOKEN || REQUEST_TYPES.GET_REFRESH_TOKEN: {
      return getToken(type);
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
