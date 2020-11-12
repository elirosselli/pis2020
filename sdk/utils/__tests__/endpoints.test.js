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

describe('endpoints', () => {
  it('calls tokenEndpoint in production', () => {
    getParameters.mockReturnValue();
    const tokenEndpointValue = 'https://auth.iduruguay.gub.uy/oidc/v1/token';
    const production = true;

    // Mockear getParameters
    getParameters.mockReturnValue({
      production,
    });

    const returnedTokenEndpoint = tokenEndpoint();
    expect(returnedTokenEndpoint).toBe(tokenEndpointValue);
  });

  it('calls tokenEndpoint in developmet', () => {
    getParameters.mockReturnValue();
    const tokenEndpointValue =
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';
    const production = false;

    // Mockear getParameters
    getParameters.mockReturnValue({
      production,
    });

    const returnedTokenEndpoint = tokenEndpoint();
    expect(returnedTokenEndpoint).toBe(tokenEndpointValue);
  });

  it('calls login in production', () => {
    getParameters.mockReturnValue();
    const scope = 'scope';
    const clientId = 'clientId';
    const redirectUri = 'redirectUri';
    const loginEndpointValue = `https://auth.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    const production = true;

    // Mockear getParameters
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
    getParameters.mockReturnValue();
    const scope = 'scope';
    const clientId = 'clientId';
    const redirectUri = 'redirectUri';
    const loginEndpointValue = `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid%20${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    const production = false;

    // Mockear getParameters
    getParameters.mockReturnValue({
      scope,
      clientId,
      redirectUri,
      production,
    });

    const returnedLoginEndpoint = loginEndpoint();
    expect(returnedLoginEndpoint).toBe(loginEndpointValue);
  });

  it('calls userInfoEndpoint in production', () => {
    getParameters.mockReturnValue();
    const userInfoEndpointValue = `https://auth.iduruguay.gub.uy/oidc/v1/userinfo`;
    const production = true;

    // Mockear getParameters
    getParameters.mockReturnValue({
      production,
    });

    const returnedUserInfoEndpoint = userInfoEndpoint();
    expect(returnedUserInfoEndpoint).toBe(userInfoEndpointValue);
  });

  it('calls userInfoEndpoint in development', () => {
    getParameters.mockReturnValue();
    const userInfoEndpointValue = `https://auth-testing.iduruguay.gub.uy/oidc/v1/userinfo`;
    const production = false;

    // Mockear getParameters
    getParameters.mockReturnValue({
      production,
    });

    const returnedUserInfoEndpoint = userInfoEndpoint();
    expect(returnedUserInfoEndpoint).toBe(userInfoEndpointValue);
  });

  it('calls logoutEndpoint in production', () => {
    getParameters.mockReturnValue();
    const idToken = 'idToken';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    const state = 'state';
    const logoutEndpointValue = `https://auth.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}`;
    const production = true;

    // Mockear getParameters
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
    getParameters.mockReturnValue();
    const idToken = 'idToken';
    const postLogoutRedirectUri = 'postLogoutRedirectUri';
    const state = 'state';
    const logoutEndpointValue = `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}`;
    const production = false;

    // Mockear getParameters
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
    getParameters.mockReturnValue();
    const jwksEndpointValue = 'https://auth.iduruguay.gub.uy/oidc/v1/jwks';
    const production = true;

    // Mockear getParameters
    getParameters.mockReturnValue({
      production,
    });

    const returnedJWKSEndpoint = validateTokenEndpoint();
    expect(returnedJWKSEndpoint).toBe(jwksEndpointValue);
  });

  it('calls jwks in developmet', () => {
    getParameters.mockReturnValue();
    const jwksEndpointValue =
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/jwks';
    const production = false;

    // Mockear getParameters
    getParameters.mockReturnValue({
      production,
    });

    const returnedJWKSEndpoint = validateTokenEndpoint();
    expect(returnedJWKSEndpoint).toBe(jwksEndpointValue);
  });

  it('calls issuer in production', () => {
    getParameters.mockReturnValue();
    const issuerValue = 'https://auth.iduruguay.gub.uy/oidc/v1';
    const production = true;

    // Mockear getParameters
    getParameters.mockReturnValue({
      production,
    });

    const returnedIssuer = issuer();
    expect(returnedIssuer).toBe(issuerValue);
  });

  it('calls issuer in developmet', () => {
    getParameters.mockReturnValue();
    const issuerValue = 'https://auth-testing.iduruguay.gub.uy/oidc/v1';
    const production = false;

    // Mockear getParameters
    getParameters.mockReturnValue({
      production,
    });

    const returnedIssuer = issuer();
    expect(returnedIssuer).toBe(issuerValue);
  });
});
