import { Linking } from 'react-native';
import { getParameters, setParameters } from '../configuration';
import { loginEndpoint } from '../utils/endpoints';
import { generateRandomState } from '../security';

const login = async () => {
  generateRandomState(); // Se genera random state para la request
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
    const returnedState = event.url.match(/&state=([^&]+)/);

    // Si existe el código, se guarda y se resuelve la promise
    // si no, se rechaza la promise con un error.
    if (code && returnedState[1] === parameters.state) {
      setParameters({ code: code[1] });
      resolveFunction(code[1]);
    } else if (!code) rejectFunction(Error('Invalid authorization code'));
    else rejectFunction(Error('Returned state does not match'));

    // Se elimina el handler para los eventos url.
    Linking.removeEventListener('url', handleOpenUrl);
  };

  try {
    // Se agrega el handler para eventos url.
    Linking.addEventListener('url', handleOpenUrl);
    // Si hay un clientId setteado, se abre el browser
    // para realizar la autenticación con idUruguay.
    // Se utiliza un state random para verificar en la respuesta
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
