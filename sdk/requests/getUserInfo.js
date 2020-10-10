import { fetch } from 'react-native-ssl-pinning';

import { userInfoEndpoint } from '../utils/endpoints';
import { getParameters } from '../configuration';

const getUserInfo = async () => {
  const { accessToken } = getParameters();
  try {
    const response = await fetch(userInfoEndpoint, {
      method: 'GET',
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

    // Resuelvo promesa con la información del usuario.
    return Promise.resolve(responseJson);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default getUserInfo;
