import { Linking } from 'react-native';
import { getParameters, clearParameters } from '../configuration';
import { logoutEndpoint } from '../utils/endpoints';

const logout = async () => {
  const parameters = getParameters();
  const missingParamsMessage = 'Missing required parameter(s): ';
  let resolveFunction;
  let rejectFunction;

  // Se crea una promise para devolver, y se guardan
  // referencias a sus funciones de reject y resolve.
  const promise = new Promise((resolve, reject) => {
    resolveFunction = resolve;
    rejectFunction = reject;
  });

  // Handler para el evento url.
  const handleOpenUrl = event => {
    //  Obtiene la url a la que redirige el
    //  browser luego de realizado el logout.
    const urlCheck = event.url;
    //  Si la url es igual a la postLogoutRedirectUri
    //  setteada, se limpian los parámetros del componente
    //  de configuración que correspondan y se resuelve la
    //  promise. Si no, se rechaza la promise con un error.
    if (urlCheck === parameters.postLogoutRedirectUri.toLowerCase()) {
      clearParameters();
      resolveFunction(urlCheck);
    } else rejectFunction(Error('Invalid post logout redirect uri'));

    // Se elimina el handler para los eventos url.
    Linking.removeEventListener('url', handleOpenUrl);
  };

  try {
    Linking.addEventListener('url', handleOpenUrl);
    // Si hay un idToken y una postLogoutRedirectUri setteados,
    // se abre el browser para realizar el logout con idUruguay.
    if (parameters.idToken && parameters.postLogoutRedirectUri)
      await Linking.openURL(logoutEndpoint());
    else {
      // En caso de error, se elimina el handler y rechaza la promise.
      Linking.removeEventListener('url', handleOpenUrl);
      if (parameters.idToken)
        rejectFunction(Error(`${missingParamsMessage}postLogoutRedirectUri`));
      else if (parameters.postLogoutRedirectUri)
        rejectFunction(Error(`${missingParamsMessage}idTokenHint`));
      else
        rejectFunction(
          Error(`${missingParamsMessage}idTokenHint, postLogoutRedirectUri`),
        );
    }
  } catch (error) {
    // En caso de error, se elimina el handler y rechaza la promise.
    Linking.removeEventListener('url', handleOpenUrl);
    rejectFunction(Error("Couldn't make request"));
  }

  return promise;
};

export default logout;
