import { decode } from 'base-64';
import { base64URLtoBase64, base64ToHex } from '../encoding';
import ERRORS from '../errors';

jest.mock('base-64', () => ({
  decode: jest.fn(),
}));

const base64URL =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY-hh9A5Em4n5SWIn9Dr0IkVvnikoAh_E1OPg1o0IT1RW-0qIt0rfkoPUDCCPNrl6d_uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h_zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw';
const base64 =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhYThlN2YzOTE2ZGNiM2YyYTUxMWQzY2ZiMTk4YmY0In0.eyJpc3MiOiJodHRwczovL2F1dGgtdGVzdGluZy5pZHVydWd1YXkuZ3ViLnV5L29pZGMvdjEiLCJzdWIiOiI1ODU5IiwiYXVkIjoiODk0MzI5IiwiZXhwIjoxNjAxNTA2Nzc5LCJpYXQiOjE2MDE1MDYxNzksImF1dGhfdGltZSI6MTYwMTUwMTA0OSwiYW1yIjpbInVybjppZHVydWd1YXk6YW06cGFzc3dvcmQiXSwiYWNyIjoidXJuOmlkdXJ1Z3VheTpuaWQ6MSIsImF0X2hhc2giOiJmZ1pFMG1DYml2ZmxBcV95NWRTT09RIn0.r2kRakfFjIXBSWlvAqY+hh9A5Em4n5SWIn9Dr0IkVvnikoAh/E1OPg1o0IT1RW+0qIt0rfkoPUDCCPNrl6d/uNwabsDV0r2LgBSAhjFIQigM37H1buCAn6A5kiUNh8h/zxKxwA8qqia7tql9PUYwNkgslAjgCKR79imMz4j53iw=';

describe('encoding', () => {
  it('calls base64URLtoBase64', () => {
    const response = base64URLtoBase64(base64URL);
    expect(response).toBe(base64);
  });

  it('calls base64URLtoBase64 wrongLength', () => {
    const encoded = 'base64URL';
    try {
      base64URLtoBase64(encoded);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_BASE64_LENGTH);
    }
    expect.assertions(1);
  });

  it('calls base64URLtoBase64 empty string', () => {
    const encoded = '';
    const resp = base64URLtoBase64(encoded);
    expect(resp).toBe('');
  });

  it('calls base64ToHex', () => {
    decode.mockImplementation(
      () =>
        '{"alg":"RS256","kid":"7aa8e7f3916dcb3f2a511d3cfb198bf4"}ȚȎ΋]]][˚YYX^KX^KY݌HXN\n            NH]YM̎H^MML\n            KX]MML\n            MK]][YHMMLL\n            K[ȝYYX^N[NܙKX܈YYX^NYH]֑LPؚ]WMYHJ|X*caDIb\':"Eo)(֍OTVJJߒ 6zw\n            ]+ظHc"V	"P|+kjcd@Gb',
    );
    const correctHex =
      '7B22616C67223A225253323536222C226B6964223A223761613865376633393136646362336632613531316433636662313938626634227D1E021A020E1D1D1C1C038B5D5D1A0B5D191A5B02DA591D59585E4B585E4B5918074C4808584E0A2020202020202020202020204E48085D59080E4D0C030E48085E1C084D0C4D4C0A2020202020202020202020204B08585D084D0C4D4C0A2020202020202020202020204D4B085D5D1A171A5B59484D0C4D4C0C4C0A2020202020202020202020200E4B085B021D591D59585E4E5B4E180719084B08580708591D59585E4E590E48085D17180805914C1B50061A5D10574D5914484A167C58142A63610E444962273A22456F2928021F058D084F54564A4A07D20C20367A770A2020202020202020202020205D2B06380148086314221F5608090322507C2B1C6B6A630364404762';
    const response = base64ToHex(base64);
    expect(response).toBe(correctHex);
  });

  it('calls base64ToHex but decode fails', () => {
    decode.mockImplementation(() => {
      throw Error();
    });
    try {
      base64ToHex(base64);
    } catch (error) {
      expect(error).toBe(ERRORS.INVALID_BASE64_TO_HEX_CONVERSION);
    }
  });
});
