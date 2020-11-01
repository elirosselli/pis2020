import { getParameters } from '../configuration';

const tokenEndpoint = 'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';

const loginEndpoint = () => {
  const { redirectUri, clientId, scope } = getParameters();
  return `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
};

const userInfoEndpoint =
  'https://auth-testing.iduruguay.gub.uy/oidc/v1/userinfo';

const logoutEndpoint = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout`;

export { loginEndpoint, userInfoEndpoint, tokenEndpoint, logoutEndpoint };
