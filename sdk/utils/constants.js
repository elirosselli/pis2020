import { Mutex } from 'async-mutex';

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

// Mutex (semáforo binario), para prevenir
// que la funciones puedan ser llamadas cuando existe
// una ejecución de la función en curso.

const loginMutex = new Mutex();
const getTokenOrRefreshMutex = new Mutex();
const getUserInfoMutex = new Mutex();
const logoutMutex = new Mutex();
const validateTokenMutex = new Mutex();

const MUTEX = {
  loginMutex,
  getTokenOrRefreshMutex,
  getUserInfoMutex,
  logoutMutex,
  validateTokenMutex,
};

export { REQUEST_TYPES, PARAMETERS, ACR_LIST, AMR_LIST, MUTEX };
