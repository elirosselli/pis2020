/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import makeRequest, { REQUEST_TYPES } from '../requests';

const login = clientId => {
  let resolveFunction;
  let rejectFunction;
  const promise = new Promise((resolve, reject) => {
    resolveFunction = resolve;
    rejectFunction = reject;
  });

  const handleOpenUrl = event => {
    const code = event.url.match(/\?code=([^&]+)/);
    if (code) resolveFunction(code[1]);
    else rejectFunction(Error('Invalid authorization code'));
  };

  Linking.addEventListener('url', handleOpenUrl);

  makeRequest(REQUEST_TYPES.LOGIN, clientId);

  return promise;
};

export { login };
