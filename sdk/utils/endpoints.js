import { getParameters } from '../configuration';

const productionSuffix = 'https://auth.iduruguay.gub.uy/oidc/v1/';
const developmentSuffix = 'https://auth-testing.iduruguay.gub.uy/oidc/v1/';

const tokenEndpoint = () => {
  const { production } = getParameters();
  const endpointSuffix = production ? productionSuffix : developmentSuffix;
  return `${endpointSuffix}token`;
};

const loginEndpoint = () => {
  const { production, redirectUri, clientId, scope } = getParameters();
  const endpointSuffix = production ? productionSuffix : developmentSuffix;
  return `${endpointSuffix}authorize?scope=openid%20${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
};

const userInfoEndpoint = () => {
  const { production } = getParameters();
  const endpointSuffix = production ? productionSuffix : developmentSuffix;
  return `${endpointSuffix}userinfo`;
};

const logoutEndpoint = () => {
  const { production, idToken, postLogoutRedirectUri, state } = getParameters();
  const endpointSuffix = production ? productionSuffix : developmentSuffix;
  return `${endpointSuffix}logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}`;
};

export { loginEndpoint, userInfoEndpoint, tokenEndpoint, logoutEndpoint };
