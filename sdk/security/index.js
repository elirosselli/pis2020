export const validateTokenSecurity = jwksResponse =>
  Promise.resolve({jwk: jwksResponse, error: 'Correcto'});

export default validateTokenSecurity;
