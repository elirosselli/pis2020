import { encode } from 'base-64';
import { fetch } from 'react-native-ssl-pinning';
import { getParameters, setParameters } from '../configuration';
import { tokenEndpoint } from './endpoints';
import login from './login';

export const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
  GET_REFRESH_TOKEN: 'getRefreshToken',
};

const makeRequest = async type => {
  const parameters = getParameters();
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return login();
    }
    case REQUEST_TYPES.GET_TOKEN:
    case REQUEST_TYPES.GET_REFRESH_TOKEN: {
      // Codificar en base64 el clientId y el clientSecret,
      // siguiendo el esquema de autenticación HTTP Basic Auth.
      const encodedCredentials = encode(
        `${parameters.clientId}:${parameters.clientSecret}`,
      );
      // En caso de que el request sea GET_TOKEN el body de la request contendrá el code obtenido
      // durante el login, y la redirect uri correspondiente.
      let bodyString = `grant_type=authorization_code&code=${parameters.code}&redirect_uri=${parameters.redirectUri}`;
      // En caso de que el request sea GET_REFRESH_TOKEN el body de la request contendrá grant_type 'refresh_token' y
      // el refresh token obtenido en get token
      // eslint-disable-next-line eqeqeq
      if (type == REQUEST_TYPES.GET_REFRESH_TOKEN)
        bodyString = `grant_type=refresh_token&refresh_token=${parameters.refreshToken}`;
      try {
        // Se arma la solicitud a enviar al tokenEndpoint, tomando
        // los datos de autenticación codificados
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
          body: bodyString,
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
    default:
      return 'default value';
  }
};

export default makeRequest;
