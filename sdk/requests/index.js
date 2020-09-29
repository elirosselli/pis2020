/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';

export const REQUEST_TYPES = {
  LOGIN: 'login',
};

const makeRequest = (type, sdkIdUClientId) => {
  switch (type) {
    case REQUEST_TYPES.LOGIN: {
      return (
        sdkIdUClientId &&
        Linking.openURL(
          `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${sdkIdUClientId}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
        )
      );
    }
    default:
      return 'default value';
  }
};

export default makeRequest;
