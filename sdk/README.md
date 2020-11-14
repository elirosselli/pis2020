# SDK ID Uruguay React Native

## Índice

- [Introducción](https://github.com/elirosselli/pis2020/tree/develop/sdk#introducci%C3%B3n)
- [Consideraciones previas](https://github.com/elirosselli/pis2020/tree/develop/sdk#consideraciones-previas)
- [Instalación y configuración](https://github.com/elirosselli/pis2020/tree/develop/sdk#instalaci%C3%B3n-y-configuraci%C3%B3n)
  - [Instalación](https://github.com/elirosselli/pis2020/tree/develop/sdk#instalaci%C3%B3n)
  - [Instalación de react-native-ssl-pinning](https://github.com/elirosselli/pis2020/tree/develop/sdk#instalaci%C3%B3n-de-react-native-ssl-pinning)
  - [Configuración de redirect URI](https://github.com/elirosselli/pis2020/tree/develop/sdk#instalaci%C3%B3n-de-react-native-ssl-pinning)
- [Utilización](https://github.com/elirosselli/pis2020/tree/develop/sdk#utilizaci%C3%B3n)
- [Funcionalidades](https://github.com/elirosselli/pis2020/tree/develop/sdk#funcionalidades)
- [Errores](https://github.com/elirosselli/pis2020/tree/develop/sdk#errores)
- [Certificado _self-signed_ en modo _testing_](https://github.com/elirosselli/pis2020/tree/develop/sdk#certificado-self-signed-en-modo-testing)

## Introducción

En este documento se presentan las distintas funcionalidades brindadas por el componente SDK y una guía para lograr la integración del componente con la aplicación. Además, se exponen definiciones previas necesarias para entender el protocolo utilizado para la autenticación y autorización del usuario final.

Este SDK se basa en el protocolo [OAuth 2.0](https://oauth.net/2/) y [OpenID Connect](https://openid.net/connect/) para su implementación, brindando una capa de abstracción al desarrollador y simplificando la interacción con la [API REST de ID Uruguay](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect). Para que su integración con el SDK funcione, debe registrarse como RP (_Relaying Party_) en ID Uruguay, siguiendo las instrucciones disponibles en la [página web de AGESIC](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect).

## Consideraciones previas

Para lograr autenticar y autorizar al usuario final, el componente SDK establece una comunicación con el servidor de _ID Uruguay_ utilizando el protocolo _OpenID Connect 1.0_.
Este es un protocolo de identidad simple y de estándar abierto creado sobre el protocolo OAuth 2.0, el cual permite a aplicaciones cliente (_Relaying Party_ - RP) verificar la identidad de un usuario final basado en la autenticación realizada por este en un Servidor de Autorización (_OpenID Provider_ - OP), así como también obtener información personal del usuario final mediante el uso de una API REST.
Se tienen tres entidades principales:

- Servidor de Autorización (_OpenID Provider_ - OP): capaz de autenticar usuarios finales y proveer información sobre estos y el proceso de autenticación a un RP.
- Aplicaciones Cliente (_Relaying Party_ - RP): solicita la autenticación de un usuario final a un OP, con el fin de poder acceder a recursos protegidos en nombre del usuario final autenticado. El RP se integra con el componente SDK para tal fin.
- Usuario final (_End User_): es el individuo que interactúa con la RP y se autentica haciendo uso de Usuario gub.uy.

El componente SDK funciona como intermediario de la comunicación entre el RP y el OP, en base a HTTP _requests_ y _responses_ que son presentadas a continuación:

- _Authentication Request_: pedido HTTP que incluye los _Authentication Request Params_ y sirve para solicitar la autenticación de un _End User_ en Usuario gub.uy. Puede llevarse a cabo empleando los métodos HTTP GET o HTTP POST. Este pedido es enviado al _Authorization Endpoint_. Los _Authentication Request Params_ son:

  | Parámetro       | Tipo        | Descripción                                                                                                                                                                                                                                                            |
  | --------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | _scope_         | Requerido   | Siempre debe incluirse "_openid_". Adicionalmente se pueden incluir los siguientes valores: _personal_info_, _profile_, _document_, _email_, _auth_info_.                                                                                                              |
  | _response_type_ | Requerido   | Valor que determina el tipo de flujo de autenticación a utilizar. En caso del [_Authorization Code Flow_](https://auth0.com/docs/flows/authorization-code-flow), es valor es "_code_".                                                                                 |
  | _client_id_     | Requerido   | Identificador del cliente provisto al momento del registro.                                                                                                                                                                                                            |
  | _redirect_uri_  | Requerido   | URI a donde debe ser enviada la respuesta. La misma debe ser una de las registradas al momento de darse de alta como cliente.                                                                                                                                          |
  | _state_         | Recomendado | Valor opaco para mantener el estado entre el pedido y la respuesta. Será retornado al cliente junto con el código de autorización o error.                                                                                                                             |
  | _nonce_         | Opcional    | String opaco utilizado para asociar la sesión de un Cliente con un _ID Token_, y mitigar _replay attacks_.                                                                                                                                                             |
  | _prompt_        | Opcional    | Lista de valores de cadena ASCII delimitados por un espacio, sensibles a minúsculas y mayúsculas, que especifica si el servidor de autorización solicita al usuario final la reautenticación y consentimiento. Los valores definidos son: _none_, _login_ y _consent_. |
  | _acr_values_    | Opcional    | Lista de _strings_ sensibles a minúsculas y mayúsculas, separados por espacios y en orden de preferencia, correspondientes a los nombrados en la sección acr - _Authentication Context Class Reference_.                                                               |

- _Authentication Response_: respuesta HTTP (a una _Authentication Request_) que incluye los _Authentication Response Params_. Esta respuesta es obtenida desde el _Authorization Endpoint_. Los _Authentication Response Params_ son:

  | Parámetro | Tipo                     | Descripción                                                                                                                                   |
  | --------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
  | _code_    | Requerido                | Código de autorización generado por el OP. Puede ser utilizado una única vez para obtener un _ID Token y Access Token_. Expira en 10 minutos. |
  | _state_   | Requerido si fue enviado | El valor exacto recibido del RP en el parámetro "_state_" del _Authentication Request_.                                                       |

- _Token Request_: pedido HTTP empleando el método POST que incluye los _Token Request Params_ y sirve para solicitar un token. Este pedido es enviado al _Token Endpoint_. Los _Token Request Params_ son:

  | Parámetro      | Tipo      | Descripción                                                                                                                                                |
  | -------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | _grant_type_   | Requerido | Tipo de credenciales a presentar. Debe ser "_authorization_code_".                                                                                         |
  | _code_         | Requerido | Código de autorización emitido por el OP, previamente tramitado en el _Authentication Endpoint_.                                                           |
  | _redirect_uri_ | Requerido | URI a donde debe ser redirigido el _User Agent_ con la respuesta (_Token Response_). Debe ser una de las URIs configuradas al momento del registro del RP. |

  Además contiene el _client_id_ y _client_secret_ siguiendo el esquema de autenticación [_HTTP Basic Auth_](https://tools.ietf.org/html/rfc7617).

- _Token Response_: respuesta HTTP (a una _Token Request_) que incluye los _Token Response Params_. Esta respuesta es obtenida desde el _Token Endpoint_. Los _Token Response Params_ son:

  | Parámetro       | Tipo        | Descripción                                                                  |
  | --------------- | ----------- | ---------------------------------------------------------------------------- |
  | _access_token_  | Requerido   | _Access Token_ emitido por el OP.                                            |
  | _token_type_    | Requerido   | Tipo de _token_. Será siempre _Bearer_.                                      |
  | _id_token_      | Requerido   | _ID Token_ asociado a la sesión de autenticación.                            |
  | _expires_in_    | Recomendado | Tiempo de vida del _Access Token_ en segundos. Valor por defecto 60 minutos. |
  | _refresh_token_ | Requerido   | _Refresh Token_ que puede ser utilizado para obtener nuevos _Access Tokens_  |

- _Refresh Token Request_: pedido HTTP empleando el método POST que incluye los _Refresh Token Request Params_ y sirve para obtener un nuevo _token_, con la condición de haber obtenido un _token_ previamente. Este pedido es enviado al _Token Endpoint_. Los _Refresh Token Request Params_ son:

  | Parámetro       | Tipo      | Descripción                                                           |
  | --------------- | --------- | --------------------------------------------------------------------- |
  | _grant_type_    | Requerido | Tipo de credenciales a presentar. Debe ser "_refresh_token_".         |
  | _refresh_token_ | Requerido | Token emitido por el OP, previamente tramitado en el _Token Request_. |

  Además contiene el _client_id_ y _client_secret_ siguiendo el esquema de autenticación [_HTTP Basic Auth_](https://tools.ietf.org/html/rfc7617).

- _Refresh Token Response_: respuesta HTTP (a una _Refresh Token Request_) que incluye los _Refresh Token Response Params_. Esta respuesta es obtenida desde el _Token Endpoint_. Los parámetros son los mismos que _Token Response Params_.

- _User Info Request_: pedido HTTP que incluye los _User Info Request Params_ y sirve para solicitar información del End-User autenticado. Puede llevarse a cabo empleando los métodos HTTP GET o HTTP POST. Este pedido es enviado al _UserInfo Endpoint_. Los _User Info Request Params_ son:

  | Parámetro      | Tipo      | Descripción                                                                   |
  | -------------- | --------- | ----------------------------------------------------------------------------- |
  | _access_token_ | Requerido | Es incluido en el _header_ HTTP _Authorization_ siguiendo el esquema _Bearer_ |

- _User Info Response_: respuesta HTTP (a una _User Info Request_) que incluye los _User Info Response Params_. Esta respuesta es obtenida desde el _UserInfo Endpoint_. Los _User Info Response Params_ son un JSON conteniendo los _claims_ solicitados. Dichos _claims_ pueden ser:

  | Nombre          | Claims                                                                                      | Descripción                                                                                                                                                                                                                               |
  | --------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | _personal_info_ | nombre_completo, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, uid, rid | Nombres y apellidos del usuario, identificador y el nivel de registro de identidad digital. Este último puede ser alguno de los siguientes valores: [0,1,2,3] correspondiendo a los niveles Muy Bajo, Bajo, Medio y Alto respectivamente. |
  | _profile_       | _name_, _given_name_, _family_name_                                                         | Nombre completo, nombre(s) y apellido(s) respectivamente.                                                                                                                                                                                 |
  | _document_      | pais_documento, tipo_documento, numero_documento                                            | Información sobre el documento del usuario.                                                                                                                                                                                               |
  | _email_         | _email_, _email_verified_                                                                   | Correo electrónico y si el mismo está verificado.                                                                                                                                                                                         |
  | _auth_info_     | rid, nid, ae                                                                                | Datos de registro y autenticación del ciudadano en formato URN correspondientes a la Política de Identificación Digital.                                                                                                                  |

- _Validate Token Request_: Pedido HTTP empleando el método GET que sirve para obtener la clave pública del OP útil para la validación de _tokens_. Este pedido es enviado al _JWKS Endpoint_.
- _Validate Token Response_: Respuesta HTTP (a una _Validate Token Request_) que incluye los _Validate Token Response Params_. Esta respuesta es obtenida desde el _JWKS Endpoint_.

  | Parámetro | Tipo      | Descripción                                                                                                                   |
  | --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
  | _kty_     | Requerido | Identifica la familia del algoritmo criptográfico utilizado.                                                                  |
  | _alg_     | Requerido | Identifica el algoritmo utilizado. (`RS256`, `HS256`).                                                                        |
  | _use_     | Requerido | Identifica el uso previsto de la clave pública. Indica si se usa para cifrar datos ("enc") o para verificar la firma ("sig"). |
  | _kid_     | Requerido | Identifica el uso previsto de la clave pública. Indica si se usa para cifrar datos ("enc") o para verificar la firma ("sig"). |
  | _n_       | Requerido | El módulo de la clave (2048 bit). Codificado en Base64.                                                                       |
  | _e_       | Requerido | El exponente de la clave (2048 bit). Codificado en Base64.                                                                    |

- _Logout Request_: pedido HTTP empleando el método GET que incluye los _Logout Request Params_ y sirve para cerrar la sesión del _End User_ autenticado en el OP. Este pedido es enviado al _Logout Endpoint_. Los _Logout Request Params_ son:

  | Parámetro                  | Tipo      | Descripción                                                                                                                                                                                                                                               |
  | -------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | _id_token_hint_            | Requerido | Corresponde al _id_token_ obtenido en el mecanismo de inicio de sesión del RP. El mismo identifica al ciudadano y cliente en cuestión y valida la integridad del RP por el hecho de la poseción del mismo, ya que fue intercambiado de forma segura.      |
  | _post_logout_redirect_uri_ | Opcional  | URL a la cual será redireccionado el RP luego que el _logout_ en el OP finalice exitosamente. Esta URL debe existir en la configuración que mantiene el OP del RP, si la misma no existe o no es exactamente igual, será redireccionado al inicio del OP. |
  | _state_                    | Opcional  | Valor opaco para mantener el estado entre el pedido y la respuesta. Será retornado como parámetro en la _post_logout_redirect_uri_ enviada.                                                                                                               |

- _Logout Reponse_: respuesta HTTP (a una _Logout Request_) que no incluye parámetros. Esta respuesta es obtenida desde el _Logout Endpoint_.

Cabe destacar que ante un posible error la _response_ generada por el OP contiene los siguientes parámetros:

| Parámetro           | Tipo        | Descripción                                                                                                  |
| ------------------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| _error_             | Requerido   | Un código de error de los descritos en [OAuth 2.0](https://tools.ietf.org/html/rfc6749#section-5.1)          |
| _error_description_ | Opcional    | Descripción del error que provee información para ayudar a los desarrolladores a entender el error ocurrido. |
| _state_             | Recomendado | El valor exacto recibido del RP en el parámetro _state_ del _request_ correspondiente.                       |

## Instalación y configuración

### Instalación

El SDK se encuentra disponible en npm y puede instalarlo en su aplicación mediante el comando

`$ npm install sdk-gubuy-test`

Este comando añade el SDK y las dependencias necesarias al proyecto.

### Instalación de react-native-ssl-pinning

Para que el SDK funcione correctamente, debe instalar en su aplicación la librería [react-native-ssl-pinning](https://github.com/MaxToyberman/react-native-ssl-pinning). Esto se hace ejecutando el comando

`$ npm install react-native-ssl-pinning --save`

### Configuración de redirect URI

Deberá configurar en su aplicación su _redirect URI_, como se explica en la [documentación de _React Native_](https://reactnative.dev/docs/linking#enabling-deep-links).

#### Android

En Android, esto implica editar el archivo `AndroidManifest.xml`, que se encuentra en el directorio
app/android/app/src/main/ de su aplicación _React Native_. En particular, se debe agregar un [_intent filter_](https://developer.android.com/training/app-links/deep-linking#adding-filters) en una de sus _activities_, como se muestra a continuación:

```xml
<!-- Esta es su MainActivity-->
<activity
  android:name=".MainActivity"
  android:label="@string/app_name"
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
  android:launchMode="singleTask"
  android:windowSoftInputMode="adjustResize">
  <intent-filter>
      <action android:name="android.intent.action.MAIN" />
      <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>
  <!--Debe agregar lo que sigue a continuación -->
  <intent-filter>
      <action android:name="android.intent.action.VIEW" />
      <category android:name="android.intent.category.DEFAULT" />
      <category android:name="android.intent.category.BROWSABLE" />
      <!--Aquí debe agregar su redirect URI-->
      <data android:scheme="su-redirect-uri" />
  </intent-filter>
  <!--Fin de lo que debe agregar -->
</activity>
```

#### iOS

En iOS, debe seguir los siguiente pasos (puede consultarlos con más detalle en [este link](https://medium.com/@MdNiks/custom-url-scheme-deep-link-fa3e701a6295) y en la [documentación de XCode](https://developer.apple.com/documentation/xcode/allowing_apps_and_websites_to_link_to_your_content/defining_a_custom_url_scheme_for_your_app)):

1. Abra su proyecto en XCode
2. Seleccione la opción "Target"
3. Seleccione "Info", y en la sección de URL Types haga click en el botón de "+".
4. En el campo "URL Schemes" ingrese su redirect URI

## Utilización

Para utilizar las funciones del SDK, se deben importar desde `sdk-gubuy-test`. Por ejemplo:

```javascript
import { initialize, login } from 'sdk-gubyuy-test';
```

Antes de poder utilizar las funciones, se debe inicializar el SDK mediante la función `initialize`:

```javascript
initizalize(
  'miRedirectUri',
  'miClientId',
  'miClientSecret',
  'miProduction',
  'miScope',
);
```

Los valores para los parámetros son acordados con ID Uruguay al [registrarse](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect) exitosamente como RP, a excepción de _production_ y _scope_.

Una vez inicializado el componente, se puede realizar el _login_ con ID Uruguay mediante una llamada a la función `login`:

```javascript
await login();
```

Esta llamada podría realizarse cuando el usuario final presiona un botón, como se muestra en el siguiente ejemplo:

```javascript
const LoginButton = () => {
  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      /*
        Manejar el error
      */
    }
  };

  return (
    <TouchableOpacity onPress={handleLogin}>
      <Text style={styles.buttonText}>Login con ID Uruguay</Text>
    </TouchableOpacity>
  );
};
```

En la [App de ejemplo](https://github.com/elirosselli/pis2020/blob/develop/app/LoginButton/index.js) se puede ver un ejemplo de uso más detallado.

## Funcionalidades

| Función                                                               | Descripción                                                                                                                                                                                                                                                                                               |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialize (redirectUri, clientId, clientSecret, production, scope)` | Inicializa el SDK con los parámetros _redirect_uri_, _client_id_, _client_secret_, _production_ y _scope_, que son utilizados en la interacción con la API de ID Uruguay.                                                                                                                                 |
| `login()`                                                             | Abre una ventana del navegador web del dispositivo para que el usuario final digite sus credenciales e inicie sesión con ID Uruguay. Una vez iniciada la sesión, se realiza una redirección al _redirect_uri_ configurado y se devuelve el _code_. En caso de error, devuelve el mensaje correspondiente. |
| `getToken()`                                                          | Devuelve el _token_ correspondiente para el usuario final autenticado.                                                                                                                                                                                                                                    |
| `refreshToken()`                                                      | Actualiza el _token_ del usuario final autenticado en caso de que este haya expirado. Debe haberse llamado a `getToken` previamente.                                                                                                                                                                      |
| `getUserInfo()`                                                       | Devuelve la información provista por ID Uruguay sobre el usuario final autenticado. Debe haberse llamado a `getToken` previamente.                                                                                                                                                                        |
| `logout()`                                                            | Cierra la sesión del usuario final en ID Uruguay.                                                                                                                                                                                                                                                         |
| `validateToken()`                                                     | Verifica que el idToken recibido durante `getToken()` o `refreshToken()` sea válido, tomando en cuenta la firma, los campos alg, iss, aud, kid y que no esté expirado.                                                                                                                                    |

### Función initialize

Se debe inicializar el SDK con la función `initialize`, que recibe como parámetros: _redirect_uri_, _client_id_, _client_secret_, _production_ y _scope_. Estos últimos parámetros son opcionales. El primero es un booleano que deberá inicializarse en _true_ en el caso de que se quiera acceder a los endpoints de producción de ID Uruguay. Por defecto, se encontrará definido en _false_, lo que permitirá acceder a los endpoints de testing. El segundo parámetro opcional se corresponde con el parámetro _scope_ que requiere la _Authentication Request_

```javascript
initialize(
  'miRedirectUri',
  'miClientId',
  'miClientSecret',
  'miProduction',
  'miScope',
);
```

Luego de esto, se considera que el SDK se encuentra inicializado correctamente.

### Función login

La función `login` abre una ventana en el navegador web del dispositivo con la URL del inicio de sesión con ID Uruguay (<https://mi.iduruguay.gub.uy/login> o <https://mi-testing.iduruguay.gub.uy/login> si se está en modo testing). Una vez que el usuario final ingresa sus credenciales y autoriza a la aplicación, este es redirigido a la _redirect_uri_ configurada en la inicialización del SDK. Esta función devuelve el `code` correspondiente al usuario final autenticado, y en caso de error se produce una excepción.

```javascript
try {
  const code = await login();
  /* Hacer algo con el code */
} catch (err) {
  /* Manejar el error */
}
```

El `code` retornado por la función se guarda internamente en el SDK durante la sesión del usuario final (no se guarda en el dispositivo, solo en memoria). De no necesitar este código, se puede llamar al _login_ sin guardar la respuesta:

```javascript
try {
  await login();
} catch (err) {
  /* Manejar el error */
}
```

Se debe notar que si el usuario final no inicia la sesión con ID Uruguay (ya sea porque cierra el navegador, o porque ingresa credenciales incorrectas), no se redirigirá a la _redirect_uri_ especificada.

### Función getToken

Una vez realizado el `login`, es posible obtener el `access_token` correpondiente al usuario final autenticado. Para esto se debe invocar a la función `getToken` del SDK:

```javascript
const token = await getToken();
```

Al igual que el `code`, el _token_ retornado se guarda en el SDK, con lo que de no necesitar almacenar el _token_, también se puede llamar a `getToken` sin guardar la respuesta.

### Función refreshToken

El _token_ otorgado por ID Uruguay tiene un tiempo de expiración fijo, por lo que una vez transcurrido este tiempo, el _token_ pasará a ser inválido. Para obtener un nuevo _token_ se debe invocar a la función `refreshToken`.

```javascript
const token = await refreshToken();
```

Esta función requiere que la función `getToken` haya sido ejecutada de forma correcta.

### Función getUserInfo

Luego de realizado el `getToken`, se puede invocar la función `getUserInfo` para obtener la información del usuario final autenticado, provista por ID Uruguay:

```javascript
const userInfo = await getUserInfo();
```

Esta función devuelve un objeto con el siguiente formato:

```javascript
{
  primer_nombre: 'Juan',
  segundo_nombre: 'José',
  primer_apellido: 'Perez',
  segundo_apellido: 'Martinez',
  documento: 'uy-ci-1234567',
}
```

### Función validateToken

La función `validateToken` permite al usuario validar el _id_token_ provisto durante la llamada a `getToken` o `refreshToken`.

Al llamar a la función se valida el _id_token_. Para esto se obtiene del _JWKS Endpoint_ las claves y algoritmos que el OP utiliza. Posteriormente, con estos datos se procede a verificar que el _id_token_ sea un [JWT (JsonWebToken)](https://tools.ietf.org/html/rfc7519). Si esto se cumple se valida la firma del _token_, además de los siguientes campos:

| Parámetro | Valor                               |
| --------- | ----------------------------------- |
| alg       | Algoritmo de la firma.              |
| iss       | Quien creó y firmó el token.        |
| aud       | Para quién está destinado el token. |
| exp       | Tiempo de expiración.               |
| kid       | Identificador único.                |

En caso de que el _token_ sea inválido devuelve un error de tipo `ERRORS.INVALID_ID_TOKEN`.

### Función logout

La función `logout` del SDK permite al usuario final cerrar su sesión con ID Uruguay.

```javascript
await logout();
```

## Errores

De forma de establecer un modelo de errores consistente dentro del SDK, se define que cada error devuelto debe tener una estructura específica, definida en el archivo `constants.js`.

Cada error es una extensión de la clase `Error` de `javascript`, y tiene la siguiente estructura:

```javascript
class NewError extends Error {
  constructor(
    errorCode = 'newErrorCode',
    errorDescription = 'newErrorDescription',
    ...params
  ) {
    // Pasa los argumentos restantes (incluidos los específicos del proveedor) al constructor padre.
    super(...params);
    // Información de depuración personalizada.
    this.name = 'NewError';
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}
```

Se agregan los campos:

| Campo            | Descripción                       |
| ---------------- | --------------------------------- |
| name             | Nombre del error.                 |
| errorCode        | Código identificatorio del error. |
| errorDescription | Descripción del error.            |

Los errores definidos son:

| Nombre                       | Clase                           | Código                                   | Descripción                                                                                                                                                                            | ¿Cuándo ocurre?                                                                                                        | Posible solución                                                                            |
| ---------------------------- | ------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| noError                      | `ErrorNoError`                  | gubuy_no_error                           | No error                                                                                                                                                                               | Cuando la función cumple correctamente su objetivo.                                                                    | No aplica.                                                                                  |
| invalidClientId              | `ErrorInvalidClientId`          | gubuy_invalid_client_id                  | Invalid client_id parameter.                                                                                                                                                           | Cuando el valor del client_id definido para el sdk no es correcto.                                                     | Revisar que el client_id definido corresponda con el designado por ID Uruguay.              |
| invalidRedirectUri           | `ErrorInvalidRedirectUri`       | gubuy_invalid_redirect_uri               | Invalid redirect_uri parameter.                                                                                                                                                        | Cuando la redirect_uri definida para el SDK no es válida.                                                              | Revisar que la redirect_uri definida corresponda con la designada por ID Uruguay.           |
| invalidClientSecret          | `ErrorInvalidClientSecret`      | gubuy_invalid_client_secret              | Invalid client_secret parameter.                                                                                                                                                       | Cuando el client_secret definido para el SDK no es válido.                                                             | Revisar que el client_secret definido corresponda con el designado por ID Uruguay.          |
| accessDenied                 | `ErrorAccessDenied`             | access_denied                            | The resource owner or authorization server denied the request.                                                                                                                         | Cuando el usuario final rechaza el login.                                                                              | No aplica.                                                                                  |
| invalidAuthorizationCode     | `ErrorInvalidAuthorizationCode` | gubuy_invalid_auhtorization_code         | Invalid authorization code.                                                                                                                                                            | Cuando el code definido en el SDK no es válido.                                                                        | Revisar que el code actual corresponde al devuelto por la función Login().                  |
| failedRequest                | `ErrorFailedRequest`            | failed_request                           | Couldn't make request.                                                                                                                                                                 | Cuando la request no pudo ser completada satisfactoriamente.                                                           | Revisar que los parámetros de la request sean válidos y comprobar la conexión a internet.   |
| invalidGrant                 | `ErrorInvalidGrant`             | invalid_grant                            | The provided authorization grant or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client. | Cuando el code o refresh_token son inválidos o expiraron, y no se puede obtener un nuevo token de forma satisfactoria. | Comprobar la validez del code o refresh_token según corresponda.                            |
| invalidToken                 | `ErrorInvalidToken`             | invalid_token                            | The access token provided is expired, revoked, malformed, or invalid for other reasons.                                                                                                | Cuando el access_token es inválido o expiró, y no se puede obtener la UserInfo de forma satisfactoria.                 | Comprobar la validez del access_token.                                                      |
| invalidClient                | `ErrorInvalidClient`            | invalid_client                           | Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method)                                                           | Cuando no se pudo obtener un nuevo token de forma correcta.                                                            | Verificar que el client_secret y client_id correspondan con los registrados por ID Uruguay. |
| invalidTokenHint             | `ErrorInvalidIdTokenHint`       | invalid_id_token_hint                    | Invalid id_token_hint parameter.                                                                                                                                                       | Cuando el parámetro id_token_hint es inválido o no existe a la hora de llamar a Logout.                                | Comprobar la existencia y validez del id_token_hint.                                        |
| invalidUrlLogout             | `ErrorInvalidUrlLogout`         | invalid_url_logout                       | Invalid returned url for logout.                                                                                                                                                       | Cuando la URL de logout es inválida.                                                                                   | Comprobar la validez de la URL de logout.                                                   |
| invalidIdToken               | `ErrorInvalidIdToken`           | invalid_id_token                         | Invalid id token.                                                                                                                                                                      | Cuando el idToken registrado en el SDK es inválido.                                                                    | Comprobar que el idToken sea el mismo recibido durante getToken o refreshToken.             |
| invalidLengthError           | `ErrorBase64InvalidLength`      | base64URL_to_base64_invalid_length_error | Input base64url string is the wrong length to determine padding.                                                                                                                       | Cuando el n (modulous) del idToken es inválido.                                                                        | Revisar que el idToken sea el mismo recibido durante getToken o refreshToken.               |
| invalidBase64ToHexConversion | `ErrorBase64ToHexConversion`    | invalid_base64_to_hex_conversion         | Error while decoding base64 to hex.                                                                                                                                                    | Cuando el n (modulous) o el e (exponente) del idToken son inválidos.                                                   | Revisar que el idToken sea el mismo recibido durante getToken o refreshToken.               |

## Certificado _self-signed_ en modo _testing_

En modo de _testing_, es necesario agregar el certificado de la API de testing de ID Uruguay a los certificados confiables. Los certificados se pueden obtener ingresando a la URL <https://mi-testing.iduruguay.gub.uy/login> en Google Chrome, y haciendo _click_ en el ícono de candado que se muestra a la izquierda de la URL. Allí, seleccionar "Certificado" (o "Certificate"), y en el cuadro de diálogo que se abre, seleccionar "Copiar en archivo" o "Exportar".

Para el desarrollo Android, debe copiar el certificado certificate.cer en la carpeta `android/app/src/main/assets` de su proyecto _React Native_.

Para el desarrollo en iOS, se deben obtener los tres certificados de la URL de testing de ID Uruguay, siguiendo el procedimiento explicado anteriormente. Luego, se debe abrir el proyecto en XCode y se deben seguir los siguientes pasos:

1. Arrastrar (_drag and drop_) los certificados descargados al proyecto en XCode.
2. Esto abrirá un cuadro de diálogo con varias opciones. Se debe marcar la opción "Copy items if needed", además de la opción "Create folder references". En la opción "Add to targets", marcar todas las opciones disponibles.
3. Luego de realizado esto, clickear el botón "Finish" del cuadro de diálogo
