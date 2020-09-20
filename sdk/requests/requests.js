import { Linking } from 'react-native';

export default function login(sdkIdUClientId) {
  return Linking.openURL(
    `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${sdkIdUClientId}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
  );
}
