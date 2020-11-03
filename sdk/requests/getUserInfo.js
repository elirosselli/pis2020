import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { userInfoEndpoint } from '../utils/endpoints';
import { getParameters } from '../configuration';
import { ERRORS } from '../utils/constants';

const getUserInfo = async () => {
  const { accessToken } = getParameters();
  if (!accessToken) {
    return Promise.reject(ERRORS.INVALID_TOKEN);
  }
  try {
    const response = await fetch(userInfoEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        // Authorization: `Bearer ${accessToken}`,
        Authorization: `Bearer pepe`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
    });
    const { status } = response;
    const responseJson = await response.json();
    console.log(responseJson);
    // En caso de error se devuelve la respuesta,
    // rechazando la promesa.
    if (status !== 200) {
      if (status === 401) return Promise.reject(ERRORS.INVALID_TOKEN); // TODO: revisar si hay otros errores con 401, y si hay obtener el dato del header
      return Promise.reject(ERRORS.FAILED_REQUEST);
    }

    // Resuelvo promesa con la información del usuario.
    responseJson.name = 'Success';
    responseJson.message = ERRORS.NO_ERROR;
    responseJson.errorCode = ERRORS.NO_ERROR.errorCode;
    responseJson.errorDescription = ERRORS.NO_ERROR.errorDescription;
    return Promise.resolve(responseJson);
  } catch (error) {
    return Promise.reject(ERRORS.FAILED_REQUEST);
  }
};

export default getUserInfo;
