import { Linking } from 'react-native';
import { encode } from 'base-64';
import { fetch } from 'react-native-ssl-pinning';
import { getParameters, setParameters } from '../configuration';
import { tokenEndpoint, logoutEndpoint } from './endpoints';
import login from './login';

export const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
  LOGOUT: 'logout',
};

const makeRequest = async type => {
  const parameters = getParameters();
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return login();
    }
    case REQUEST_TYPES.GET_TOKEN: {
      // Codificar en base64 el clientId y el clientSecret,
      // siguiendo el esquema de autenticación HTTP Basic Auth.
      const encodedCredentials = encode(
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
        if (status !== 200) {
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
    case REQUEST_TYPES.LOGOUT: {
      return (
        parameters.idToken &&
        parameters.postLogoutRedirectUri &&
        Linking.openURL(
          logoutEndpoint(parameters.idToken, parameters.postLogoutRedirectUri),
        )
      );
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
