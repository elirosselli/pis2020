import { PARAMETERS } from '../utils/constants';
import ERRORS from '../utils/errors';
import validateParameters from '../security/validateParameters';

const parameters = {
  redirectUri: '',
  clientId: '',
  clientSecret: '',
  code: '',
  accessToken: '',
  refreshToken: '',
  tokenType: '',
  expiresIn: '',
  idToken: '',
  scope: '',
  production: false,
};

const getParameters = () => parameters;

const setParameters = params => {
  const validParameters = {};
  let error;

  // Se validan los parámetros con el módulo de seguridad.
  Object.keys(params).forEach(key => {
    if (params[key] !== '') {
      try {
        validParameters[key] = validateParameters(PARAMETERS[key], params[key]);
      } catch (err) {
        if (!error) error = err;
      }
    }
  });

  // En caso de haber errores, se devuelve el primero encontrado.
  if (error) throw error;

  // Si no hay errores, se settean los parámetros con los valores
  // devueltos por el módulo de seguridad.
  Object.keys(validParameters).forEach(key => {
    parameters[key] = validParameters[key];
  });

  // Se devuelve un mensaje de éxito.
  return ERRORS.NO_ERROR;
};

const clearParameters = () => {
  Object.keys(parameters).forEach(key => {
    if (
      key !== 'redirectUri' &&
      key !== 'clientId' &&
      key !== 'clientSecret' &&
      key !== 'production'
    )
      parameters[key] = '';
  });
};

const resetParameters = () => {
  Object.keys(parameters).forEach(key => {
    if (key !== 'production') parameters[key] = '';
  });
  parameters.production = false;
};

const eraseCode = () => {
  parameters.code = '';
};

export {
  getParameters,
  setParameters,
  clearParameters,
  resetParameters,
  eraseCode,
};
