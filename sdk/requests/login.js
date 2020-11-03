import { Linking } from 'react-native';
import { getParameters, setParameters } from '../configuration';
import { loginEndpoint } from '../utils/endpoints';
import { ERRORS } from '../utils/constants';
import { initializeErrors } from '../utils/helpers';

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
    // Obtiene el code a partir de la url a la que
    // redirige el browser luego de realizado el login.
    const code = event.url.match(/\?code=([^&]+)/);
    // Si existe el code, se guarda y se resuelve la promise
    // si no, se rechaza la promise con un error.
    if (code) {
      setParameters({ code: code[1] });
      // Se retorna el código y el error correspondiente (en este caso no hay error)
      resolveFunction({
        name: 'Success',
        message: ERRORS.NO_ERROR,
        errorCode: ERRORS.NO_ERROR.errorCode,
        errorDescription: ERRORS.NO_ERROR.errorDescription,
        code: code[1],
      });
    } else if (event.url.indexOf('error=access_denied') !== -1) {
      // Cuando el usuario niega el acceso
      rejectFunction(ERRORS.ACCESS_DENIED);
    } else rejectFunction(ERRORS.INVALID_AUTHORIZATION_CODE);

    // Se elimina el handler para los eventos url.
    Linking.removeEventListener('url', handleOpenUrl);
  };

  try {
    // Se agrega el handler para eventos url.
    Linking.addEventListener('url', handleOpenUrl);
    // Si hay un clientId, redirectUri y postLogoutRedirectUri setteado, se abre el browser
    // para realizar la autenticación y autorización con idUruguay.
    if (
      parameters.clientId &&
      parameters.redirectUri &&
      parameters.postLogoutRedirectUri &&
      parameters.clientSecret
    )
      await Linking.openURL(loginEndpoint());
    else {
      // En caso de que algún parámetro sea vacío, se elimina el handler y rechaza la promise, retornando el error correspondiente.
      Linking.removeEventListener('url', handleOpenUrl);
      const errorResponse = initializeErrors(
        parameters.clientId,
        parameters.redirectUri,
        parameters.postLogoutRedirectUri,
        parameters.clientSecret,
      );
      rejectFunction(errorResponse);
    }
  } catch (error) {
    // En caso de error, se elimina el handler y rechaza la promise.
    Linking.removeEventListener('url', handleOpenUrl);
    rejectFunction(ERRORS.FAILED_REQUEST);
  }
  return promise;
};

export default login;
