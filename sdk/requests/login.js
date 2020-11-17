import { Linking } from 'react-native';
import { getParameters, setParameters, eraseState } from '../configuration';
import { loginEndpoint } from '../utils/endpoints';
import { generateRandomState } from '../security';
import ERRORS from '../utils/errors';
import { initializeErrors } from '../utils/helpers';

const login = async () => {
  // Se genera un random state para el pedido al endpoint de login,
  // que además se settea en los parámetros mediante una llamada a setParameters.
  generateRandomState();
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
    // Obtiene el code y state a partir de la url a la que
    // redirige el browser luego de realizado el login.
    const code = event.url.match(/\?code=([^&]+)/);
    const returnedState = event.url.match(/&state=([^&]+)/);

    // Si existe el código y los states coinciden,
    // se guarda y se resuelve la promise.
    // Si no, se rechaza la promise con un error.
    if (code && returnedState[1] === parameters.state) {
      setParameters({ code: code[1] });
      // Se retorna el código, state y el error correspondiente (en este caso no hay error).
      resolveFunction({
        message: ERRORS.NO_ERROR,
        errorCode: ERRORS.NO_ERROR.errorCode,
        errorDescription: ERRORS.NO_ERROR.errorDescription,
        code: code[1],
        state: returnedState[1],
      });
    } else if (event.url && event.url.indexOf('error=access_denied') !== -1) {
      // Cuando el usuario niega el acceso.
      rejectFunction(ERRORS.ACCESS_DENIED);
    } else {
      rejectFunction(ERRORS.INVALID_AUTHORIZATION_CODE);
    }

    // Se elimina el handler para los eventos url.
    Linking.removeEventListener('url', handleOpenUrl);
  };

  try {
    // Se agrega el handler para eventos url.
    Linking.addEventListener('url', handleOpenUrl);
    // Si hay un clientId, clientSecret y redirectUri setteado, se abre el browser
    // para realizar la autenticación y autorización con idUruguay.
    if (
      parameters.clientId &&
      parameters.redirectUri &&
      parameters.clientSecret
    )
      await Linking.openURL(loginEndpoint());
    else {
      // En caso de que algún parámetro sea vacío, se obtiene el error correspondiente.
      initializeErrors(
        parameters.clientId,
        parameters.redirectUri,
        parameters.clientSecret,
      );
    }
  } catch (error) {
    // En caso de error se elimina el handler y se borra el state.
    eraseState();
    Linking.removeEventListener('url', handleOpenUrl);

    // En caso de error devuelto por la función initializeErrors, se retorna el error obtenido
    // rechazando la promise.
    if (
      error &&
      error.errorCode &&
      (error.errorCode === ERRORS.INVALID_REDIRECT_URI.errorCode ||
        ERRORS.INVALID_CLIENT_SECRET.errorCode ||
        ERRORS.INVALID_CLIENT_ID.errorCode)
    )
      rejectFunction(error);

    // En caso de otro error, se rechaza la promise.
    rejectFunction(ERRORS.FAILED_REQUEST);
  }
  return promise;
};

export default login;
