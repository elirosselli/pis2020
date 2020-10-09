import makeRequest, { REQUEST_TYPES } from '../requests';
import { setParameters } from '../configuration';

const initialize = (redirectUri, clientId, clientSecret) => {
  setParameters({ redirectUri, clientId, clientSecret });
};

const login = () => makeRequest(REQUEST_TYPES.LOGIN);

const getToken = () => makeRequest(REQUEST_TYPES.GET_TOKEN);

const logout = async () => {
  let resolveFunction;
  let rejectFunction;
  const promise = new Promise((resolve, reject) => {
    resolveFunction = resolve;
    rejectFunction = reject;
  });

  const handleOpenUrl = event => {
    const urlCheck = event.url;
    if (urlCheck) resolveFunction(urlCheck);
    else rejectFunction(Error('Invalid url'));
    Linking.removeEventListener('url', handleOpenUrl);
  };

  try {
    Linking.addEventListener('url', handleOpenUrl);
    await makeRequest(REQUEST_TYPES.LOGOUT);
  } catch (error) {
    Linking.removeEventListener('url', handleOpenUrl);
    rejectFunction(Error("Couldn't make request"));
  }

  return promise;
};

export { initialize, login, getToken, logout };
