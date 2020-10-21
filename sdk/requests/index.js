import login from './login';
<<<<<<< HEAD
import logout from './logout';
import getUserInfo from './getUserInfo';
=======
import userInfo from './userInfo';
>>>>>>> 8bbb08b8512d2f82efe8862f4d49b8892de8cc21
import getTokenOrRefresh from './getTokenOrRefresh';
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
<<<<<<< HEAD
    case REQUEST_TYPES.LOGOUT: {
      return logout();
    }
    case REQUEST_TYPES.GET_USER_INFO: {
      return getUserInfo();
=======
    case REQUEST_TYPES.USER_INFO: {
      return userInfo();
>>>>>>> 8bbb08b8512d2f82efe8862f4d49b8892de8cc21
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
