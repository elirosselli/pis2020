/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { loginEndpoint, logoutEndpoint } from './endpoints';
import { getParameters } from '../configuration';

export const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
  LOGOUT: 'logout',
};

const idToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODY0IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAyNzA0OTIwLCJpYXQiOjE2MDI3MDQzMjAsImF1dGhfdGltZSI6MTYwMjcwNDMwOSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJIMXFlTm9tSkV1QkdyRWExTDhWblJnIn0.m3GL2lbUS5Ab7_axV-dYr1TLuyQdGoBo6k6aJUSzzMuLaWx7OOdnfbcES6J-Pyi6VnONppkV9kb2AGenJ08w9nQcyq7eVH_J5BdQKCbx1-DoUrx_5rKZY40k1J3iANcpNtzVrbay5pAES4y9s5LdqJYpuRmnLjKHkj6U0zYdeK4';

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
    case REQUEST_TYPES.LOGOUT: {
      return idToken && Linking.openURL(logoutEndpoint(idToken));
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
