import { encode } from 'base-64';
import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { getParameters, setParameters, eraseCode } from '../configuration';
import { tokenEndpoint } from '../utils/endpoints';
import { ERRORS, REQUEST_TYPES } from '../utils/constants';
import { initializeErrors } from '../utils/helpers';

const getTokenOrRefresh = async type => {
  const parameters = getParameters();
  // En caso de que algún parámetro sea vacío, se rechaza la promise y se retorna el error correspondiente.
  if (
    !parameters.clientId ||
    !parameters.redirectUri ||
    !parameters.postLogoutRedirectUri ||
    !parameters.clientSecret
  ) {
    const respError = initializeErrors(
      parameters.clientId,
      parameters.redirectUri,
      parameters.postLogoutRedirectUri,
      parameters.clientSecret,
    );
    // Se borra el parámetro code una vez ejecutado el getToken
    eraseCode();
    return Promise.reject(respError);
  }

  // En el caso de get token, se chequea que el code exista
  if (type === REQUEST_TYPES.GET_TOKEN && !parameters.code) {
    // Se borra el parámetro code una vez ejecutado el getToken
    eraseCode();
    return Promise.reject(ERRORS.INVALID_AUTHORIZATION_CODE);
  }

  // En el caso de refresh token, se chequea que el refresh token exista
  if (type === REQUEST_TYPES.GET_REFRESH_TOKEN && !parameters.refreshToken){
    // Se borra el parámetro code una vez ejecutado el getToken
    eraseCode();
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
  // el refresh token obtenido en get token
  if (type === REQUEST_TYPES.GET_REFRESH_TOKEN)
    bodyString = `grant_type=refresh_token&refresh_token=${parameters.refreshToken}`;

  try {
    // Se arma la solicitud a enviar al tokenEndpoint, tomando
    // los datos de autenticación codificados en base64
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
      body: bodyString,
    });

    const { status } = response;
    const responseJson = await response.json();

    // En caso de error se devuelve la respuesta,
    // rechazando la promesa.
    if (status !== 200) {
      // Se borra el parámetro code una vez ejecutado el getToken
      eraseCode();
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
    // Se borra el parámetro code una vez ejecutado el getToken
    eraseCode();
    // Además se retornan todos los parametros obtenidos al RP, junto con código y mensaje de éxito
    return Promise.resolve({
      name: 'Success',
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      accessToken: responseJson.access_token,
      refreshToken: responseJson.refresh_token,
      tokenType: responseJson.token_type,
      expiresIn: responseJson.expires_in,
      idToken: responseJson.id_token,
    });
  } catch (error) {
    // Se borra el parámetro code una vez ejecutado el getToken
    eraseCode();
    // Si existe algun error, se
    // rechaza la promesa y se devuelve el
    // error.
    if (error.bodyString && error.bodyString.indexOf('invalid_grant') !== -1)
      return Promise.reject(ERRORS.INVALID_GRANT);
    if (error.bodyString && error.bodyString.indexOf('invalid_client') !== -1)
      return Promise.reject(ERRORS.INVALID_CLIENT);
    return Promise.reject(ERRORS.FAILED_REQUEST);
  }
};

export default getTokenOrRefresh;
