/* eslint-disable import/prefer-default-export */
import { makeRequest } from '../requests';

export const login = clientId => {
  makeRequest('login', clientId);
};

export default login;
