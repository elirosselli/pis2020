/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { loginEndpoint, tokenEndpoint } from './endpoints';
import { getParameters } from '../configuration';
import { encode as btoa } from 'base-64';


export const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
};

const makeRequest = async type =>  {
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
      const encodedCredentials = btoa(`${parameters.clientId}:${parameters.clientSecret}`);
      try {
        const response = await fetch(
          'POST',
          tokenEndpoint,
          {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: 'application/json',
          },
          `grant_type=authorization_code&code=${parameters.code}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
        );
        const { status } = response.respInfo;
        const responseJson = await response.json();
        if (status === 400) {
          return Promise.reject(responseJson);
        }
        return Promise.resolve(responseJson);
      } catch (error) {
        console.log(error);
      }
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
