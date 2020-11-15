import { KJUR, KEYUTIL } from 'jsrsasign';
import { fetch } from 'react-native-ssl-pinning';
import { ERRORS } from '../../utils/constants';
import { validateToken } from '../../interfaces';

import {
  setParameters,
  getParameters,
  resetParameters,
} from '../../configuration';

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

jest.mock('jsrsasign', () => ({
  KEYUTIL: {
    getKey: jest.fn(),
  },
  KJUR: {
    jws: {
      JWS: { verifyJWT: jest.fn(), readSafeJSONString: jest.fn() },
      IntDate: { getNow: jest.fn() },
    },
  },
}));

afterEach(() => jest.clearAllMocks());

beforeEach(() => {
  resetParameters();
});

const idToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw';
const clientId = 'clientId';

const kid = 'kid';
const wrongKid = 'wrongKid';
const time = 'time';
const issuer = 'https://auth-testing.iduruguay.gub.uy/oidc/v1';
const pubKey = 'pubKey';

const acr = 'urn:iduruguay:nid:0';
const acrWrong = 'WRONG_urn:iduruguay:nid:0';
const amr = ['urn:iduruguay:am:password', 'urn:iduruguay:am:totp'];
const amrWrong = ['urn:iduruguay:am:password', 'WRONG_urn:iduruguay:am:totp'];

const jwksResponse = {
  keys: [
    {
      kty: 'RSA',
      alg: 'RS256',
      use: 'sig',
      kid: 'kid',
      x5c: ['x5c'],
      n: 'nValue',
      e: 'eValue',
    },
  ],
};

describe('configuration module and validate token integration', () => {
  it('calls setParameters and validateToken but fetch fails', async () => {
    setParameters({ clientId, idToken });
    fetch.mockImplementation(() =>
      Promise.reject(
        Error({
          status: 404,
          bodyString:
            '<h1>Not Found</h1><p>The requested URL /oidc/v1/jwksw was not found on this server.</p>',
          headers: {
            'Cache-Control': 'no-store',
            Connection: 'close',
            'Content-Length': '176',
            'Content-Type': 'text/html; charset=UTF-8',
            Date: 'Thu, 05 Nov 2020 18:06:45 GMT',
            Pragma: 'no-cache',
            Server: 'nginx/1.15.1',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY, SAMEORIGIN',
          },
        }),
      ),
    );
    try {
      await validateToken();
    } catch (error) {
      expect(error).toBe(ERRORS.FAILED_REQUEST);
    }
    expect.assertions(1);
  });

  it('calls setParameters and validateToken, with valid token', async () => {
    setParameters({ clientId, idToken });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(jwksResponse),
      }),
    );

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => true);
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({ kid }));
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      acr,
      amr,
    }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    const result = await validateToken();
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });
    expect(result).toStrictEqual({
      jwk: jwksResponse,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
    expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
      alg: [jwksResponse.keys[0].alg],
      iss: [issuer],
      aud: [parameters.clientId],
      verifyAt: time,
    });
  });

  it('calls setParameters and validateToken with valid client id and invalid token (alg, iss, aud, expiration), fetch not called', async () => {
    setParameters({ clientId, idToken });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => false);
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({ kid }));
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      acr,
      amr,
    }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN);
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer],
        aud: [parameters.clientId],
        verifyAt: time,
      });
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });
    expect.assertions(4);
  });

  it('calls setParameters and validateToken with valid clientId and invalid token (acr), fetch not called', async () => {
    setParameters({ clientId, idToken });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => true);
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({ kid }));
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      acrWrong,
      amr,
    }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN);
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer],
        aud: [parameters.clientId],
        verifyAt: time,
      });
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });
    expect.assertions(4);
  });

  it('calls setParameters and validateToken with valid clientId and invalid token (amr), fetch not called', async () => {
    setParameters({ clientId, idToken });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => true);
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({ kid }));
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      acr,
      amrWrong,
    }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateToken();
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN);
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer],
        aud: [parameters.clientId],
        verifyAt: time,
      });
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });
    expect.assertions(4);
  });

  it('calls setParameters and validateToken with invalid token (kid)', async () => {
    setParameters({ clientId, idToken });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => true);
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      wrongKid,
    }));
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      acr,
      amr,
    }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateToken();
    } catch (error) {
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer],
        aud: [parameters.clientId],
        verifyAt: time,
      });
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });
    expect.assertions(4);
  });

  it('calls setParameters and validateToken with valid clientId and invalid token (empty), fetch not called', async () => {
    setParameters({ clientId });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
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

    try {
      await validateToken();
    } catch (error) {
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId,
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
    expect.assertions(3);
  });

  it('calls setParameters and validateToken with invalid clientId (empty)', async () => {
    setParameters({ idToken });
    let parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });

    try {
      await validateToken();
    } catch (error) {
      expect(error).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    parameters = getParameters();
    expect(parameters).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken,
      state: '',
      scope: '',
      production: false,
    });
    expect.assertions(3);
  });
});
