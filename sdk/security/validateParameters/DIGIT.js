import { PARAMETERS } from '../../utils/constants';
import ERRORS from '../../utils/errors';

const validateDIGIT = (type, value) => {
  // Se chequea que el valor sea un número entero positivo
  // menos a un año en segundos.
  const validDIGIT =
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value > 0 &&
    value < 31536000;
  if (!validDIGIT && type === PARAMETERS.expiresIn) {
    throw ERRORS.INVALID_EXPIRES_IN;
  }
  return value;
};

export default validateDIGIT;
