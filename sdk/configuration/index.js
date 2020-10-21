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

export { getParameters, setParameters, clearParameters };
