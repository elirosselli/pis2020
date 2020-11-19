import MersenneTwister from 'mersenne-twister';
import KJUR from 'jsrsasign';
import { decode } from 'base-64';

import { setParameters, getParameters } from '../configuration';

// Genera un state aleatorio.
const generateRandomState = () => {
  const randomSeed = Math.floor(Math.random() * 9999999999999999);
  // Se genera un Mersenne Twister generator con la semilla aleatoria.
  // Mersenne Twister es un algoritmo que genera números pseudo aleatorios muy utilizado por su buena calidad.
  const randomGenerator = new MersenneTwister(randomSeed);
  // Se genera el state aleatorio basado en el algoritmo Mersenne Twister.
  const randomInt = randomGenerator.random_int();
  const state = randomInt.toString();
  // Se settea el state a utilizar.
  setParameters({ state });
};

// Verifica que el sub obtenido del id token guardado en los parámetros
// coincide con el sub pasado como parámetro. Devuelve true en caso
// afirmativo y false en caso contrario.
const validateSub = sub => {
  const { idToken } = getParameters();
  const payloadObj = KJUR.jws.JWS.readSafeJSONString(
    decode(idToken.split('.')[1]),
  );
  return payloadObj.sub === sub;
};

export { generateRandomState, validateSub };
