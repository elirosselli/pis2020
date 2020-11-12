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
};

const getParameters = () => parameters;

const setParameters = params => {
  Object.keys(params).forEach(key => {
    if (params[key] !== '') parameters[key] = params[key];
  });
};

const clearParameters = () => {
  Object.keys(parameters).forEach(key => {
    if (
      key !== 'redirectUri' &&
      key !== 'clientId' &&
      key !== 'clientSecret' &&
      key !== 'postLogoutRedirectUri'
    )
      parameters[key] = '';
  });
};

const resetParameters = () => {
  Object.keys(parameters).forEach(key => {
    parameters[key] = '';
  });
};

const eraseCode = () => {
  parameters.code = '';
};

const eraseState = () => {
  parameters.state = '';
};

export {
  getParameters,
  setParameters,
  clearParameters,
  resetParameters,
  eraseCode,
  eraseState,
};
