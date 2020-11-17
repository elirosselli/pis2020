const REQUEST_TYPES = {
  LOGIN: 'login',
  GET_TOKEN: 'getToken',
  GET_REFRESH_TOKEN: 'getRefreshToken',
  GET_USER_INFO: 'getUserInfo',
  LOGOUT: 'logout',
  VALIDATE_TOKEN: 'validateToken',
};

const PARAMETERS = {
  redirectUri: 'redirectUri',
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  code: 'code',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  tokenType: 'tokenType',
  expiresIn: 'expiresIn',
  idToken: 'idToken',
  state: 'state',
  scope: 'scope',
  production: 'production',
};

// Lista de acr (Authentication Methods References) definidos por IDUruguay.
const ACR_LIST = [
  'urn:iduruguay:nid:0',
  'urn:iduruguay:nid:1',
  'urn:iduruguay:nid:2',
  'urn:iduruguay:nid:3',
];

// Lista de amr (Authentication Methods References) definidos por IDUruguay.
const AMR_LIST = [
  'urn:iduruguay:am:password',
  'urn:iduruguay:am:totp',
  'urn:iduruguay:am:ci',
  'urn:iduruguay:am:idp:ae:0',
  'urn:iduruguay:am:idp:ae:1',
  'urn:iduruguay:am:idp:ae:2',
  'urn:iduruguay:am:idp:ae:3',
];

// Nombres de las variables de mutex.
const MUTEX_NAMES = {
  getTokenOrRefresh: 'getTokenOrRefreshMutex',
}

export { REQUEST_TYPES, PARAMETERS, ACR_LIST, AMR_LIST, MUTEX_NAMES };
