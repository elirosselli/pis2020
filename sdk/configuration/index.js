const parameters = {
  redirectUri: '',
  clientId: '',
  clientSecret: '',
  code: '',
};

const getParameters = () => parameters;

const setParameters = params => {
  Object.keys(params).forEach(key => {
    if (params[key] !== '') parameters[key] = params[key];
  });
};

const clearParameters = () => {
  Object.keys(parameters).forEach(key => {
    parameters[key] = '';
  });
};

export { getParameters, setParameters, clearParameters };
