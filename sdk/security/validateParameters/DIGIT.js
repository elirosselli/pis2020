import { PARAMETERS, ERRORS } from '../../utils/constants';

const validateDIGIT = (type, value) => {
  let validDIGIT;
  // Se chequea que el valor no sea vacío.
  validDIGIT = !!value;
  // Se chequea que el valor sea del tipo number.
  validDIGIT = validDIGIT && typeof value === 'number';
  // Se chequea que el valor no sea mayor a un año en segundos.
  validDIGIT = validDIGIT && value < 31536000;
  if (!validDIGIT && type === PARAMETERS.expiresIn) {
    throw ERRORS.INVALID_EXPIRES_IN;
  }
  return value;
};

export default validateDIGIT;
