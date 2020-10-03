const redirectUri = 'sdkIdU.testing%3A%2F%2Fauth';

const tokenEndpoint = 'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';

const loginEndpoint = clientId =>
  `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

const userInfoEndpoint = accessToken =>
  `https://auth-testing.iduruguay.gub.uy/oidc/v1/userinfo?authorization=${accessToken}`;

export { loginEndpoint, userInfoEndpoint, tokenEndpoint };
