/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { encode as btoa } from 'base-64';
import RNFetchBlob from 'rn-fetch-blob';
import { loginEndpoint, tokenEndpoint } from './endpoints';

export const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
};

// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios').default;
const https = require('https');

const makeRequest = (type, clientId, clientSecret, authCode) => {
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return clientId && Linking.openURL(loginEndpoint(clientId));
    }
    case REQUEST_TYPES.GET_TOKEN: {
      const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

      axios
        .post(tokenEndpoint, {
          httpsAgent: new https.Agent({
            ca: fs.readFileSync("../certificate.crt"),
          }),
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: 'application/json',
          },
          data: {
            grant_type: 'authorization_code',
            code: `${authCode}`,
            redirect_uri: 'sdkIdU.testing%3A%2F%2Fauth',
            // `grant_type=authorization_code&code=${authCode}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
          },
        })
        .then(resp => [resp.json(), resp.respInfo.status])
        .then(data => {
          if (data[1] === 400) {
            return Promise.reject(data[0]);
          }
          return Promise.resolve(data[0]);
        });
      // .catch(function (error) {
      //   console.log(error);
      // });

      // return RNFetchBlob.config({ trusty: true })
      //   .fetch(
      //     'POST',
      //     tokenEndpoint,
      //     {
      //       Authorization: `Basic ${encodedCredentials}`,
      //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      //       Accept: 'application/json',
      //     },
      //     `grant_type=authorization_code&code=${authCode}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
      //   )
      //   .then(resp => [resp.json(), resp.respInfo.status])
      //   .then(data => {
      //     if (data[1] === 400) {
      //       return Promise.reject(data[0]);
      //     }
      //     return Promise.resolve(data[0]);
      //   });
    }
    // eslint-disable-next-line no-fallthrough
    default:
      return 'default value';
  }
};

export default makeRequest;
