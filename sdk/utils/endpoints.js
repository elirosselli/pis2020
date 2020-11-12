import { getParameters } from '../configuration';

const productionPrefix = 'https://auth.iduruguay.gub.uy/oidc/v1';
const developmentPrefix = 'https://auth-testing.iduruguay.gub.uy/oidc/v1';

const tokenEndpoint = () => {
  const { production } = getParameters();
  const endpointPrefix = production ? productionPrefix : developmentPrefix;
  return `${endpointPrefix}/token`;
};

const loginEndpoint = () => {
  const { production, redirectUri, clientId, scope } = getParameters();
  const endpointPrefix = production ? productionPrefix : developmentPrefix;
  return `${endpointPrefix}/authorize?scope=openid%20${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
};

const userInfoEndpoint = () => {
  const { production } = getParameters();
  const endpointPrefix = production ? productionPrefix : developmentPrefix;
  return `${endpointPrefix}/userinfo`;
};

const logoutEndpoint = () => {
  const { production, idToken, postLogoutRedirectUri, state } = getParameters();
  const endpointPrefix = production ? productionPrefix : developmentPrefix;
  return `${endpointPrefix}/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}`;
};

const validateTokenEndpoint = () => {
  const { production } = getParameters();
  const endpointPrefix = production ? productionPrefix : developmentPrefix;
  return `${endpointPrefix}/jwks`;
};

const issuer = () => {
  const { production } = getParameters();
  const endpointPrefix = production ? productionPrefix : developmentPrefix;
  return `${endpointPrefix}`;
};

export {
  loginEndpoint,
  userInfoEndpoint,
  tokenEndpoint,
  logoutEndpoint,
  validateTokenEndpoint,
  issuer,
};
