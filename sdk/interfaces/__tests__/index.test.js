import { initialize } from '../index';
import { getParameters, resetParameters } from '../../configuration';
import ERRORS from '../../utils/errors';
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
      production: false,
    };
    const errorResponse = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.production,
    );
    expect(errorResponse).toStrictEqual({
      errorCode: ERRORS.NO_ERROR.errorCode,
      errorDescription: ERRORS.NO_ERROR.errorDescription,
      message: ERRORS.NO_ERROR,
    });
    const { redirectUri, clientId, clientSecret } = getParameters();
    expect(redirectUri).toStrictEqual(parameters.redirectUri);
    expect(clientId).toStrictEqual(parameters.clientId);
    expect(clientSecret).toStrictEqual(clientSecret);
  });

  it('returns error when clientId is empty', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: '',
      clientSecret: 'clientSecret',
      production: false,
    };
    const errorResponse = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.production,
    );
    expect(errorResponse).toBe(ERRORS.INVALID_CLIENT_ID);
    const { redirectUri, clientId, clientSecret } = getParameters();
    // Serán vacíos ya que no se setean
    expect(redirectUri).toStrictEqual('');
    expect(clientId).toStrictEqual('');
    expect(clientSecret).toStrictEqual('');
  });

  it('returns error when redirectUri is empty', () => {
    const parameters = {
      redirectUri: '',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      production: false,
    };
    const errorResponse = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.production,
    );
    expect(errorResponse).toBe(ERRORS.INVALID_REDIRECT_URI);
    const { redirectUri, clientId, clientSecret } = getParameters();
    // Serán vacíos ya que no se setean
    expect(redirectUri).toStrictEqual('');
    expect(clientId).toStrictEqual('');
    expect(clientSecret).toStrictEqual('');
  });

  it('returns error when clientSecret is empty', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: '',
      production: false,
    };
    const errorResponse = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.production,
    );
    expect(errorResponse).toBe(ERRORS.INVALID_CLIENT_SECRET);
    const { redirectUri, clientId, clientSecret } = getParameters();
    // Serán vacíos ya que no se setean
    expect(redirectUri).toStrictEqual('');
    expect(clientId).toStrictEqual('');
    expect(clientSecret).toStrictEqual('');
  });

  it('returns error when production is empty', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      production: '',
    };
    const errorResponse = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.production,
    );
    expect(errorResponse).toBe(ERRORS.INVALID_PRODUCTION);
    const { redirectUri, clientId, clientSecret } = getParameters();
    // Serán vacíos ya que no se setean
    expect(redirectUri).toStrictEqual('');
    expect(clientId).toStrictEqual('');
    expect(clientSecret).toStrictEqual('');
  });

  it('does not return error when all parameters are setted', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      production: false,
    };
    const errorResponse = initializeErrors(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.production,
    );
    expect(errorResponse).toBe(undefined);
  });
});
