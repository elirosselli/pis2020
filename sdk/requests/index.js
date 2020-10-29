import login from './login';
import logout from './logout';
import getUserInfo from './getUserInfo';
import getTokenOrRefresh from './getTokenOrRefresh';
import validateToken from './validateToken';
import REQUEST_TYPES from '../utils/constants';

const makeRequest = async type => {
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return login();
    }
    case REQUEST_TYPES.GET_TOKEN:
    case REQUEST_TYPES.GET_REFRESH_TOKEN: {
      return getTokenOrRefresh(type);
    }
    case REQUEST_TYPES.LOGOUT: {
      return logout();
    }
    case REQUEST_TYPES.GET_USER_INFO: {
      return getUserInfo();
    }
    case REQUEST_TYPES.VALIDATE_TOKEN: {
      return validateToken();
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
