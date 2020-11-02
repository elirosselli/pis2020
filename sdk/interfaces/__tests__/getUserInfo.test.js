import { getUserInfo } from '../index';
import makeRequest from '../../requests';
import { ERRORS, REQUEST_TYPES } from '../../utils/constants';

jest.mock('../../requests');

afterEach(() => jest.clearAllMocks());

describe('getUserInfo', () => {
  it('calls getUserInfo and works correctly', async () => {
    const userInfo = {
      nombre_completo: 'test',
      primer_apellido: 'test',
      primer_nombre: 'testNombre',
      segundo_apellido: 'testApellido',
      segundo_nombre: 'testSegundoNombre',
      sub: '5968',
      uid: 'uy-cid-12345678',
    };
    makeRequest.mockReturnValue(Promise.resolve(userInfo));
    const response = await getUserInfo();
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.GET_USER_INFO);
    expect(response).toBe(userInfo);
  });

  it('calls getUserInfo and fails', async () => {
    makeRequest.mockReturnValue(Promise.reject(ERRORS.INVALID_TOKEN));
    try {
      await getUserInfo();
    } catch (err) {
      expect(err).toBe(ERRORS.INVALID_TOKEN);
    }
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(REQUEST_TYPES.GET_USER_INFO);
    expect.assertions(3);
  });
});
