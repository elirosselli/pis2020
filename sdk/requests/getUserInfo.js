import { Platform } from 'react-native';
import { getParameters } from '../configuration';
import { validateSub } from '../security';
import { userInfoEndpoint } from '../utils/endpoints';
import { fetch } from '../utils/helpers';
import { MUTEX } from '../utils/constants';
import ERRORS from '../utils/errors';

const getUserInfo = async () => {
  // Tomar el semáforo para ejecutar la función.
  const mutexRelease = await MUTEX.getUserInfoMutex.acquire();

  try {
    const { accessToken, idToken, production } = getParameters();
    // Si no existe un access token guardado,
    // se devuelve el error correspondiente.
    if (!accessToken) {
      return Promise.reject(ERRORS.INVALID_TOKEN);
    }
    // Se necesita un id token para validar el sub devuelto por el OP.
    // Si no existe este id token, se devuelve el error correspondiente.
    if (!idToken) {
      return Promise.reject(ERRORS.INVALID_ID_TOKEN);
    }
    const response = await fetch(
      userInfoEndpoint(),
      {
        method: 'GET',
        pkPinning: !production && Platform.OS === 'ios',
        disableAllSecurity: production,
        sslPinning: !production && {
          certs: ['certificate'],
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        },
      },
      5,
    );

    const { status } = response;
    const responseJson = await response.json();
    // En caso de error se devuelve la respuesta,
    // rechazando la promesa.
    if (status !== 200) {
      return Promise.reject(ERRORS.FAILED_REQUEST);
    }

    // Resuelvo la promesa con la información del usuario si
    // el sub correspondiente al token utilizado coincide con
    // el sub de la respuesta del OP.
    if (validateSub(responseJson.sub)) {
      responseJson.message = ERRORS.NO_ERROR;
      responseJson.errorCode = ERRORS.NO_ERROR.errorCode;
      responseJson.errorDescription = ERRORS.NO_ERROR.errorDescription;
      return Promise.resolve(responseJson);
    }
    return Promise.reject(ERRORS.INVALID_SUB);
  } catch (error) {
    if (error === ERRORS.INVALID_ID_TOKEN) {
      return Promise.reject(ERRORS.INVALID_ID_TOKEN);
    }
    const stringsHeaders =
      error.headers &&
      (error.headers['WWW-Authenticate'] || error.headers['Www-Authenticate']);
    if (stringsHeaders && stringsHeaders.indexOf('invalid_token') !== -1)
      return Promise.reject(ERRORS.INVALID_TOKEN);
    return Promise.reject(ERRORS.FAILED_REQUEST);
  } finally {
    // Liberar el semáforo una vez que termina la ejecución de la función.
    mutexRelease();
  }
};

export default getUserInfo;
