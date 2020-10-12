/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { getParameters, setParameters } from '../configuration';
import { loginEndpoint, tokenEndpoint } from './endpoints';
import { encode as btoa } from 'base-64';
import { fetch } from 'react-native-ssl-pinning';

export const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
};

const makeRequest = async type => {
  const parameters = getParameters();
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      // si hay un clientId setteado, se abre el browser
      // para realizar la autenticación con idUruguay
      return (
        parameters.clientId &&
        Linking.openURL(loginEndpoint(parameters.clientId))
      );
    }
    case REQUEST_TYPES.GET_TOKEN: {
      // Codificar en base64 el clientId y el clientSecret, 
      // siguiendo el esquema de autenticación HTTP Basic Auth.
      const encodedCredentials = btoa(
        `${parameters.clientId}:${parameters.clientSecret}`,
      );
      try {
        // Se arma la solicitud a enviar al tokenEndpoint, tomando 
        // los datos de autenticación codificados, el code obtenido
        // durante el login, y la redirect uri correspondiente.
        const response = await fetch(tokenEndpoint, {
          method: 'POST',
          sslPinning: {
            certs: ['certificate'],
          },
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: 'application/json',
          },
          body: `grant_type=authorization_code&code=${parameters.code}&redirect_uri=${parameters.redirectUri}`,
        });

        const { status } = response;
        const responseJson = await response.json();

        // En caso de error se devuelve la respuesta, 
        // rechazando la promesa.
        if (status === 400) {
          return Promise.reject(responseJson);
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
        return Promise.resolve(responseJson.access_token);
      } catch (error) {
        // Si existe algun error, se 
        // rechaza la promesa y se devuelve el
        // error.
        return Promise.reject(error);
      }
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
