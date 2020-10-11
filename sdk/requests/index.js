/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { getParameters, setParameters } from '../configuration';
import { loginEndpoint, tokenEndpoint } from './endpoints';
import { encode as btoa } from 'base-64';
import RNFetchBlob from 'rn-fetch-blob';

export const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
};

const makeRequest = async type => {
  const parameters = getParameters();
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return (
        parameters.clientId &&
        Linking.openURL(loginEndpoint(parameters.clientId))
      );
    }
    case REQUEST_TYPES.GET_TOKEN: {
      const encodedCredentials = btoa(
        `${parameters.clientId}:${parameters.clientSecret}`,
      );
      try {
        const response = await RNFetchBlob.config({ trusty: true }).fetch(
          'POST',
          tokenEndpoint,
          {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: 'application/json',
          },
          `grant_type=authorization_code&code=${parameters.code}&redirect_uri=${parameters.redirectUri}`,
        );
        console.log(response);
        const { status } = response.respInfo;
        const responseJson = await response.json();
        if (status === 400) {
          return Promise.reject(responseJson);
        }
        setParameters({
          accessToken: responseJson.access_token,
          refreshToken: responseJson.refresh_token,
          tokenType: responseJson.token_type,
          expiresIn: responseJson.expires_in,
          idToken: responseJson.id_token
        });
        return Promise.resolve(responseJson.access_token);
      } catch (error) {
        console.log(error);
      }
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
