import { Linking } from 'react-native';
import makeRequest from '../requests';
import { setParameters } from '../configuration';

const REQUEST_TYPES = { LOGIN: 'login', GET_TOKEN: 'getToken' };

const initialize = (redirectUri, clientId, clientSecret) => {
  setParameters({ redirectUri, clientId, clientSecret });
};

const login = async () => {
  let resolveFunction;
  let rejectFunction;
  const promise = new Promise((resolve, reject) => {
    resolveFunction = resolve;
    rejectFunction = reject;
  });

  const handleOpenUrl = event => {
    const code = event.url.match(/\?code=([^&]+)/);
    if (code) {
      setParameters({ code: code[1] });
      resolveFunction(code[1]);
    } else rejectFunction(Error('Invalid authorization code'));
    Linking.removeEventListener('url', handleOpenUrl);
  };

  try {
    Linking.addEventListener('url', handleOpenUrl);
    await makeRequest(REQUEST_TYPES.LOGIN);
  } catch (error) {
    Linking.removeEventListener('url', handleOpenUrl);
    rejectFunction(Error("Couldn't make request"));
  }

  return promise;
};


const getToken = async (code) => {
  try {
    const response = makeRequest(
      REQUEST_TYPES.GET_TOKEN
    );
    console.log('respppppppp');
    console.log(response);
    return response; // no se si seria response directo o algo tipo response.token
  } catch (error) {
    console.log('errrrrrrrr');
    console.log(error);
    return error;
  }
};

export { initialize, login, getToken };
