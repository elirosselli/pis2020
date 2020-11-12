import { PARAMETERS } from '../../utils/constants';
import validateVSCHAR from './VSCHAR';
import validateNQCHAR from './NQCHAR';
import validateURIReference from './URIReference';
import validateDIGIT from './DIGIT';
import validateBOOLEAN from './BOOLEAN';

const validateParameters = (type, value) => {
  switch (type) {
    // Validar parámetros de tipo *VSCHAR.
    case PARAMETERS.clientId:
    case PARAMETERS.clientSecret:
    case PARAMETERS.code:
    case PARAMETERS.accessToken:
    case PARAMETERS.refreshToken:
    case PARAMETERS.state: {
      return validateVSCHAR(type, value);
    }

    // Validar parámetros de tipo URI-reference.
    case PARAMETERS.redirectUri:
    case PARAMETERS.postLogoutRedirectUri:
    case PARAMETERS.tokenType: {
      return validateURIReference(type, value);
    }

    // Validar parámetros de tipo *NQCHAR.
    case PARAMETERS.scope: {
      return validateNQCHAR(type, value);
    }

    // Validar parámetros de tipo DIGIT.
    case PARAMETERS.expiresIn: {
      return validateDIGIT(type, value);
    }

    // TODO:
    case PARAMETERS.idToken: {
      // return validateIdToken(type, value);
      return value;
    }

    // Validar parámetros de tipo BOOLEAN.
    case PARAMETERS.production: {
      return validateBOOLEAN(type, value);
    }

    default:
      throw Error('Invalid parameter type');
  }
};

export default validateParameters;
