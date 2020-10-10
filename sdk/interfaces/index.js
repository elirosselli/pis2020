/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import makeRequest from '../requests';

const REQUEST_TYPES = { LOGIN: 'login', GET_TOKEN: 'getToken' };

const login = async clientId => {
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
    Linking.removeEventListener('url', handleOpenUrl);
  };

  try {
    Linking.addEventListener('url', handleOpenUrl);
    await makeRequest(REQUEST_TYPES.LOGIN, clientId);
  } catch (error) {
    Linking.removeEventListener('url', handleOpenUrl);
    rejectFunction(Error("Couldn't make request"));
  }

  return promise;
};

const getToken = async (code, clientId, clientSecret) => {
  try {
    const response = makeRequest(
      REQUEST_TYPES.GET_TOKEN,
      clientId,
      clientSecret,
      code,
    );
    console.log(response);
    return response; // no se si seria response directo o algo tipo response.token
  } catch (error) {
    console.log(error);
    return error;
  }
};

export { login, getToken };
