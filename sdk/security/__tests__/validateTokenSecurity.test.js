import { KJUR, KEYUTIL } from 'jsrsasign';
import { validateTokenSecurity } from '../index';
import { getParameters } from '../../configuration';
import { base64ToHex, base64URLtoBase64 } from '../../utils/encoding';
import { issuer } from '../../utils/endpoints';
import { ERRORS } from '../../utils/constants';

jest.mock('../../configuration');
jest.mock('../../utils/encoding', () => ({
  base64ToHex: jest.fn(),
  base64URLtoBase64: jest.fn(),
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

const idToken = 'idToken';
const clientId = 'clientId';
const kid = 'kid';
const wrongKid = 'wrongKid';
const alg = 'alg';
const time = 'time';
const jwksResponse = {
  keys: [{ kid, alg }],
};
const pubKey = 'pubKey';

describe('validateToken', () => {
  it('validates token correctly', async () => {
    getParameters.mockReturnValue({
      idToken,
      clientId,
    });
    base64ToHex.mockImplementation(() => {});
    base64URLtoBase64.mockReturnValue(() => {});

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => true);
    KJUR.jws.JWS.readSafeJSONString.mockImplementation(() => ({ kid }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    const result = await validateTokenSecurity(jwksResponse);

    expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
      alg: [jwksResponse.keys[0].alg],
      iss: [issuer],
      aud: [getParameters().clientId],
      verifyAt: time,
    });
    expect(result).toStrictEqual({
      jwk: jwksResponse,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('not validates token (payload)', async () => {
    getParameters.mockReturnValue({
      idToken,
      clientId,
    });
    base64ToHex.mockImplementation(() => {});
    base64URLtoBase64.mockReturnValue(() => {});

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => false);
    KJUR.jws.JWS.readSafeJSONString.mockImplementation(() => ({ kid }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateTokenSecurity(jwksResponse);
    } catch (error) {
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer],
        aud: [getParameters().clientId],
        verifyAt: time,
      });
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(2);
  });

  it('not validates token (kid)', async () => {
    getParameters.mockReturnValue({
      idToken,
      clientId,
    });
    base64ToHex.mockImplementation(() => {});
    base64URLtoBase64.mockReturnValue(() => {});

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => true);
    KJUR.jws.JWS.readSafeJSONString.mockImplementation(() => ({ wrongKid }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateTokenSecurity(jwksResponse);
    } catch (error) {
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer],
        aud: [getParameters().clientId],
        verifyAt: time,
      });
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(2);
  });

  it('not validates token (clientId empty)', async () => {
    getParameters.mockReturnValue({
      idToken,
    });

    try {
      await validateTokenSecurity(jwksResponse);
    } catch (error) {
      expect(error).toStrictEqual(ERRORS.INVALID_CLIENT_ID);
    }
    expect.assertions(1);
  });

  it('not validates token (idToken empty)', async () => {
    getParameters.mockReturnValue({
      clientId,
    });

    try {
      await validateTokenSecurity(jwksResponse);
    } catch (error) {
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(1);
  });
});
