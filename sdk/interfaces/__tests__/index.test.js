import { initialize } from '../index';
import { getParameters } from '../../configuration';

jest.mock('../../requests');
afterEach(() => jest.clearAllMocks());

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
    };
    initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
    );
    const responseParameters = getParameters();
    expect(responseParameters.redirectUri).toStrictEqual(
      parameters.redirectUri,
    );
    expect(responseParameters.clientId).toStrictEqual(parameters.clientId);
    expect(responseParameters.clientSecret).toStrictEqual(
      parameters.clientSecret,
    );
  });
});
