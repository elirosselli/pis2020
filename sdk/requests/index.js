/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';

export function login(sdkIdUClientId) {
  let resolveFunction;
  let rejectFunction;
  const promise = new Promise((resolve, reject) => {
    resolveFunction = resolve;
    rejectFunction = reject;
  });

  const handleOpenUrl = event => {
    const code = event.url.match(/\?code=([^&]+)/)
    if (code) resolveFunction(code[1]);
    else rejectFunction(Error('Invalid authorization code'));
  };

  Linking.addEventListener('url', handleOpenUrl);

  Linking.openURL(
    `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${sdkIdUClientId}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
  );

  return promise;
}
