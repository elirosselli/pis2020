import { getParameters, setParameters, clearParameters } from '../index';

describe('configuration module', () => {
  it('works correctly', () => {
    const parameters1 = {
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      postLogoutRedirectUri: '',
      state: '',
    };
    const parameters2 = {
      redirectUri: 'redirectUri',
      clientSecret: 'clientSecret',
    };
    const parameters3 = {
      clientId: 'clientId',
      code: 'code',
    };
    const parameters4 = {
      clientId: 'clientId2',
      code: '',
    };
    const parameters5 = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 'expiresIn',
      idToken: 'idToken',
    };
    const parameters = getParameters();
    expect(parameters).toStrictEqual(parameters1);
    setParameters(parameters2);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: '',
      clientSecret: 'clientSecret',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      postLogoutRedirectUri: '',
      state: '',
    });
    setParameters(parameters3);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      code: 'code',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      postLogoutRedirectUri: '',
      state: '',
    });
    setParameters(parameters4);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId2',
      clientSecret: 'clientSecret',
      code: 'code',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      postLogoutRedirectUri: '',
      state: '',
    });
    setParameters(parameters5);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId2',
      clientSecret: 'clientSecret',
      code: 'code',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 'expiresIn',
      idToken: 'idToken',
      postLogoutRedirectUri: '',
      state: '',
    });
    clearParameters();
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId2',
      clientSecret: 'clientSecret',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      postLogoutRedirectUri: '',
      state: '',
    });
  });
});
