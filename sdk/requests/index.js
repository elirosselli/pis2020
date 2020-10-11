/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { getParameters } from '../configuration';
import { loginEndpoint, tokenEndpoint } from './endpoints';
import { encode as btoa } from 'base-64';
import RNFetchBlob from 'rn-fetch-blob';


export const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
};

const makeRequest = type => {
  const parameters = getParameters();
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return (
        parameters.clientId &&
        Linking.openURL(loginEndpoint(parameters.clientId))
      );
    }
    case REQUEST_TYPES.GET_TOKEN: {
      const encodedCredentials = btoa(`${parameters.clientId}:${parameters.clientSecret}`);
      //RNFetchBlob.config({ trusty: true }).
      const res = RNFetchBlob.config({ trusty: true }).fetch(
          'POST',
          tokenEndpoint,
          {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: 'application/json',
          },
          `grant_type=authorization_code&code=${parameters.code}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
        )
        .then(resp => {
          return [resp.json(), resp.respInfo.status];
        })
        .then(data => {
          console.log('data'+data[0]);
          if (data[1] === 400) {
            return Promise.reject(data[0]);
          } else {
            return Promise.resolve(data[0]);
          }
        });
      console.log('res');
      console.log(res);
      console.log('-res');
      return res;
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
