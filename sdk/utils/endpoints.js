import { getParameters } from '../configuration';

const tokenEndpoint = 'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';

const loginEndpoint = () => {
  const { redirectUri, clientId, scope, state } = getParameters();
  return `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
};

const userInfoEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/userinfo';

const logoutEndpoint = () => {
  const { idToken, postLogoutRedirectUri, state } = getParameters();
  return `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}`;
};

export { loginEndpoint, userInfoEndpoint, tokenEndpoint, logoutEndpoint };
