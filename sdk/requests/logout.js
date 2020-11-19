import { Platform } from 'react-native';
import { fetch } from '../utils/helpers';
import { logoutEndpoint } from '../utils/endpoints';
import { generateRandomState } from '../security';
import { ERRORS } from '../utils/constants';
import { getParameters, clearParameters, eraseState } from '../configuration';

const logout = async () => {
  // Se genera un random state para el pedido al endpoint de logout,
  // que además se settea en los parámetros mediante una llamada a setParameters.
  generateRandomState();
  const parameters = getParameters();
  try {
    // Si alguno de los parámetros obligatorios para la request
    // no se encuentra inicializado, se borra el state,
    // se rechaza la promesa y se retorna un error que especifica
    // cuál parámetro faltó.
    if (!parameters.idToken) {
      eraseState();
      return Promise.reject(ERRORS.INVALID_ID_TOKEN_HINT);
    }

    // Se arma la solicitud a enviar al logoutEndpoint.
    const response = await fetch(logoutEndpoint(), {
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
      if (urlCheck === logoutEndpoint()) {
        const state = urlCheck.match(/&state=([^&]+)/);
        clearParameters();
        if (state)
          return Promise.resolve({
            message: ERRORS.NO_ERROR,
            errorCode: ERRORS.NO_ERROR.errorCode,
            errorDescription: ERRORS.NO_ERROR.errorDescription,
            state: state[1],
          });
        return Promise.resolve({
          message: ERRORS.NO_ERROR,
          errorCode: ERRORS.NO_ERROR.errorCode,
          errorDescription: ERRORS.NO_ERROR.errorDescription,
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
  }
};

export default logout;
