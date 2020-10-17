import login from './login';
import getTokenOrRefresh from './getTokenOrRefresh';
import REQUEST_TYPES from './constants';

const makeRequest = async type => {
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return login();
    }
    case REQUEST_TYPES.GET_TOKEN:
    case REQUEST_TYPES.GET_REFRESH_TOKEN: {
      return getTokenOrRefresh(type);
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
