/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';

export function login(sdkIdUClientId) {

  console.log('Eli reza para que funcione')
  return Linking.openURL(
    `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${sdkIdUClientId}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
  );
}
