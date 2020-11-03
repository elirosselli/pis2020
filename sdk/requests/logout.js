import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { logoutEndpoint } from '../utils/endpoints';
import { getParameters, clearParameters } from '../configuration';

const logout = async () => {
  const parameters = getParameters();
  try {
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
    const missingParamsMessage = 'Missing required parameter(s): ';

    // Si los parámetros obligatorios para la request se encuentran
    // inicializados, se procede a evaluar la respuesta del OP.
    if (parameters.postLogoutRedirectUri && parameters.idToken) {
      if (status === 200) {
        if (urlCheck === logoutEndpoint()) {
          const state = urlCheck.match(/&state=([^&]+)/);
          clearParameters();
          if (state) return Promise.resolve(state[1]);
          return Promise.resolve();
        }
        // Si la url contenida en la respuesta no coincide con el
        // logoutEnpoint, se rechaza la promesa retornando un error.
        return Promise.reject(Error('Invalid returned url'));
      }
      // En caso de que el estado de la respuesta no sea 200,
      // se rechaza la promesa retornando un error.
      return Promise.reject(Error('Response status not OK'));
    }
    // Si alguno de los parámetros obligatorios para la request
    // no se encuentra inicializado, se rechaza la promesa y se
    // retorna un error que especifica cuál o cuáles parámetros
    // faltaron.
    if (parameters.postLogoutRedirectUri)
      return Promise.reject(Error(`${missingParamsMessage}idTokenHint`));
    if (parameters.idToken)
      return Promise.reject(
        Error(`${missingParamsMessage}postLogoutRedirectUri`),
      );
    return Promise.reject(
      Error(`${missingParamsMessage}idTokenHint, postLogoutRedirectUri`),
    );
  } catch (error) {
    // Si existe algun error, se rechaza la promesa y se
    // retorna dicho error.
    return Promise.reject(error);
  }
};

export default logout;
