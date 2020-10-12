import { Linking } from 'react-native';
import makeRequest from '../requests';
import { setParameters } from '../configuration';

const REQUEST_TYPES = { LOGIN: 'login' };

const initialize = (redirectUri, clientId, clientSecret) => {
  setParameters({ redirectUri, clientId, clientSecret });
};

const login = async () => {
  let resolveFunction;
  let rejectFunction;

  // se crea una promise para devolver, y se guardan
  // referencias a sus funciones de reject y resolve
  const promise = new Promise((resolve, reject) => {
    resolveFunction = resolve;
    rejectFunction = reject;
  });

  // handler para el evento url
  const handleOpenUrl = event => {
    // obtiene el auth code a partir de la url a la que
    // redirige el browser luego de realizado el login
    const code = event.url.match(/\?code=([^&]+)/);

    // si existe el codigo, se settea y se resuelve la promise
    // si no, se hace un reject de la promise con un error
    if (code) {
      setParameters({ code: code[1] });
      resolveFunction(code[1]);
    } else rejectFunction(Error('Invalid authorization code'));

    // se elimina el handler para los eventos url
    Linking.removeEventListener('url', handleOpenUrl);
  };

  try {
    // se agrega el handler para eventos url
    Linking.addEventListener('url', handleOpenUrl);
    await makeRequest(REQUEST_TYPES.LOGIN);
  } catch (error) {
    // en caso de error, se elimina el handler y se hace reject de la promise
    Linking.removeEventListener('url', handleOpenUrl);
    rejectFunction(Error("Couldn't make request"));
  }

  return promise;
};

export { initialize, login };
