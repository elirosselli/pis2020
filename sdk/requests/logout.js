import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { logoutEndpoint } from '../utils/endpoints';
import { getParameters, clearParameters } from '../configuration';

const logout = async () => {
  const parameters = getParameters();
  // const logoutEndpointWithParams = `${logoutEndpoint}?id_token_hint=${parameters.idToken}&post_logout_redirect_uri=${parameters.postLogoutRedirectUri}&state=${parameters.state}`;
  try {
    const response = await fetch(logoutEndpoint(), {
      method: 'GET',
      pkPinning: Platform.OS === 'ios',
      sslPinning: {
        certs: ['certificate'],
      },
    });
    const { status } = response;
    const urlCheck = await response.url;
    const missingParamsMessage = 'Missing required parameter(s): ';

    if (parameters.postLogoutRedirectUri && parameters.idToken) {
      if (status === 200) {
        if (urlCheck === logoutEndpoint()) {
          const state = urlCheck.match(/&state=([^&]+)/);
          clearParameters();
          if (state) return Promise.resolve(state[1]);
          return Promise.resolve();
        }
        return Promise.reject(Error('Invalid returned url'));
      }
      return Promise.reject(Error('Response status not OK'));
    }
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
    return Promise.reject(error);
  }
};

export default logout;
