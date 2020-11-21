import { generateRandomState, validateSub } from '../validateResponse';
import { getParameters, setParameters } from '../../configuration';
import ERRORS from '../../utils/errors';

jest.mock('../../configuration');

jest.mock('uuid', () =>
  jest.fn().mockReturnValue('b5be6251-9589-43bf-b12f-f6447dc179c0'),
);

const mockState = 3035783770;
jest.mock(
  'mersenne-twister',
  () =>
    function mockMersenne() {
      return {
        random_int: jest.fn(() => mockState),
      };
    },
);

const mockSub = '5859';
jest.mock('jsrsasign', () => ({
  __esModule: true,
  default: {
    jws: {
      JWS: { readSafeJSONString: jest.fn(() => ({ sub: mockSub })) },
    },
  },
}));

describe('validateResponse', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls generateRandomState and sets state correctly', async () => {
    const expectedParameters = { state: mockState.toString() };
    generateRandomState();
    expect(setParameters).toHaveBeenCalledTimes(1);
    expect(setParameters).toHaveBeenCalledWith(expectedParameters);
  });

  it('calls validate sub and subs match', async () => {
    getParameters.mockReturnValue({
      idToken:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw',
    });
    const correctSub = '5859';
    const isValid = validateSub(correctSub);
    expect(isValid).toBe(true);
  });

  it('calls validate sub and subs do not match', async () => {
    getParameters.mockReturnValue({
      idToken:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw',
    });
    const incorrectSub = '1234';
    const isValid = validateSub(incorrectSub);
    expect(isValid).toBe(false);
  });

  it('calls validate sub with incorrectly encoded idToken', async () => {
    getParameters.mockReturnValue({
      idToken: 'id.token',
    });

    const sub = '5859';

    try {
      validateSub(sub);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_ID_TOKEN);
    }
    expect.assertions(1);
  });
});
