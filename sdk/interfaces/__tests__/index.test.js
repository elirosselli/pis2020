import { initialize } from '../index';
import { getParameters, resetParameters } from '../../configuration';
import { ERRORS } from '../../utils/constants';
import { initializeErrors } from '../../utils/helpers';

jest.mock('../../requests');
afterEach(() => jest.clearAllMocks());
beforeEach(() => resetParameters());

const mockAddEventListener = jest.fn();
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
}));

describe('initialize', () => {
  it('works correctly', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    };
    const errorResponse = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.postLogoutRedirectUri,
    );
    expect(errorResponse).toStrictEqual({
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      message: ERRORS.NO_ERROR,
    });
    // const responseParameters = getParameters();
    const {
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
    } = getParameters();
    expect(redirectUri).toStrictEqual(parameters.redirectUri);
    expect(clientId).toStrictEqual(parameters.clientId);
    expect(clientSecret).toStrictEqual(clientSecret);
    expect(postLogoutRedirectUri).toStrictEqual(
      parameters.postLogoutRedirectUri,
    );
  });

  it('returns error when clientId is empty', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: '',
      clientSecret: 'clientSecret',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    };
    const errorResponse = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.postLogoutRedirectUri,
    );
    expect(errorResponse).toBe(ERRORS.INVALID_CLIENT_ID);
    const {
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
    } = getParameters();
    // Serán vacíos ya que no se setean
    expect(redirectUri).toStrictEqual('');
    expect(clientId).toStrictEqual('');
    expect(clientSecret).toStrictEqual('');
    expect(postLogoutRedirectUri).toStrictEqual('');
  });

  it('returns error when redirectUri is empty', () => {
    const parameters = {
      redirectUri: '',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    };
    const errorResponse = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.postLogoutRedirectUri,
    );
    expect(errorResponse).toBe(ERRORS.INVALID_REDIRECT_URI);
    const {
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
    } = getParameters();
    // Serán vacíos ya que no se setean
    expect(redirectUri).toStrictEqual('');
    expect(clientId).toStrictEqual('');
    expect(clientSecret).toStrictEqual('');
    expect(postLogoutRedirectUri).toStrictEqual('');
  });

  it('returns error when postLogoutRedirectUri is empty', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      postLogoutRedirectUri: '',
    };
    const errorResponse = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.postLogoutRedirectUri,
    );
    expect(errorResponse).toBe(ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI);
    const {
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
    } = getParameters();
    // Serán vacíos ya que no se setean
    expect(redirectUri).toStrictEqual('');
    expect(clientId).toStrictEqual('');
    expect(clientSecret).toStrictEqual('');
    expect(postLogoutRedirectUri).toStrictEqual('');
  });

  it('returns error when clientSecret is empty', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: '',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    };
    const errorResponse = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.postLogoutRedirectUri,
    );
    expect(errorResponse).toBe(ERRORS.INVALID_CLIENT_SECRET);
    const {
      redirectUri,
      clientId,
      clientSecret,
      postLogoutRedirectUri,
    } = getParameters();
    // Serán vacíos ya que no se setean
    expect(redirectUri).toStrictEqual('');
    expect(clientId).toStrictEqual('');
    expect(clientSecret).toStrictEqual('');
    expect(postLogoutRedirectUri).toStrictEqual('');
  });

  it('returns error with all parameters setted', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    };
    const errorResponse = initializeErrors(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.postLogoutRedirectUri,
    );
    expect(errorResponse).toBe(undefined);
  });
});
