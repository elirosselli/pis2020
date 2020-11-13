import {
  loginEndpoint,
  logoutEndpoint,
  tokenEndpoint,
  userInfoEndpoint,
  validateTokenEndpoint,
  issuer,
} from '../endpoints';
import { getParameters } from '../../configuration';

jest.mock('../../configuration');

const productionPrefix = 'https://auth.iduruguay.gub.uy/oidc/v1';
const developmentPrefix = 'https://auth-testing.iduruguay.gub.uy/oidc/v1';

afterEach(() => jest.clearAllMocks());

describe('endpoints', () => {
  it('calls login in production', () => {
    const scope = 'correctScope';
    const clientId = 'clientId';
    const redirectUri = 'redirectUri';
    const production = true;
    const loginEndpointValue = `${productionPrefix}/authorize?scope=openid%20${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

    getParameters.mockReturnValue({
      scope,
      clientId,
      redirectUri,
      production,
    });

    const returnedLoginEndpoint = loginEndpoint();
    expect(returnedLoginEndpoint).toBe(loginEndpointValue);
  });

  it('calls login in development', () => {
    const scope = 'correctScope';
    const clientId = 'clientId';
    const redirectUri = 'redirectUri';
    const production = false;
    const loginEndpointValue = `${developmentPrefix}/authorize?scope=openid%20${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

    getParameters.mockReturnValue({
      scope,
      clientId,
      redirectUri,
      production,
    });

    const returnedLoginEndpoint = loginEndpoint();
    expect(returnedLoginEndpoint).toBe(loginEndpointValue);
  });

  it('calls tokenEndpoint in production', () => {
    const production = true;
    const tokenEndpointValue = `${productionPrefix}/token`;

    getParameters.mockReturnValue({
      production,
    });

    const returnedTokenEndpoint = tokenEndpoint();
    expect(returnedTokenEndpoint).toBe(tokenEndpointValue);
  });

  it('calls tokenEndpoint in developmet', () => {
    const production = false;
    const tokenEndpointValue = `${developmentPrefix}/token`;

    getParameters.mockReturnValue({
      production,
    });

    const returnedTokenEndpoint = tokenEndpoint();
    expect(returnedTokenEndpoint).toBe(tokenEndpointValue);
  });

  it('calls userInfoEndpoint in production', () => {
    const production = true;
    const userInfoEndpointValue = `${productionPrefix}/userinfo`;

    getParameters.mockReturnValue({
      production,
    });

    const returnedUserInfoEndpoint = userInfoEndpoint();
    expect(returnedUserInfoEndpoint).toBe(userInfoEndpointValue);
  });

  it('calls userInfoEndpoint in development', () => {
    const production = false;
    const userInfoEndpointValue = `${developmentPrefix}/userinfo`;

    getParameters.mockReturnValue({
      production,
    });

    const returnedUserInfoEndpoint = userInfoEndpoint();
    expect(returnedUserInfoEndpoint).toBe(userInfoEndpointValue);
  });

  it('calls logoutEndpoint in production', () => {
    const idToken = 'idToken';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    const state = 'correctState';
    const production = true;
    const logoutEndpointValue = `${productionPrefix}/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}`;

    getParameters.mockReturnValue({
      production,
      idToken,
      postLogoutRedirectUri,
      state,
    });

    const returnedLogoutEndpoint = logoutEndpoint();
    expect(returnedLogoutEndpoint).toBe(logoutEndpointValue);
  });

  it('calls logoutEndpoint in development', () => {
    const idToken = 'idToken';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    const state = 'correctState';
    const production = false;
    const logoutEndpointValue = `${developmentPrefix}/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}`;

    getParameters.mockReturnValue({
      production,
      idToken,
      postLogoutRedirectUri,
      state,
    });

    const returnedLogoutEndpoint = logoutEndpoint();
    expect(returnedLogoutEndpoint).toBe(logoutEndpointValue);
  });

  it('calls jwks in production', () => {
    const production = true;
    const jwksEndpointValue = `${productionPrefix}/jwks`;

    getParameters.mockReturnValue({
      production,
    });

    const returnedJWKSEndpoint = validateTokenEndpoint();
    expect(returnedJWKSEndpoint).toBe(jwksEndpointValue);
  });

  it('calls jwks in developmet', () => {
    const production = false;
    const jwksEndpointValue = `${developmentPrefix}/jwks`;

    getParameters.mockReturnValue({
      production,
    });

    const returnedJWKSEndpoint = validateTokenEndpoint();
    expect(returnedJWKSEndpoint).toBe(jwksEndpointValue);
  });

  it('calls issuer in production', () => {
    const production = true;
    const issuerValue = `${productionPrefix}`;

    getParameters.mockReturnValue({
      production,
    });

    const returnedIssuer = issuer();
    expect(returnedIssuer).toBe(issuerValue);
  });

  it('calls issuer in developmet', () => {
    const production = false;
    const issuerValue = `${developmentPrefix}`;

    getParameters.mockReturnValue({
      production,
    });

    const returnedIssuer = issuer();
    expect(returnedIssuer).toBe(issuerValue);
  });
});
