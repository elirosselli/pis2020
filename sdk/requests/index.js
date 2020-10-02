/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { loginEndpoint } from './endpoints';

export const REQUEST_TYPES = {
  LOGIN: 'login',
};

const makeRequest = (type, clientId) => {
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return clientId && Linking.openURL(loginEndpoint(clientId));
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
