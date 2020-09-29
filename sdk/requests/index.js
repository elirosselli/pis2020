/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';

export function login(sdkIdUClientId) {
  let resolve;
  // eslint-disable-next-line no-unused-vars
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
  });

  const handleOpenUrl = url => {
    resolve(url.url);
  };

  Linking.addEventListener('url', handleOpenUrl);

  Linking.openURL(
    `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${sdkIdUClientId}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
  );

  return promise;
}
