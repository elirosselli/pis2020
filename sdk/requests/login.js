import { Linking } from 'react-native';
import { getParameters, setParameters } from '../configuration';
import { loginEndpoint } from '../utils/endpoints';
import { generateRandomState } from '../security';
import ERRORS from '../utils/errors';
import { MUTEX } from '../utils/constants';
import { initializeErrors } from '../utils/helpers';

const login = async () => {
  // Tomar el semáforo para ejecutar la función.
  const mutexRelease = await MUTEX.loginMutex.acquire();

  let parameters;
  let resolveFunction;
  let rejectFunction;

  // Se crea una promise para devolver, y se guardan
  // referencias a sus funciones de reject y resolve.
  const promise = new Promise((resolve, reject) => {
    resolveFunction = resolve;
    rejectFunction = reject;
  });

  // Handler para el evento url.
  const handleOpenUrl = (event, state) => {
    // Obtiene el code y state a partir de la url a la que
    // redirige el browser luego de realizado el login.
    const code = event.url.match(/\?code=([^&]+)/);
    const returnedState = event.url.match(/&state=([^&]*)/);

    // Si existe el código y los states coinciden,
    // se guarda y se resuelve la promise.
    // Si no, se rechaza la promise con un error.
    if (code && returnedState && returnedState[1] === state) {
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
    } else if (returnedState && returnedState[1] !== state) {
      rejectFunction(ERRORS.INVALID_STATE);
    } else {
      rejectFunction(ERRORS.INVALID_AUTHORIZATION_CODE);
    }

    // Se elimina el handler para los eventos url.
    Linking.removeEventListener('url', handleOpenUrl);
  };

  try {
    // Se genera un random state para el pedido al endpoint de login.
    const state = generateRandomState();
    parameters = getParameters();

    // Se agrega el handler para eventos url.
    Linking.addEventListener('url', event => handleOpenUrl(event, state));
    // Si hay un clientId, clientSecret y redirectUri setteado, se abre el browser
    // para realizar la autenticación y autorización con idUruguay.
    if (
      parameters.clientId &&
      parameters.redirectUri &&
      parameters.clientSecret
    )
      await Linking.openURL(loginEndpoint(state));
    else {
      // En caso de que algún parámetro sea vacío, se elimina el handler,
      // se borra el state, y se rechaza la promise, retornando el error correspondiente.
      Linking.removeEventListener('url', handleOpenUrl);
      const errorResponse = initializeErrors(
        parameters.clientId,
        parameters.redirectUri,
        parameters.clientSecret,
      );
      rejectFunction(errorResponse);
    }
  } catch (error) {
    // En caso de error, se elimina el handler y se borra el state,
    // y rechaza la promise.
    Linking.removeEventListener('url', handleOpenUrl);
    rejectFunction(ERRORS.FAILED_REQUEST);
  } finally {
    // Liberar el semáforo una vez que termina la ejecución de la función.
    mutexRelease();
  }
  return promise;
};

export default login;
