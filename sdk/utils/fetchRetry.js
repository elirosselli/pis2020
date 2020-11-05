import { fetch } from 'react-native-ssl-pinning';

const fetchWrapper = (url, options, n) => {
  const fetchOptions = { ...options };
  return fetch(url, fetchOptions).catch(error => {
    if (n === 1) throw error;
    return fetchWrapper(url, fetchOptions, n - 1);
  });
};

export default fetchWrapper;
