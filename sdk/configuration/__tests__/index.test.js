import {
  getParameters,
  setParameters,
  clearParameters,
  resetParameters,
  eraseCode,
} from '../index';
import ERRORS from '../../utils/errors';

afterEach(() => jest.clearAllMocks());
beforeEach(() => resetParameters());

describe('configuration module', () => {
  it('calls configuration module with valid parameters', () => {
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
      scope: '',
      production: false,
    });
  });

  it('calls configuration module with invalid parameters', () => {
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
      clientId: 'client_code',
      clientSecret: 'client_secret',
    };
    const parameters5 = {
      clientId: '',
      clientSecret: 'clientSecret',
    };
    expect(getParameters()).toStrictEqual(emptyParameters);

    try {
      setParameters(parameters1);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }
    expect(getParameters()).toStrictEqual(emptyParameters);

    try {
      setParameters(parameters2);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_REDIRECT_URI);
    }
    expect(getParameters()).toStrictEqual(emptyParameters);

    try {
      setParameters(parameters3);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_SECRET);
    }
    expect(getParameters()).toStrictEqual(emptyParameters);

    try {
      setParameters(parameters4);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_CLIENT_ID);
    }
    expect(getParameters()).toStrictEqual(emptyParameters);

    const error = setParameters(parameters5);
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
      scope: '',
      production: false,
    });

    expect.assertions(11);
  });

  it('calls configuration module with undefined scope', () => {
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
      scope: '',
      production: false,
    };
    expect(getParameters()).toStrictEqual(emptyParameters);
    const response = setParameters({ scope: undefined });
    expect(response).toBe(ERRORS.NO_ERROR);
  });

  it('calls eraseCode', () => {
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
      scope: 'correctScope',
    });
  });

  it('calls configuration module with invalid parameter type', () => {
    try {
      setParameters({ 'wrong type': 'value' });
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_PARAMETER_TYPE);
    }
  });
});
