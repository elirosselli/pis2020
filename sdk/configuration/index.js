import { PARAMETERS, ERRORS } from '../utils/constants';
import { validateParameters } from '../security';

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
  postLogoutRedirectUri: '',
  state: '',
  scope: '',
  production: false,
};

const getParameters = () => parameters;

const setParameters = params => {
  const sanitaizedParameters = {};
  let error;

  // Se validan los parámetros con el módulo de seguridad.
  Object.keys(params).forEach(key => {
    if (params[key] !== '') {
      try {
        sanitaizedParameters[key] = validateParameters(
          PARAMETERS[key],
          params[key],
        );
      } catch (err) {
        if (!error) error = err;
      }
    }
  });

  // En caso de haber errores, se devuelve el primero encontrado.
  if (error) return error;

  // Si no hay errores, se settean los parámetros con los valores
  // devueltos por el módulo de seguridad.
  Object.keys(sanitaizedParameters).forEach(key => {
    parameters[key] = sanitaizedParameters[key];
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
      key !== 'postLogoutRedirectUri' &&
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
