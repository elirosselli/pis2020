import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { userInfoEndpoint } from '../utils/endpoints';
import { getParameters } from '../configuration';
import { validateSub } from '../security';

const getUserInfo = async () => {
  const { accessToken } = getParameters();
  try {
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
    const { status } = response;
    const responseJson = await response.json();

    // En caso de error se devuelve la respuesta,
    // rechazando la promesa.
    if (status !== 200) {
      return Promise.reject(responseJson);
    }

    // Resuelvo promesa con la información del usuario si el sub
    // correspondiente al token utilizado coincide con la respuesta
    if (validateSub(responseJson.sub)) {
      return Promise.resolve(responseJson);
    }
    return Promise.reject(Error('Sub no coinciden'));
  } catch (error) {
    return Promise.reject(error);
  }
};

export default getUserInfo;
