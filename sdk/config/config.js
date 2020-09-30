const sdkClientID = {
  clientCode: undefined,
  clientSecret: undefined,
};

export const getSdkClientId = () => sdkClientID;

export const setSdkClientId = params => {
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined) sdkClientID[key] = params[key];
  });
};