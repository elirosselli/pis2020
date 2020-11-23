import { KJUR, KEYUTIL } from 'jsrsasign';
import { validateTokenSecurity } from '../index';
import { base64ToHex, base64URLtoBase64 } from '../../utils/encoding';
import { issuer } from '../../utils/endpoints';
import ERRORS from '../../utils/errors';

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

const idToken = 'header.payload';
const clientId = 'clientId';
const kid = 'kid';
const wrongKid = 'wrongKid';
const alg = 'alg';
const time = 'time';
const acr = 'urn:iduruguay:nid:0';
const acrWrong = 'WRONG_urn:iduruguay:nid:0';
const amr = ['urn:iduruguay:am:password', 'urn:iduruguay:am:totp'];
const amrWrong = ['urn:iduruguay:am:password', 'WRONG_urn:iduruguay:am:totp'];

const jwksResponse = {
  keys: [{ kid, alg }],
};
const pubKey = 'pubKey';

describe('validateToken', () => {
  it('validates token correctly', async () => {
    base64ToHex.mockImplementation(() => {});
    base64URLtoBase64.mockReturnValue(() => {});

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => true);
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({ kid }));
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      acr,
      amr,
    }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    const result = await validateTokenSecurity(
      jwksResponse,
      idToken,
      clientId,
      issuer(),
    );

    expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
      alg: [jwksResponse.keys[0].alg],
      iss: [issuer()],
      aud: [clientId],
      verifyAt: time,
    });
    expect(result).toStrictEqual({
      jwk: jwksResponse,
      message: ERRORS.NO_ERROR,
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
    });
  });

  it('does not validate token when readSafeJSONString throws error', async () => {
    base64ToHex.mockImplementation(() => {});
    base64URLtoBase64.mockReturnValue(() => {});

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => false);
    KJUR.jws.JWS.readSafeJSONString.mockImplementation(() => {
      throw new Error();
    });
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateTokenSecurity(jwksResponse, idToken, clientId, issuer());
    } catch (error) {
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer()],
        aud: [clientId],
        verifyAt: time,
      });
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(2);
  });

  it('not validates token (alg, iss, aud, expiration)', async () => {
    base64ToHex.mockImplementation(() => {});
    base64URLtoBase64.mockReturnValue(() => {});

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => false);
    KJUR.jws.JWS.readSafeJSONString.mockImplementation(() => ({ kid }));
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      acr,
      amr,
    }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateTokenSecurity(jwksResponse, idToken, clientId, issuer());
    } catch (error) {
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer()],
        aud: [clientId],
        verifyAt: time,
      });
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(2);
  });

  it('not validates token (alg, iss, aud, expiration)', async () => {
    base64ToHex.mockImplementation(() => {});
    base64URLtoBase64.mockReturnValue(() => {});

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => false);
    KJUR.jws.JWS.readSafeJSONString.mockImplementation(() => ({ kid }));
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      acr,
      amr,
    }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateTokenSecurity(jwksResponse, idToken, clientId, issuer());
    } catch (error) {
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer()],
        aud: [clientId],
        verifyAt: time,
      });
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(2);
  });

  it('not validates token (acr)', async () => {
    base64ToHex.mockImplementation(() => {});
    base64URLtoBase64.mockReturnValue(() => {});

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => true);
    KJUR.jws.JWS.readSafeJSONString.mockImplementation(() => ({ kid }));
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      acrWrong,
      amr,
    }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateTokenSecurity(jwksResponse, idToken, clientId, issuer());
    } catch (error) {
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer()],
        aud: [clientId],
        verifyAt: time,
      });
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(2);
  });

  it('not validates token (amr)', async () => {
    base64ToHex.mockImplementation(() => {});
    base64URLtoBase64.mockReturnValue(() => {});

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => true);
    KJUR.jws.JWS.readSafeJSONString.mockImplementation(() => ({ kid }));
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      acr,
      amrWrong,
    }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateTokenSecurity(jwksResponse, idToken, clientId, issuer());
    } catch (error) {
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer()],
        aud: [clientId],
        verifyAt: time,
      });
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(2);
  });

  it('not validates token (kid)', async () => {
    base64ToHex.mockImplementation(() => {});
    base64URLtoBase64.mockReturnValue(() => {});

    KJUR.jws.JWS.verifyJWT.mockImplementation(() => true);
    KJUR.jws.JWS.readSafeJSONString.mockImplementation(() => ({ wrongKid }));
    KJUR.jws.JWS.readSafeJSONString.mockImplementationOnce(() => ({
      acr,
      amr,
    }));
    KJUR.jws.IntDate.getNow.mockImplementation(() => time);
    KEYUTIL.getKey.mockImplementation(() => pubKey);

    try {
      await validateTokenSecurity(jwksResponse, idToken, clientId, issuer());
    } catch (error) {
      expect(KJUR.jws.JWS.verifyJWT).toHaveBeenCalledWith(idToken, pubKey, {
        alg: [jwksResponse.keys[0].alg],
        iss: [issuer()],
        aud: [clientId],
        verifyAt: time,
      });
      expect(error).toStrictEqual(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(2);
  });
});
