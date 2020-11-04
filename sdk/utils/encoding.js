import { decode } from 'base-64';

const base64URLtoBase64 = input => {
  // Reemplazar caracteres no compatibles con base64.
  let res = input.replace(/-/g, '+').replace(/_/g, '/');

  // Rellenar con caracteres de relleno estandar de base64.
  const pad = input.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error(
        'InvalidLengthError: Input base64url string is the wrong length to determine padding',
      );
    }
    res += new Array(5 - pad).join('=');
  }

  return res;
};

const base64ToHex = str => {
  const raw = decode(str);
  let result = '';
  for (let i = 0; i < raw.length; i += 1) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : `0${hex}`;
  }
  return result.toUpperCase();
};

export { base64ToHex, base64URLtoBase64 };
