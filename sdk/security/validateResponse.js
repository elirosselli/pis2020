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

// Genera un sting aleatorio de con formato UUID4
const generateRandomState = () => {
  const uuid = uuidv4();
  const seedArray = uuid.split('');
  for (let i = 0; i < uuid.length; i += 1) {
    if (isLetter(seedArray[i])) {
      seedArray[i] = seedArray[i].charCodeAt(0).toString();
    } else if (isDash(seedArray[i])) {
      seedArray[i] = Math.floor(Math.random() * 11);
    }
  }
  const randomSeed = seedArray.join('');
  // console.log(uuid, seedArray, randomSeed);
  const randomGenerator = new MersenneTwister(randomSeed);
  const state = randomGenerator.random_int().toString();
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
