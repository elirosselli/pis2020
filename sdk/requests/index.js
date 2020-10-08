/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { loginEndpoint, tokenEndpoint } from './endpoints';
import { encode as btoa } from 'base-64';
import RNFetchBlob from 'rn-fetch-blob';

export const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
};

const makeRequest = (type, clientId, clientSecret, authCode) => {
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return clientId && Linking.openURL(loginEndpoint(clientId));
    }
    case REQUEST_TYPES.GET_TOKEN: {
      const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

      return RNFetchBlob.config({ trusty: true })
        .fetch(
          'POST',
          tokenEndpoint,
          {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: 'application/json',
          },
          `grant_type=authorization_code&code=${authCode}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
        )
        .then(resp => {
          return [resp.json(), resp.respInfo.status];
        })
        .then(data => {
          if (data[1] === 400) {
            return Promise.reject(data[0]);
          } else {
            return Promise.resolve(data[0]);
          }
        });
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
