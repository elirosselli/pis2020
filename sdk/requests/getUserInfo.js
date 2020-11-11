import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { userInfoEndpoint } from '../utils/endpoints';
import { getParameters } from '../configuration';
import { ERRORS } from '../utils/constants';

const getUserInfo = async () => {
  var now = require("performance-now")
  var start = now();
  const { accessToken } = getParameters();
  if (!accessToken) {
    return Promise.reject(ERRORS.INVALID_TOKEN);
  }
  try {
    var end = now();
    const response = await fetch(userInfoEndpoint, {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
    });
    var start2 = now();
    const { status } = response;
    const responseJson = await response.json();
    // En caso de error se devuelve la respuesta,
    // rechazando la promesa.
    if (status !== 200) {
      return Promise.reject(ERRORS.FAILED_REQUEST);
    }

    // Resuelvo promesa con la información del usuario.
    responseJson.message = ERRORS.NO_ERROR;
    responseJson.errorCode = ERRORS.NO_ERROR.errorCode;
    responseJson.errorDescription = ERRORS.NO_ERROR.errorDescription;
    var end2 = now();
    responseJson.tiempo=(end2 - start2) + (end-start);
    return Promise.resolve(responseJson);
  } catch (error) {
    const stringsHeaders = error.headers['Www-Authenticate'];
    if (stringsHeaders && stringsHeaders.indexOf('invalid_token') !== -1)
      return Promise.reject(ERRORS.INVALID_TOKEN);
    return Promise.reject(ERRORS.FAILED_REQUEST);
  }
};

export default getUserInfo;

