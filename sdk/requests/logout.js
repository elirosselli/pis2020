import { Linking } from 'react-native';
import { getParameters, setParameters } from '../configuration';
import { logoutEndpoint } from './endpoints';

const logout = async () => {
  const parameters = getParameters();
  let resolveFunction;
  let rejectFunction;
  const promise = new Promise((resolve, reject) => {
    resolveFunction = resolve;
    rejectFunction = reject;
  });

  const handleOpenUrl = event => {
    const urlCheck = event.url;
    if (urlCheck) {
      setParameters({ code: 'empty' });
      resolveFunction(urlCheck);
    } else rejectFunction(Error('Invalid post logout redirect uri'));
    Linking.removeEventListener('url', handleOpenUrl);
  };

  try {
    Linking.addEventListener('url', handleOpenUrl);
    if (parameters.idToken && parameters.postLogoutRedirectUri)
      await Linking.openURL(logoutEndpoint());
    else {
      Linking.removeEventListener('url', handleOpenUrl);
      rejectFunction(Error("Couldn't make request"));
    }
  } catch (error) {
    Linking.removeEventListener('url', handleOpenUrl);
    rejectFunction(Error("Couldn't make request"));
  }

  return promise;
};

export default logout;
