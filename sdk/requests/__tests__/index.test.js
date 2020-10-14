import { fetch } from 'react-native-ssl-pinning';
import makeRequest, { REQUEST_TYPES } from '../index';
import { getParameters } from '../../configuration';

jest.mock('../../configuration');

const mockLinkingOpenUrl = jest.fn(() => Promise.resolve());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: mockLinkingOpenUrl,
}));

afterEach(() => jest.clearAllMocks());

describe('login', () => {
  it('calls login with clientId and redirectUri', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: 'redirectUri',
    });
    await makeRequest(REQUEST_TYPES.LOGIN);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=clientId&redirect_uri=redirectUri',
    );
  });

  it('calls login without clientId and with redirectUri', () => {
    getParameters.mockReturnValue({
      clientId: '',
      redirectUri: 'redirectUri',
    });
    const response = makeRequest(REQUEST_TYPES.LOGIN);
    expect(response).toBe('');
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
  });

  it('calls login with clientId and without redirectUri', async () => {
    getParameters.mockReturnValue({
      clientId: 'clientId',
      redirectUri: '',
    });
    await makeRequest(REQUEST_TYPES.LOGIN);
    expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=clientId&redirect_uri=',
    );
  });
});

jest.mock('react-native-ssl-pinning', () => ({
  fetch: jest.fn(),
}));

describe('getToken', () => {
  it('calls getToken with correct code', async () => {
    // Mockear la funcion fetch
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: 'c9747e3173544b7b870d48aeafa0f661',
            expires_in: 3600,
            id_token:
              'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw',
            refresh_token: '041a156232ac43c6b719c57b7217c9ee',
            token_type: 'bearer',
          }),
      }),
    );

    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const code = 'f24df0c4fcb142328b843d49753946af';
    const redirectUri = 'uri';
    const tokenEndpoint = 'https://auth-testing.iduruguay.gub.uy/oidc/v1/token';

    // Mockear getParameters
    getParameters.mockReturnValue({
      clientId,
      clientSecret,
      redirectUri,
      code,
    });

    const encodedCredentials =
      'ODk4NTYyOmNkYzA0ZjE5YWMyczJmNWg4ZjZ3ZTZkNDJiMzdlODVhNjNmMXcyZTVmNnNkOGE0NDg0YjZiOTRi';

    const response = await makeRequest(REQUEST_TYPES.GET_TOKEN);

    expect.assertions(2);

    // Chequeo de parametros enviados
    expect(fetch).toHaveBeenCalledWith(tokenEndpoint, {
      method: 'POST',
      sslPinning: {
        certs: ['certificate'],
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
    });

    // Chequeo de respuestas
    expect(response).toBe('c9747e3173544b7b870d48aeafa0f661');
  });

  it('calls get token with incorrect code', async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error: 'invalid_grant',
            error_description:
              'The provided authorization grant or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client',
          }),
      }),
    );

    const response = makeRequest(REQUEST_TYPES.GET_TOKEN);
    expect.assertions(1);
    expect(response).rejects.toEqual({
      error: 'invalid_grant',
      error_description:
        'The provided authorization grant or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client',
    });
  });

  it('calls get token with incorrect clientId or clientSecret', async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            error: 'invalid_client',
            error_description:
              'Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method)',
          }),
      }),
    );
    const clientId = '898562';
    const clientSecret =
      'cdc04f19ac2s2f5h8f6we6d42b37e85a63f1w2e5f6sd8a4484b6b94b';
    const code = 'f24df0c4fcb142328b843d4975saddf'; // Incorrect

    const response = makeRequest(
      REQUEST_TYPES.GET_TOKEN,
      clientId,
      clientSecret,
      code,
    );
    expect.assertions(1);
    return expect(response).rejects.toEqual({
      error: 'invalid_client',
      error_description:
        'Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method)',
    });
  });
});

describe('default', () => {
  it('calls default with clientId', () => {
    const response = makeRequest('default', 'clientId');
    expect(response).toBe('default value');
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
  });

  it('calls default without clientId', () => {
    const response = makeRequest('default', '');
    expect(response).toBe('default value');
    expect(mockLinkingOpenUrl).not.toHaveBeenCalled();
  });
});
