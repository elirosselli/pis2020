/* eslint-disable sonarjs/cognitive-complexity */
import { encode } from 'base-64';
import { Platform } from 'react-native';
import { getParameters, setParameters, eraseCode } from '../configuration';
import { tokenEndpoint } from '../utils/endpoints';
import { REQUEST_TYPES, MUTEX } from '../utils/constants';
import ERRORS from '../utils/errors';
import { initializeErrors, fetch } from '../utils/helpers';

const getTokenOrRefresh = async type => {
  var now = require("performance-now");
  var start = now();
  // Tomar el semáforo para ejecutar la función.
  const mutexRelease = await MUTEX.getTokenOrRefreshMutex.acquire();

  try {
    const parameters = getParameters();
    // En caso de que algún parámetro sea vacío, se rechaza la promise y se retorna el error correspondiente.
    if (
      !parameters.clientId ||
      !parameters.redirectUri ||
      !parameters.clientSecret
    ) {
      const errorResponse = initializeErrors(
        parameters.clientId,
        parameters.redirectUri,
        parameters.clientSecret,
      );
      // Se borra el parámetro code una vez ejecutado el getToken.
      eraseCode();
      return Promise.reject(errorResponse);
    }

    // En el caso de get token, se chequea que el code exista.
    if (type === REQUEST_TYPES.GET_TOKEN && !parameters.code) {
      // Se borra el parámetro code una vez ejecutado el getToken.
      eraseCode();
      return Promise.reject(ERRORS.INVALID_AUTHORIZATION_CODE);
    }
    // En el caso de refresh token, se chequea que el refresh token exista.
    if (type === REQUEST_TYPES.GET_REFRESH_TOKEN && !parameters.refreshToken) {
      return Promise.reject(ERRORS.INVALID_GRANT);
    }

    // Codificar en base64 el clientId y el clientSecret,
    // siguiendo el esquema de autenticación HTTP Basic Auth.
    const encodedCredentials = encode(
      `${parameters.clientId}:${parameters.clientSecret}`,
    );
    // En caso de que el request sea GET_TOKEN el body de la request contendrá grant_type 'authorization_code', el code obtenido
    // durante el login, y la redirect uri correspondiente.
    let bodyString = `grant_type=authorization_code&code=${parameters.code}&redirect_uri=${parameters.redirectUri}`;
    // En caso de que el request sea GET_REFRESH_TOKEN el body de la request contendrá grant_type 'refresh_token' y
    // el refresh token obtenido en get token.
    if (type === REQUEST_TYPES.GET_REFRESH_TOKEN)
      bodyString = `grant_type=refresh_token&refresh_token=${parameters.refreshToken}`;

    // Se borra el parámetro code una vez ejecutado el getToken.
    eraseCode();
    
    var end = now();
    // Se arma la solicitud a enviar al tokenEndpoint, tomando
    // los datos de autenticación codificados
    const response = await fetch(
      tokenEndpoint(),
      {
        method: 'POST',
        pkPinning: !parameters.production && Platform.OS === 'ios',
        disableAllSecurity: parameters.production,
        sslPinning: !parameters.production && {
          certs: ['certificate'],
        },
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        },
        body: bodyString,
      },
      5,
    );

    var start2 = now();

    const { status } = response;
    const responseJson = await response.json();

    // En caso de error se devuelve la respuesta,
    // rechazando la promesa.
    if (status !== 200) {
      return Promise.reject(ERRORS.FAILED_REQUEST);
    }

    // En caso de una respuesta correcta se definen los
    // parámetros correspondientes en configuración.
    setParameters({
      accessToken: responseJson.access_token,
      refreshToken: responseJson.refresh_token,
      tokenType: responseJson.token_type,
      expiresIn: responseJson.expires_in,
      idToken: responseJson.id_token,
    });
    var end2 = now();
    // console.log(`tiempo: ${ (end2-start2) + (end-start)}`);
    // Además se retornan todos los parametros obtenidos al RP, junto con código y mensaje de éxito.
    return Promise.resolve({
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      accessToken: responseJson.access_token,
      refreshToken: responseJson.refresh_token,
      tokenType: responseJson.token_type,
      expiresIn: responseJson.expires_in,
      idToken: responseJson.id_token,
      tiempo: (end2-start2) + (end-start),
    });
  } catch (error) {
    // Si existe algun error, se
    // rechaza la promesa y se devuelve el
    // error.
    if (error.bodyString && error.bodyString.indexOf('invalid_grant') !== -1)
      return Promise.reject(ERRORS.INVALID_GRANT);
    if (error.bodyString && error.bodyString.indexOf('invalid_client') !== -1)
      return Promise.reject(ERRORS.INVALID_CLIENT);
    return Promise.reject(ERRORS.FAILED_REQUEST);
  } finally {
    // Liberar el semáforo una vez que termina la ejecución de la función.
    mutexRelease();
  }
};

export default getTokenOrRefresh;
