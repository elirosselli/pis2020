import MersenneTwister from 'mersenne-twister';
import KJUR from 'jsrsasign';
import { decode } from 'base-64';

import { getParameters } from '../configuration';
import ERRORS from '../utils/errors';

// Genera un state aleatorio.
const generateRandomState = () => {
  const randomSeed = Math.floor(Math.random() * 9999999999999999);
  // Se genera un Mersenne Twister generator con la semilla aleatoria.
  // Mersenne Twister es un algoritmo que genera números pseudo aleatorios muy utilizado por su buena calidad.
  const randomGenerator = new MersenneTwister(randomSeed);
  // Se genera el state aleatorio basado en el algoritmo Mersenne Twister.
  const randomInt = randomGenerator.random_int();
  // Se devuelve el state.
  return randomInt.toString();
};

// Verifica que el sub obtenido del id token guardado en los parámetros
// coincide con el sub pasado como parámetro. Devuelve true en caso
// afirmativo y false en caso contrario.
const validateSub = sub => {
  const { idToken } = getParameters();
  try {
    const payloadObj = KJUR.jws.JWS.readSafeJSONString(
      decode(idToken.split('.')[1]),
    );
    return payloadObj.sub === sub;
  } catch (error) {
    throw ERRORS.INVALID_ID_TOKEN;
  }
};

export { generateRandomState, validateSub };
