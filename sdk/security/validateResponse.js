import uuidv4 from 'uuid';
import KJUR from 'jsrsasign';
import { decode } from 'base-64';

import { setParameters } from '../configuration';
// Genera un sting aleatorio de con formato UUID4
const generateRandomState = () => {
  const state = uuidv4();
  setParameters({ state });
};

const setSub = idToken => {
  const payloadObj = KJUR.jws.JWS.readSafeJSONString(
    decode(idToken.split('.')[1]),
  );
  setParameters({ sub: payloadObj.sub });
};

export { generateRandomState, setSub };
