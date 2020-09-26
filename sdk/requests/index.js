/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';

export const makeRequest = (type, sdkIdUClientId) => {
  console.log('type ', type);
  switch (type) {
    case 'login': {
      return (
        sdkIdUClientId &&
        Linking.openURL(
          `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${sdkIdUClientId}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
        )
      );
      break;
    }
    default:
      return console.log('default value');
  }
};
