/* eslint-disable import/prefer-default-export */
import makeRequest, { REQUEST_TYPES } from '../requests';

const login = clientId => {
  makeRequest(REQUEST_TYPES.LOGIN, clientId);
};

export { login };
