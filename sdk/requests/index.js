/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { loginEndpoint } from './endpoints';

export const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
};

const makeRequest = (type, clientId) => {
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return clientId && Linking.openURL(loginEndpoint(clientId));
    }
    case REQUEST_TYPES.GET_TOKEN: {
      return 'get token functionality';
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
