const variables = {
  development: {
    sdkIdUClientId: '894329',
  },
  production: {
    sdkIdUClientId: 'YOUR_API_KEY',
  },
};

const getEnvVariables = () => {
  if (__DEV__) {
    return variables.development; // return this if in development mode
  }
  return variables.production; // otherwise, return this
};

export default getEnvVariables; // export a reference to the function
