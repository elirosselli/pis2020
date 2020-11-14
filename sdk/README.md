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
- [Certificado *self-signed* en modo *testing*](https://github.com/elirosselli/pis2020/tree/develop/sdk#certificado-self-signed-en-modo-testing)

## Introducción

En este documento se presentan las distintas funcionalidades brindadas por el componente SDK y una guía para lograr la integración del componente con la aplicación. Además, se exponen definiciones previas necesarias para entender el protocolo utilizado para la autenticación y autorización del usuario final.

Este SDK se basa en el protocolo [OAuth 2.0](https://oauth.net/2/) y [OpenID Connect](https://openid.net/connect/) para su implementación, brindando una capa de abstracción al desarrollador y simplificando la interacción con la API REST de ID Uruguay. Para que su integración con el SDK funcione, debe registrarse como RP (_Relaying Party_) en ID Uruguay, siguiendo las instrucciones disponibles en la [página web de AGESIC](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect).

## Consideraciones previas

Para lograr autenticar y autorizar al usuario final, el componente SDK establece una comunicación con el servidor de *ID Uruguay* utilizando el protocolo *OpenID Connect 1.0*.
Este es un protocolo de identidad simple y de estándar abierto creado sobre el protocolo OAuth 2.0, el cual permite a aplicaciones cliente (*Relaying Party* - RP) verificar la identidad de un usuario final basado en la autenticación realizada por este en un Servidor de Autorización (*OpenID Provider* - OP), así como también obtener información personal del usuario final mediante el uso de una *API REST*.
Se tienen tres entidades principales:

- Servidor de Autorización (*OpenID Provider* - OP): capaz de autenticar usuarios finales y proveer información sobre estos y el proceso de autenticación a un RP.
- Aplicaciones Cliente (*Relaying Party* - RP): solicita la autenticación de un usuario final a un OP, con el fin de poder acceder a recursos protegidos en nombre del usuario final autenticado. El RP se integra con el componente SDK para tal fin.  
- Usuario final (*End User*): es el individuo que interactúa con la RP y se autentica haciendo uso de Usuario gub.uy.

El componente SDK funciona como intermediario de la comunicación entre el RP y el OP, en base a HTTP *requests* y *responses* que son presentadas a continuación:

- *Authentication Request*: pedido HTTP que incluye los *Authentication Request Params* y sirve para solicitar la autenticación de un *End User* en Usuario gub.uy. Puede llevarse a cabo empleando los métodos HTTP GET o HTTP POST. Este pedido es enviado al *Authorization Endpoint*. Los *Authentication Request Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *scope*         | Requerido |Siempre debe incluirse "*openid*". Adicionalmente se pueden incluir los siguientes valores: *personal_info*, *profile*, *document*, *email*, *auth_info*.            |
    | *response_type* | Requerido | Valor que determina el tipo de flujo de autenticación a utilizar. En caso del [*Authorization Code Flow*](https://auth0.com/docs/flows/authorization-code-flow), es valor es "*code*".             |
    | *client_id*     | Requerido | Identificador del cliente provisto al momento del registro.             |
    | *redirect_uri*  | Requerido |URI a donde debe ser enviada la respuesta. La misma debe ser una de las registradas al momento de darse de alta como cliente.             |
    | *state*  | Requerido |Valor opaco para mantener el estado entre el pedido y la respuesta. Será retornado al cliente junto con el código de autorización o error.             |
    | *nonce* | Opcional | String opaco utilizado para asociar la sesión de un Cliente con un *ID Token*, y mitigar *replay attacks*.    |
    | *prompt*  | Opcional |Lista de valores de cadena ASCII delimitados por un espacio, sensibles a minúsculas y mayúsculas, que especifica si el servidor de autorización solicita al usuario final la reautenticación y consentimiento. Los valores definidos son: *none*, *login* y *consent*.             |
    | *acr_values*  | Opcional |Lista de *strings* sensibles a minúsculas y mayúsculas, separados por espacios y en orden de preferencia, correspondientes a los nombrados en la sección acr - *Authentication Context Class Reference*.            |

- *Authentication Response*: respuesta HTTP (a una *Authentication Request*) que incluye los *Authentication Response Params*. Esta respuesta es obtenida desde el *Authorization Endpoint*. Los *Authentication Response Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *code*         | Requerido |Código de autorización generado por el OP. Puede ser utilizado una única vez para obtener un *ID Token y Access Token*. Expira en 10 minutos. |
    | *state*     | Requerido | El valor exacto recibido del RP en el parámetro "*state*" del *Authentication Request*. |

- *Token Request*: pedido HTTP empleando el método POST que incluye los *Token Request Params* y sirve para solicitar un token. Este pedido es enviado al *Token Endpoint*. Los *Token Request Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *grant_type*         | Requerido |Tipo de credenciales a presentar. Debe ser "*authorization_code*". |
    | *code* | Requerido | Código de autorización emitido por el OP, previamente tramitado en el *Authentication Endpoint*. |
    | *redirect_uri*     | Requerido | URI a donde debe ser redirigido el *User Agent* con la respuesta (*Token Response*). Debe ser una de las URIs configuradas al momento del registro del RP. |

    Además contiene el *client_id* y *client_secret* siguiendo el esquema de autenticación [*HTTP Basic Auth*](https://tools.ietf.org/html/rfc7617).

- *Token Response*: respuesta HTTP (a una *Token Request*) que incluye los *Token Response Params*. Esta respuesta es obtenida desde el *Token Endpoint*. Los *Token Response Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *access_token*         | Requerido |*Access Token* emitido por el OP.|
    | *token_type* | Requerido | Tipo de *token*. Será siempre *Bearer*.             |
    | *id_token*     | Requerido | *ID Token* asociado a la sesión de autenticación.             |
    | *expires_in*  | Recomendado |Tiempo de vida del *Access Token* en segundos. Valor por defecto 60 minutos.             |
    | *refresh_token*  | Requerido |*Refresh Token* que puede ser utilizado para obtener nuevos *Access Tokens*             |

- *Refresh Token Request*: pedido HTTP empleando el método POST que incluye los *Refresh Token Request Params* y sirve para obtener un nuevo *token*, con la condición de haber obtenido un *token* previamente. Este pedido es enviado al *Token Endpoint*. Los *Refresh Token Request Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *grant_type*         | Requerido |Tipo de credenciales a presentar. Debe ser "*refresh_token*". |
    | *refresh_token* | Requerido | Token emitido por el OP, previamente tramitado en el *Token Request*. |

    Además contiene el *client_id* y *client_secret* siguiendo el esquema de autenticación [*HTTP Basic Auth*](https://tools.ietf.org/html/rfc7617).

- *Refresh Token Response*: respuesta HTTP (a una *Refresh Token Request*) que incluye los *Refresh Token Response Params*. Esta respuesta es obtenida desde el *Token Endpoint*. Los parámetros son los mismos que *Token Response Params*.

- *User Info Request*: pedido HTTP que incluye los User Info Request Params y sirve para solicitar información del End-User autenticado. Puede llevarse a cabo empleando los métodos HTTP GET o HTTP POST. Este pedido es enviado al *UserInfo Endpoint*. Los *User Info Request Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *access_token*         | Requerido |Es incluido en el *header* HTTP *Authorization* siguiendo el esquema *Bearer* |

- *User Info Response*: respuesta HTTP (a una *User Info Request*) que incluye los *User Info Response Params*. Esta respuesta es obtenida desde el *UserInfo Endpoint*. Los *User Info Response Params* son un JSON conteniendo los *claims* solicitados. Dichos *claims* pueden ser:

    | Nombre      | Claims      | Descripción |
    |-----------------|-----------|-------------|
    | *personal_info*         | nombre_completo, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, uid, rid | Nombres y apellidos del usuario, identificador y el nivel de registro de identidad digital. Este último puede ser alguno de los siguientes valores: [0,1,2,3] correspondiendo a los niveles Muy Bajo, Bajo, Medio y Alto respectivamente. |
    | *profile*         | *name*, *given_name*, *family_name* | Nombre completo, nombre(s) y apellido(s) respectivamente. |
    | *document*         | pais_documento, tipo_documento, numero_documento | Información sobre el documento del usuario. |
    | *email*         | *email*, *email_verified* | Correo electrónico y si el mismo está verificado. |
    | *auth_info*         | rid, nid, ae | Datos de registro y autenticación del ciudadano en formato URN correspondientes a la Política de Identificación Digital. |

- *Logout Request*: pedido HTTP empleando el método GET que incluye los *Logout Request Params* y sirve para cerrar la sesión del *End User* autenticado en el OP. Este pedido es enviado al *Logout Endpoint*. Los *Logout Request Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *id_token_hint*         | Requerido |Corresponde al *id_token* obtenido en el mecanismo de inicio de sesión del RP. El mismo identifica al ciudadano y cliente en cuestión y valida la integridad del RP por el hecho de la poseción del mismo, ya que fue intercambiado de forma segura. |
    | *post_logout_redirect_uri* | Opcional | URL a la cual será redireccionado el RP luego que el *logout* en el OP finalice exitosamente. Esta URL debe existir en la configuración que mantiene el OP del RP, si la misma no existe o no es exactamente igual, será redireccionado al inicio del OP. |
    | *state*     | Opcional | Valor opaco para mantener el estado entre el pedido y la respuesta. Será retornado como parámetro en la *post_logout_redirect_uri* enviada. |

- *Logout Reponse*: respuesta HTTP (a una *Logout Request*) que no incluye parámetros. Esta respuesta es obtenida desde el *Logout Endpoint*.

Cabe destacar que ante un posible error la *response* generada por el OP contiene los siguientes parámetros:

| Parámetro         | Tipo      | Descripción                                                                                                  |
|-------------------|-----------|--------------------------------------------------------------------------------------------------------------|
| *error*             | Requerido | Un código de error de los descritos en [OAuth 2.0](https://tools.ietf.org/html/rfc6749#section-5.1)                                                             |
| *error_description* | Opcional  | Descripción del error que provee información para ayudar a los desarrolladores a entender el error ocurrido. |
| *state* | Recomendado | El valor exacto recibido del RP en el parámetro *state* del *request* correspondiente.

## Instalación y configuración

### Instalación

El SDK se encuentra disponible en npm y puede ser instalado mediante el comando

`$ npm install sdk-gubuy-test`

Este comando añade el SDK y las dependencias necesarias al proyecto.

### Instalación de react-native-ssl-pinning

Para que el SDK funcione correctamente, debe instalar en su aplicación la librería [react-native-ssl-pinning](https://github.com/MaxToyberman/react-native-ssl-pinning). Esto se hace ejecutando el comando

`$ npm install react-native-ssl-pinning --save`

### Configuración de redirect URI

Deberá configurar en su aplicación su *redirect URI*, como se explica en la [documentación de *React Native*](https://reactnative.dev/docs/linking#enabling-deep-links).

#### Android

En Android, esto implica editar el archivo `AndroidManifest.xml`, que se encuentra en el directorio
app/android/app/src/main/ de su aplicación *React Native*. En particular, se debe agregar un [*intent filter*](https://developer.android.com/training/app-links/deep-linking#adding-filters) en una de sus *activities*, como se muestra a continuación:

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
initizalize('miRedirectUri', 'miClientId', 'miClientSecret', 'miProduction', 'miScope');
```

Los valores para los parámetros son acordados con ID Uruguay al [registrarse](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect) exitosamente como RP, a excepción de *production* y *scope*.

Una vez inicializado el componente, se puede realizar el *login* con ID Uruguay mediante una llamada a la función `login`:

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

| Función                                                      | Descripción                                                                                                                                                                            |
|--------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `initialize (redirectUri, clientId, clientSecret, production, scope)`| Inicializa el SDK con los parámetros *redirect_uri*, *client_id*, *client_secret*, *production* y *scope*, que son utilizados en la interacción con la API de ID Uruguay.                                                                                        |
| `login()`                                                    | Abre una ventana del navegador web del dispositivo para que el usuario final digite sus credenciales e inicie sesión con ID Uruguay. Una vez iniciada la sesión, se realiza una redirección al *redirect_uri* configurado y se devuelve el *code*.  En caso de error, devuelve el mensaje correspondiente.|
| `getToken()`                                                  | Devuelve el *token* correspondiente para el usuario final autenticado.                                                                                                   |
| `refreshToken()`                                              | Actualiza el *token* del usuario final autenticado en caso de que este haya expirado. Debe haberse llamado a `getToken` previamente.                                                                                                    |
| `getUserInfo()`                                               | Devuelve la información provista por ID Uruguay sobre el usuario final autenticado.  Debe haberse llamado a `getToken` previamente.                                                                                                       |
| `logout()`                                                    | Cierra la sesión del usuario final en ID Uruguay.                                                                                                                                          |
| `validateToken()`                                                    | Verifica que el idToken recibido durante `getToken()` o `refreshToken()` sea válido, tomando en cuenta la firma, los campos alg, iss, aud, kid y que no esté expirado.                                                                                                                                          |

### Función initialize

Se debe inicializar el SDK con la función `initialize`, que recibe como parámetros: *redirect_uri*, *client_id*, *client_secret*, *production* y *scope*. Estos últimos parámetros son opcionales. El primero es un booleano que deberá inicializarse en *true* en el caso de que se quiera acceder a los endpoints de producción de ID Uruguay. Por defecto, se encontrará definido en *false*, lo que permitirá acceder a los endpoints de testing. El segundo parámetro opcional se corresponde con el parámetro *scope* que requiere la *Authentication Request*

```javascript
initialize('miRedirectUri', 'miClientId', 'miClientSecret', 'miProduction', 'miScope');
```

Luego de esto, se considera que el SDK se encuentra inicializado correctamente.

### Función login

La función `login` abre una ventana en el navegador web del dispositivo con la URL del inicio de sesión con ID Uruguay (<https://mi.iduruguay.gub.uy/login> o <https://mi-testing.iduruguay.gub.uy/login> si se está en modo testing). Una vez que el usuario final ingresa sus credenciales, este es redirigido a la *redirect_uri* configurada en la inicialización del SDK. Esta función devuelve el `code` correspondiente al usuario final autenticado, y en caso de error se produce una excepción.

``` javascript
try {
  const code = await login();
  /* Hacer algo con el code */
} catch (err) {
  /* Manejar el error */
}
```

El `code` retornado por la función se guarda internamente en el SDK durante la sesión del usuario final (no se guarda en el dispositivo, solo en memoria). De no necesitar este código, se puede llamar al *login* sin guardar la respuesta:

``` javascript
try {
  await login();
} catch (err) {
  /* Manejar el error */
}
```

Se debe notar que si el usuario final no inicia la sesión con ID Uruguay (ya sea porque cierra el navegador, o porque ingresa credenciales incorrectas), no se redirigirá a la *redirect_uri* especificada.

### Función getToken

Una vez realizado el `login`, es posible obtener el `access_token` correpondiente al usuario final autenticado. Para esto se debe invocar a la función `getToken` del SDK:

```javascript
const token = await getToken();
```

Al igual que el `code`, el *token* retornado se guarda en el SDK, con lo que de no necesitar almacenar el *token*, también se puede llamar a `getToken` sin guardar la respuesta.

### Función refreshToken

El *token* otorgado por ID Uruguay tiene un tiempo de expiración fijo, por lo que una vez transcurrido este tiempo, el *token* pasará a ser inválido. Para obtener un nuevo *token* se debe invocar a la función `refreshToken`.

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

### Función logout

La función `logout` del SDK permite al usuario final cerrar su sesión con ID Uruguay.

```javascript
await logout();
```

### Función validateToken

La función `validateToken()` permite al usuario validar el idToken provisto durante la llamada a `getToken()` o `refreshToken()`.

Al llamar a la función se valida que el idToken, se obtiene del JWKS Endpoint las claves y algoritmos que el OP utiliza. Posteriormente, con estos datos se procede a verificar que el idToken sea un [JWT (JsonWebToken)](https://tools.ietf.org/html/rfc7519). Si esto se cumple se valida firma del token, además de los siguientes campos:

| Parámetro | Valor                               |
|-----------|-------------------------------------|
| alg       | Algoritmo de la firma.              |
| iss       | Quien creó y firmó el token.        |
| aud       | Para quién está destinado el token. |
| exp       | Tiempo de expiración.               |
| kid       | Identificador único.                |

En caso de que el token se inválido devuelve un error de tipo `ERRORS.INVALID_ID_TOKEN`.

## Certificado *self-signed* en modo *testing*

En modo de *testing*, es necesario agregar el certificado de la API de testing de ID Uruguay a los certificados confiables. Los certificados se pueden obtener ingresando a la URL <https://mi-testing.iduruguay.gub.uy/login> en Google Chrome, y haciendo click en el ícono de candado que se muestra a la izquierda de la URL. Allí, seleccionar "Certificado" (o "Certificate"), y en el cuadro de diálogo que se abre, seleccionar "Copiar en archivo" o "Exportar".

Para el desarrollo Android, debe copiar el certificado certificate.cer en la carpeta `android/app/src/main/assets` de su proyecto *React Native*.

Para el desarrollo en iOS, se deben obtener los 3 certificados de la URL de testing de ID Uruguay, siguiendo el procedimiento explicado anteriormente. Luego, se debe abrir el proyecto en XCode y se deben seguir los siguientes pasos:

1. Arrastrar (*drag and drop*) los certificados descargados al proyecto en XCode.
2. Esto abrirá un cuadro de diálogo con varias opciones. Se debe marcar la opción "Copy items if needed", además de la opción "Create folder references". En la opción "Add to targets", marcar todas las opciones disponibles.
3. Luego de realizado esto, clickear el botón "Finish" del cuadro de diálogo
