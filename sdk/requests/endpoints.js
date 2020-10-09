import { getParameters } from '../configuration';

const tokenEndpoint = 'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';

const loginEndpoint = () => {
  const { redirectUri, clientId } = getParameters();
  return `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
};

const userInfoEndpoint = accessToken =>
  `https://auth-testing.iduruguay.gub.uy/oidc/v1/userinfo?authorization=${accessToken}`;

const logoutEndpoint = (idToken, postLogoutRedirectUri) =>
  `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}`;

export { loginEndpoint, userInfoEndpoint, tokenEndpoint, logoutEndpoint };
