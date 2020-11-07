import MersenneTwister from 'mersenne-twister';
import uuidv4 from 'uuid';
import KJUR from 'jsrsasign';
import { decode } from 'base-64';

import { setParameters, getParameters } from '../configuration';

const isLetter = char => {
  const n = char.charCodeAt(0);
  return (n >= 65 && n < 91) || (n >= 97 && n < 123);
};

const isDash = char => char.includes('-');

// Genera un state aleatorio
const generateRandomState = () => {
  // Se genera un random uuid
  const uuid = uuidv4();
  const seedArray = uuid.split('');
  // Se cambian letras por codigo ascii y guiones por random number
  for (let i = 0; i < uuid.length; i += 1) {
    if (isLetter(seedArray[i])) {
      seedArray[i] = seedArray[i].charCodeAt(0).toString();
    } else if (isDash(seedArray[i])) {
      seedArray[i] = Math.floor(Math.random() * 11);
    }
  }
  // Se corta en 16 digitos la semilla
  const randomSeed = parseInt(seedArray.join('').slice(0, 15), 10);
  // Se genera un Mersenne Twister generator con la semilla random
  const randomGenerator = new MersenneTwister(randomSeed);
  // Se genera el random state basado en el algoritmo Mersenne Twister
  const randomInt = randomGenerator.random_int();
  const state = randomInt.toString();
  // Se setea el state a utilizar
  setParameters({ state });
};

const validateSub = sub => {
  const { idToken } = getParameters();
  const payloadObj = KJUR.jws.JWS.readSafeJSONString(
    decode(idToken.split('.')[1]),
  );
  return payloadObj.sub === sub;
};

export { generateRandomState, validateSub };