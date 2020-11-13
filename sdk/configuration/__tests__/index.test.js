import {
  getParameters,
  setParameters,
  clearParameters,
  resetParameters,
  eraseCode,
} from '../index';
import { ERRORS } from '../../utils/constants';

afterEach(() => jest.clearAllMocks());
beforeEach(() => resetParameters());

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
      state: '',
      scope: '',
      production: false,
    };
    const parameters2 = {
      redirectUri: 'redirectUri',
      clientSecret: 'clientSecret',
    };
    const parameters3 = {
      clientId: 'clientId',
      code: 'correctCode',
    };
    const parameters4 = {
      clientId: 'clientId2',
      code: '',
    };
    const parameters5 = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 123,
      idToken: 'idToken',
    };
    const parameters6 = {
      production: true,
      scope: 'correctScope',
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
      state: '',
      scope: '',
      production: false,
    });
    setParameters(parameters3);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      code: 'correctCode',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
      production: false,
    });
    setParameters(parameters4);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId2',
      clientSecret: 'clientSecret',
      code: 'correctCode',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
      production: false,
    });
    setParameters(parameters5);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId2',
      clientSecret: 'clientSecret',
      code: 'correctCode',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 123,
      idToken: 'idToken',
      state: '',
      scope: '',
      production: false,
    });
    setParameters(parameters6);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId2',
      clientSecret: 'clientSecret',
      code: 'correctCode',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 123,
      idToken: 'idToken',
      state: '',
      production: true,
      scope: 'correctScope',
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
      state: '',
      scope: '',
      production: true,
    });
    resetParameters();
    expect(getParameters()).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
      production: false,
    });
  });

  it('eraseCode works correctly', () => {
    const parameters7 = {
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      code: 'correctCode',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 123,
      idToken: 'idToken',
      production: true,
      state: 'correctState',
      scope: 'correctScope',
    };
    setParameters(parameters7);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      code: 'correctCode',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 123,
      idToken: 'idToken',
      production: true,
      state: 'correctState',
      scope: 'correctScope',
    });
    eraseCode();
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      code: '',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 123,
      idToken: 'idToken',
      production: true,
      state: 'correctState',
      scope: 'correctScope',
    });
  });

  it('works correctly: sending invalid parameters', () => {
    const emptyParameters = {
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
      production: false,
    };
    const parameters1 = {
      clientId: 'client_id',
    };
    const parameters2 = {
      clientId: '',
      redirectUri: 'redirect_uri',
    };
    const parameters3 = {
      clientSecret: 'client_secret',
      code: 'correctCode',
    };
    const parameters4 = {
      clientId: '',
      clientSecret: 'clientSecret',
    };
    expect(getParameters()).toStrictEqual(emptyParameters);
    let error = setParameters(parameters1);
    expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    expect(getParameters()).toStrictEqual(emptyParameters);
    error = setParameters(parameters2);
    expect(error).toBe(ERRORS.INVALID_REDIRECT_URI);
    expect(getParameters()).toStrictEqual(emptyParameters);
    error = setParameters(parameters3);
    expect(error).toBe(ERRORS.INVALID_CLIENT_SECRET);
    expect(getParameters()).toStrictEqual(emptyParameters);
    error = setParameters(parameters4);
    expect(error).toBe(ERRORS.NO_ERROR);
    expect(getParameters()).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: 'clientSecret',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      state: '',
      scope: '',
      production: false,
    });
  });
});
