import { Linking } from 'react-native';
import { getParameters, setParameters } from '../configuration';
import { loginEndpoint } from './endpoints';

const login = async () => {
  const parameters = getParameters();
  let resolveFunction;
  let rejectFunction;

  // Se crea una promise para devolver, y se guardan
  // referencias a sus funciones de reject y resolve.
  const promise = new Promise((resolve, reject) => {
    resolveFunction = resolve;
    rejectFunction = reject;
  });

  // Handler para el evento url.
  const handleOpenUrl = event => {
    // Obtiene el auth code a partir de la url a la que
    // redirige el browser luego de realizado el login.
    const code = event.url.match(/\?code=([^&]+)/);

    // Si existe el código, se guarda y se resuelve la promise
    // si no, se rechaza la promise con un error.
    if (code) {
      setParameters({ code: code[1] });
      resolveFunction(code[1]);
    } else rejectFunction(Error('Invalid authorization code'));

    // Se elimina el handler para los eventos url.
    Linking.removeEventListener('url', handleOpenUrl);
  };

  try {
    // Se agrega el handler para eventos url.
    Linking.addEventListener('url', handleOpenUrl);
    // Si hay un clientId setteado, se abre el browser
    // para realizar la autenticación con idUruguay.
    if (parameters.clientId) await Linking.openURL(loginEndpoint());
    else {
      // En caso de error, se elimina el handler y rechaza la promise.
      Linking.removeEventListener('url', handleOpenUrl);
      rejectFunction(Error("Couldn't make request"));
    }
  } catch (error) {
    // En caso de error, se elimina el handler y rechaza la promise.
    Linking.removeEventListener('url', handleOpenUrl);
    rejectFunction(Error("Couldn't make request"));
  }
  return promise;
};

export default login;
