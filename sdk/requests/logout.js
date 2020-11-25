import { Platform } from 'react-native';
import { fetch } from '../utils/helpers';
import { logoutEndpoint } from '../utils/endpoints';
import { generateRandomState } from '../security';
import ERRORS from '../utils/errors';
import { MUTEX } from '../utils/constants';
import { getParameters, clearParameters } from '../configuration';

const logout = async () => {
  // Tomar el semáforo para ejecutar la función.
  const mutexRelease = await MUTEX.logoutMutex.acquire();

  try {
    // Se genera un random state para el pedido al endpoint de logout.
    const state = generateRandomState();
    const parameters = getParameters();

    // Si alguno de los parámetros obligatorios para la request
    // no se encuentra inicializado se rechaza la promesa y
    // se retorna un error que especifica cuál parámetro faltó.
    if (!parameters.idToken) {
      return Promise.reject(ERRORS.INVALID_ID_TOKEN_HINT);
    }

    // Se arma la solicitud a enviar al logoutEndpoint.
    const response = await fetch(logoutEndpoint(state), {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    const { status } = response;
    const urlCheck = response.url;

    // Si los parámetros obligatorios para la request se encuentran
    // inicializados, se procede a evaluar la respuesta del OP.
    if (status === 200) {
      if (urlCheck === logoutEndpoint(state)) {
        const returnedState = urlCheck.match(/&state=([^&]+)/);
        clearParameters();
        return Promise.resolve({
          message: ERRORS.NO_ERROR,
          errorCode: ERRORS.NO_ERROR.errorCode,
          errorDescription: ERRORS.NO_ERROR.errorDescription,
          state: returnedState[1],
        });
      }
      // Si la url contenida en la respuesta no coincide con el
      // logoutEndpoint, se rechaza la promesa retornando un error.
      return Promise.reject(ERRORS.INVALID_URL_LOGOUT);
    }
    // En cualquier otro caso, se rechaza la promesa
    return Promise.reject(ERRORS.FAILED_REQUEST);
  } catch (error) {
    // En caso de que el estado de la respuesta no sea 200,
    // se rechaza la promesa retornando un error.
    return Promise.reject(ERRORS.FAILED_REQUEST);
  } finally {
    // Liberar el semáforo una vez que termina la ejecución de la función.
    mutexRelease();
  }
};

export default logout;
