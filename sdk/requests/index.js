/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { loginEndpoint } from './endpoints';
import { getParameters } from '../configuration';

export const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
};

const makeRequest = type => {
  const parameters = getParameters();
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      // si hay un clientId setteado, se abre el browser
      // para realizar la autenticación con idUruguay
      return (
        parameters.clientId &&
        Linking.openURL(loginEndpoint(parameters.clientId))
      );
    }
    case REQUEST_TYPES.GET_TOKEN: {
      return 'get token functionality';
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
