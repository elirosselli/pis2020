const params = {
  clientCode: undefined,
  clientSecret: undefined,
  clientId: undefined, 
};

const getParams = () => params;

const setParams = params => {
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined) params[key] = params[key];
  });
};

export { getParams, setParams };
