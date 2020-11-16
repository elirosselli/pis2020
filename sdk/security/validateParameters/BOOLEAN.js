import { PARAMETERS } from '../../utils/constants';
import ERRORS from '../../utils/errors';

const validateBOOLEAN = (type, value) => {
  // Se chequea que el valor sea booleano.
  const validBOOLEAN = typeof value === 'boolean';
  if (!validBOOLEAN && type === PARAMETERS.production) {
    throw ERRORS.INVALID_PRODUCTION;
  }
  return value;
};

export default validateBOOLEAN;
