import MersenneTwister from 'mersenne-twister';
import { generateRandomState, validateSub } from '../validateResponse';
import { getParameters, setParameters } from '../../configuration';

jest.mock('../../configuration');

// jest.mock('uuid', () => 'b5be6251-9589-43bf-b12f-f6447dc179c0');
jest.mock('uuid', () =>
  jest.fn().mockReturnValue('b5be6251-9589-43bf-b12f-f6447dc179c0'),
);
jest.mock('mersenne-twister/src/mersenne-twister', () => ({
  random_int: jest.fn(() => '3035783770'),
  MersenneTwister: jest.fn().mockImplementation(() => ({})),
  constructor: jest.fn().mockImplementation(() => ({})),
}));

describe('validateResponse', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls generateRandomState and sets state correctly', async () => {
    const expectedParameters = { state: '3035783770' };
    MersenneTwister.mockImplementation(() => ({}));
    generateRandomState();
    expect(setParameters).toHaveBeenCalledTimes(1);
    expect(setParameters).toHaveBeenCalledWith(expectedParameters);
    const { state } = getParameters();
    expect(state).toBe('3035783770');
  });

  it('calls validate sub and subs matches', async () => {
    getParameters.mockReturnValue({
      idToken:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw',
    });
    const correctSub = '5859';
    const isValid = validateSub(correctSub);
    expect(isValid).toBe(true);
  });
});
