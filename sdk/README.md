# Introducción

En este documento se presentan las distintas funcionalidades brindadas por el componente SDK y una guía para lograr la integración del componente con la aplicación. Además, se exponen definiciones previas necesarias para entender el protocolo utilizado para la autenticación y autorización del usuario final.

Este SDK se basa en el protocolo [OAuth 2.0](https://oauth.net/2/) y [OpenID Connect](https://openid.net/connect/) para su implementación, brindando una capa de abstracción al desarrollador y simplificando la interacción con la API REST de ID Uruguay. Para que su integración con el SDK funcione, debe registrarse como RP (_Relaying Party_) en ID Uruguay, siguiendo las instrucciones disponibles en la [página web de AGESIC](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect).

## Consideraciones Previas

Para lograr autenticar y autorizar al usuario final, el componente SDK establece una comunicación con el servidor de *ID Uruguay* utilizando el protocolo *OpenID Connect 1.0*.
Este es un protocolo de identidad simple y de estándar abierto creado sobre el protocolo OAuth 2.0, el cual permite a aplicaciones cliente (*Relaying Party* - RP) verificar la identidad de un usuario final basado en la autenticación realizada por este en un Servidor de Autorización (*OpenID Provider* - OP), así como también obtener información personal del usuario final mediante el uso de una *API REST*.
Se tienen tres entidades principales:

- Servidor de Autorización (*OpenID Provider* - OP): capaz de autenticar usuarios finales y proveer información sobre estos y el proceso de autenticación a un RP.
- Aplicaciones Cliente (*Relaying Party* - RP): solicita la autenticación de un usuario final a un OP, con el fin de poder acceder a recursos protegidos en nombre del usuario final autenticado. El RP se integra con el componente SDK para tal fin.  
- Usuario final (*End User*): es el individuo que interactúa con la RP y se autentica haciendo uso de Usuario gub.uy.

El componente SDK funciona como intermediario de la comunicación entre el RP y el OP, en base a HTTP *requests* y *responses* que son presentadas a continuación:

- *Requests*:

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

  - *Token Request*: pedido HTTP empleando el método POST que incluye los *Token Request Params* y sirve para solicitar un token. Este pedido es enviado al *Token Endpoint*. Los *Token Request Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *grant_type*         | Requerido |Tipo de credenciales a presentar. Debe ser "*authorization_code*". |
    | *code* | Requerido | Código de autorización emitido por el OP, previamente tramitado en el *Authentication Endpoint*. |
    | *redirect_uri*     | Requerido | URI a donde debe ser redirigido el *User Agent* con la respuesta (*Token Response*). Debe ser una de las URIs configuradas al momento del registro del RP. |

    Además contiene el *client_id* y *client_secret* siguiendo el esquema de autenticación [*HTTP Basic Auth*](https://tools.ietf.org/html/rfc7617).

  - *Refresh Token Request*: pedido HTTP empleando el método POST que incluye los *Refresh Token Request Params* y sirve para obtener un nuevo *token*, con la condición de haber obtenido un *token* previamente. Este pedido es enviado al *Token Endpoint*. Los *Refresh Token Request Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *grant_type*         | Requerido |Tipo de credenciales a presentar. Debe ser "*refresh_token*". |
    | *refresh_token* | Requerido | Token emitido por el OP, previamente tramitado en el *Token Request*. |

    Además contiene el *client_id* y *client_secret* siguiendo el esquema de autenticación [*HTTP Basic Auth*](https://tools.ietf.org/html/rfc7617).

  - *Logout Request*: pedido HTTP empleando el método GET que incluye los *Logout Request Params* y sirve para cerrar la sesión del *End User* autenticado en el OP. Este pedido es enviado al *Logout Endpoint*. Los *Logout Request Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *id_token_hint*         | Requerido |Corresponde al *id_token* obtenido en el mecanismo de inicio de sesión del RP. El mismo identifica al ciudadano y cliente en cuestión y valida la integridad del RP por el hecho de la poseción del mismo, ya que fue intercambiado de forma segura. |
    | *post_logout_redirect_uri* | Opcional | URL a la cual será redireccionado el RP luego que el *logout* en el OP finalice exitosamente. Esta URL debe existir en la configuración que mantiene el OP del RP, si la misma no existe o no es exactamente igual, será redireccionado al inicio del OP. |
    | *state*     | Opcional | Valor opaco para mantener el estado entre el pedido y la respuesta. Será retornado como parámetro en la *post_logout_redirect_uri* enviada. |

- *Responses*:

  - *Authentication Response*: respuesta HTTP (a una *Authentication Request*) que incluye los *Authentication Response Params*. Esta respuesta es obtenida desde el *Authorization Endpoint*. Los *Authentication Response Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *code*         | Requerido |Código de autorización generado por el OP. Puede ser utilizado una única vez para obtener un *ID Token y Access Token*. Expira en 10 minutos. |
    | *state*     | Requerido | El valor exacto recibido del RP en el parámetro "*state*" del *Authentication Request*. |

  - *Token Response*: respuesta HTTP (a una *Token Request*) que incluye los *Token Response Params*. Esta respuesta es obtenida desde el *Token Endpoint*. Los *Token Response Params* son:

    | Parámetro       | Tipo      | Descripción |
    |-----------------|-----------|-------------|
    | *access_token*         | Requerido |*Access Token* emitido por el OP.|
    | *token_type* | Requerido | Tipo de *token*. Será siempre *Bearer*.             |
    | *id_token*     | Requerido | *ID Token* asociado a la sesión de autenticación.             |
    | *expires_in*  | Recomendado |Tiempo de vida del *Access Token* en segundos. Valor por defecto 60 minutos.             |
    | *refresh_token*  | Requerido |*Refresh Token* que puede ser utilizado para obtener nuevos *Access Tokens*             |

  - *Refresh Token Response*: respuesta HTTP (a una *Refresh Token Request*) que incluye los *Refresh Token Response Params*. Esta respuesta es obtenida desde el *Token Endpoint*. Los parámetros son los mismos que *Token Response Params*.

  - *Logout Reponse*: respuesta HTTP (a una *Logout Request*) que no incluye parámetros. Esta respuesta es obtenida desde el *Logout Endpoint*.

Cabe destacar que ante un posible error la *response* generada por el OP contiene los siguientes parámetros:

| Parámetro         | Tipo      | Descripción                                                                                                  |
|-------------------|-----------|--------------------------------------------------------------------------------------------------------------|
| *error*             | Requerido | Un código de error de los descritos en [OAuth 2.0](https://tools.ietf.org/html/rfc6749#section-5.1)                                                             |
| *error_description* | Opcional  | Descripción del error que provee información para ayudar a los desarrolladores a entender el error ocurrido. |
| *state* | Recomendado | El valor exacto recibido del RP en el parámetro *state* del *request* correspondiente.

## Guía de instalación

El propósito de esta sección es proveer una guía paso a paso a los desarrolladores interesados en integrar la funcionalidad de autenticación con ID Uruguay a sus aplicaciones *React Native*.

### Instalación

El SDK se encuentra disponible en npm y puede ser instalado mediante el comando

`$ npm install sdk-gubuy-test`

Este comando añade el SDK y las dependencias necesarias al proyecto.

### Instalación de rn-ssl-spinning

Para que el SDK funcione correctamente, debe instalar en su aplicación la librería [react-native-ssl-pinning](https://github.com/MaxToyberman/react-native-ssl-pinning). Esto se hace ejecutando el comando

`$ react-native-ssl-pinning --save`

### Configuración de redirect uri

Deberá configurar en su aplicación su *redirect URI*, como se explica en la [documentación de *React Native*](https://reactnative.dev/docs/linking#enabling-deep-links). 

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

### Utilización

Para utilizar las funciones del SDK, se deben importar desde `sdk-gubuy-test`. Por ejemplo:

```javascript
import { initialize, login } from 'sdk-gubyuy-test';
```

Antes de poder utilizar las funciones, se debe inicializar el SDK mediante la función `initialize`:

```javascript
initizalize('miRedirectUri', 'miClientId', 'miClientSecret', 'miLogoutRedirectUri');
```

Los valores para los parámetros son acordados con ID Uruguay al [registrarse](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect) exitosamente como RP.

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

### Funcionalidades

| Función                                                      | Descripción                                                                                                                                                                            |
|--------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `initialize (redirectUri, clientId, clientSecret, postLogoutRedirectUri)`| Inicializa el SDK con los parámetros *redirect_uri*, *client_id*, *client_secret*, y *post_logout_redirect_uri*, que son utilizados en la interacción con la API de ID Uruguay.                                                                                        |
| `login()`                                                    | Abre una ventana del navegador web del dispositivo para que el usuario final digite sus credenciales e inicie sesión con ID Uruguay. Una vez iniciada la sesión, se realiza una redirección al *redirect_uri* configurado y se devuelve el *code*.  En caso de error, devuelve el mensaje correspondiente.|
| `getToken()`                                                  | Devuelve el *token* correspondiente para el usuario final autenticado.                                                                                                   |
| `refreshToken()`                                              | Actualiza el *token* del usuario final autenticado en caso de que este haya expirado. Debe haberse llamado a `getToken` previamente.                                                                                                    |
| `getUserInfo()`                                               | Devuelve la información provista por ID Uruguay sobre el usuario final autenticado.  Debe haberse llamado a `getToken` previamente.                                                                                                       |
| `logout()`                                                    | Abre una ventana del navegador web y cierra la sesión del usuario final en ID Uruguay, redirigiendo al *post_logout_redirect_uri* especificado en `initialize` una vez cerrada la sesión.                                                                                                                                          |

#### Función Initialize

Se debe inicializar el SDK con la función `initialize`, que recibe como parámetros: *redirect_uri*, *client_id*, *client_secret* y *post_logout_redirect_uri* para luego del logout.

```javascript
initialize('miRedirectUri', 'miClientId', 'miClientSecret', 'miPostLogoutRedirectUri');
```

Luego de esto, se considera que el SDK se encuentra inicializado correctamente.

#### Función Login

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

#### Función getToken

Una vez realizado el `login`, es posible obtener el `access_token` correpondiente al usuario final autenticado. Para esto se debe invocar a la función `getToken` del SDK:

```javascript
const token = await getToken();
```

Al igual que el `code`, el *token* retornado se guarda en el SDK, con lo que de no necesitar almacenar el *token*, también se puede llamar a `getToken` sin guardar la respuesta.

#### Función refreshToken

El *token* otorgado por ID Uruguay tiene un tiempo de expiración fijo, por lo que una vez transcurrido este tiempo, el *token* pasará a ser inválido. Para obtener un nuevo *token* se debe invocar a la función `refreshToken`.

```javascript
const token = await refreshToken();
```

Esta función requiere que la función `getToken` haya sido ejecutada de forma correcta.

#### Función getUserInfo

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

#### Función Logout

La función `logout` del SDK permite al usuario final cerrar su sesión con ID Uruguay.

Al llamar a esta función, se abre un navegador web en el dispositivo del usuario con la URL de cierre de sesión de ID Uruguay, que muestra al usuario final que se está realizando el cierre de sesión. Una vez finalizado el cierre de sesión, se redirige al *post_logout_redirect_uri* especificado al inicializar el SDK.

```javascript
await logout();
```

### Certificado *Self-Signed* en modo *Testing*

En modo de *testing*, es necesario agregar el certificado de la API de testing de ID Uruguay a los certificados confiables. Para lograr esto debe copiar el certificado certificate.cer en la carpeta `android/app/src/main/assets` de su proyecto *React Native*. Actualmente esta alternativa funciona únicamente para *Android*.

## Funcionalidades del componente SDK

Esta sección presenta las funcionalidades brindadas por el componente SDK. Para cada funcionalidad se explica su utilidad y la forma en la que se encuentra implementada. Puede resultar útil para aquellos desarrolladores que busquen entender con mayor detalle el funcionamiento del componente y realizar modificaciones.

### Funcionalidad de *Login*

#### Generalidades

La funcionalidad de **login** se encarga de autenticar al usuario final directamente ante el OP para lo cual se utiliza el navegador web del dispositivo móvil. El funcionamiento general del **login** consiste en una función que devuelve una [promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Usar_promesas). Para esto, primero se envía un *Authentication Request* al OP a través del navegador web, donde se incluyen los parámetros necesarios para que el OP pueda validar al RP. Los parámetros obligatorios enviados son: *scope*, *response_type*, *client_id* y *redirect_uri*.

Para validar al RP, el OP verifica que el *client_id* y *redirect_uri* enviados en la *Authentication Request* coinciden con los generados al momento del [registro](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integración+con+OpenID+Connect) del RP ante el OP. Una vez que el RP es validado, el usuario final puede realizar el proceso de autenticación y autorización directamente ante el OP a través del navegador web. En este proceso se deben ingresar las credenciales de Usuario gub.uy y autorizar al RP al acceso a los datos solicitados. Cuando esta acción finaliza el usuario final debe confirmar para volver a la aplicación.

En caso de éxito, es decir que la RP sea validada ante el OP y el usuario final realice el proceso de autorización y autenticación correctamente, la función de **login** devuelve el parámetro *code*. En caso contrario, ya sea porque no se pudo autenticar al RP, porque el usuario final no autoriza a la aplicación o porque no se puede realizar el *request*, se retorna una descripción acorde al error ocurrido.

#### Archivos y Parámetros

La implementación de la funcionalidad de *login* involucra los siguientes archivos:

- **sdk/requests/logout.js**: Donde se implementa la función **login**. Esta función se encarga de realizar el *Login Request*.
- **sdk/requests/index.js**: Donde se implementa la función **makeRequest**. Esta función invoca la función **login**.
- **sdk/interfaces/index.js**: Donde se invoca la función de **makeRequest**.
- **sdk/configuration/index.js**: Módulo de configuración de dónde se obtienen los parámetros necesarios.
- **sdk/utils/constants.js**: Contiene las constantes a utilizar.
- **sdk/utils/endpoints.js**: Contiene los *endpoints* a utilizar. Se obtienen los parámetros necesarios para realizar las *requests* invocando la función **getParameters** definida en el módulo de configuración.

La función **login** no recibe parámetros, sino que obtiene los parámetros necesarios a utilizar en el *request* a través del módulo de configuración y retorna una promesa. Cuando se resuelve dicha promesa se obtiene el *code*. En caso contrario, cuando se rechaza la promesa se retorna un código y descripción indicando el error correspondiente.

#### Código

La función de **login** es declarada como una función asincrónica de la siguiente manera:

```javascript
const login = async () => {
```

El fin de la función [*async*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/funcion_asincrona) es simplificar el uso de promesas. Esta función devolverá una promesa llamada *promise*, la cual es creada al principio del código. En el cuerpo de la función, dentro del bloque [*try*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), se declara un [*Event Listener*](https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener) que escuchará por eventos del tipo '*url*', y ejecutará la función **handleOpenUrl** en caso de un evento de este tipo. Para poder interactuar con el *browser*, se utiliza [Linking](https://reactnative.dev/docs/linking). Esto se puede ver en la siguiente línea:

```javascript
Linking.addEventListener('url', handleOpenUrl);
```

En este punto se tiene un *Event Listener* que queda esperando por un evento del tipo '*url*'. Luego, se verifica que los parámetros necesarios para realizar la autenticación se encuentren ya definidos en el módulo de configuración. Si alguno de estos parámetros no se encuentra inicializado, se rechaza la promesa con un mensaje de error correspondiente. Por otro lado, si se encuentran inicializados, la función intentaabrir el navegador con la *url* deseada para enviar al *Login Endpoint*. Esta *url* contendrá el *client_id*, la *redirect_uri* y opcionalmente *state*. Esto se puede ver a continuación:

```javascript
Linking.openURL(loginEndpoint())
```

Donde *loginEndpoint* se encuentra en el archivo *endpoints.js*, con el siguiente valor:

```javascript
https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}
```

Al abrir el *browser*, *Linking.openURL* devuelve una promesa, que se resuelve apenas se abre el *browser* o no. Luego, el usuario final ingresa sus credenciales y decide si confirmar el acceso por parte de la aplicación a los datos solicitados.

Una vez realizado el *request* se retorna un *response* que corresponde con un HTTP *redirect* a la *redirect_uri*, lo cual es detectado por el *Event Listener* como un evento *url*. Esto es visible para el usuario final a través de un mensaje desplegado en el *browser* que pregunta si desea volver a la aplicación. Luego, se ejecuta la función **handleOpenUrl**, donde el evento capturado es un objeto que tiene *key url* y *value* un *string*. Este *value* será la *url* que en caso de éxito contiene el *code* y en caso contrario un error correspondiente.

Adicionalmente, se intenta obtener el *code* a través de una expresión regular. En caso de encontrarse, se resuelve la promesa retornando dicho parámetro. En caso contrario se rechaza la promesa, con un mensaje de error correspondiente. Finalmente, se remueve el *Event Listener* para no seguir pendiente por más eventos. En el cuerpo de la función de **login** también se encuentra un bloque [*catch*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), que en caso de error remueve el *Event Listener*, rechaza la promesa y devuelve un mensaje de error acorde.

### Funcionalidad de *getToken*

#### Generalidades

La función **getToken** se encarga de la comunicación entre la aplicación de usuario y el *Token Endpoint*, de forma de obtener los datos correspondientes a un Token Request. El objetivo principal de esta función es obtener un *token* para posteriormente utilizarlo con el fin de adquirir información del usuario final previamente autenticado. Por ende, esta función depende del *code* obtenido en la función **login**, además de requerir los datos de autenticación del usuario (*client_id* y *client_secret*), y la *redirect_uri* correspondiente. A partir de estos datos se realiza una consulta *Token Request* con el método POST al *Token Endpoint*.

Como resultado de la solicitud se obtiene un *Token Response* conteniendo los parámetros correspondientes. En caso de éxito, los valores de estos parámetros son almacenados en el componente de configuración, y la función retorna el *access_token* generado. En caso contrario, se retorna al RP un código y descripción acorde al error ocurrido.

#### Archivos y Parámetros

La implementación de la funcionalidad de **getToken** se encuentra implementada en la función **getTokenOrRefresh**, ya que su implementación es compartida con la funcionaldiad de **refreshToken**. La misma involucra los siguientes archivos:

- **sdk/requests/getTokenOrRefresh.js**: Donde se implementan las funcionalidades de **getToken** y **refreshToken**.
- **sdk/requests/index.js**: Donde se implementa la función **makeRequest**. Esta función invoca a **getTokenOrRefresh**.
- **sdk/interfaces/index.js**: Donde se invoca la función **makeRequest** y se implementa la función de **getToken**.
- **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtienen los parámetros necesarios.
- **sdk/utils/constants.js**: Contiene las constantes necesarias.
- **sdk/utils/endpoints.js**: Contiene los *endpoints* a utilizar. Se obtienen los parámetros necesarios para realizar las *requests* invocando la función **getParameters** definida en el módulo de configuración.

La función **getTokenOrRefresh** recibe un solo parámetro, que indica si el request solicitado es del tipo **getToken** o **refreshToken**, y obtiene el resto de los parámetros necesarios a través del módulo de configuración. La función retorna una promesa, que cuando se resuelve retorna el *access_token*. En caso contrario, cuando se rechaza la promesa, se retorna un código y descripción indicando el error correspondiente.

#### Código

La función **getTokenOrRefresh** en el caso de la funcionalidad de **getToken** invoca a la función **makeRequest** con el parámetro REQUEST_TYPES.GET_TOKEN, indicando que es un *request* del tipo *getToken*. Esta última, recibe como único parámetro el tipo de *request*. Por lo tanto, la función toma los parámetros del componente configuración, que van a ser utilizados a la hora de realizar la solicitud.

Se utiliza la librería [base-64](https://github.com/mathiasbynens/base64) para codificar el *client_id* y el *client_secret* siguiendo el esquema de autenticación [HTTP Basic Auth](https://tools.ietf.org/html/rfc7617). A continuación se arma la solicitud, mediante la función `fetch` y se procede a su envío. Utilizando la función de sincronismos `await` se espera una posible respuesta por parte del *Token Endpoint*. Ante un error en la solicitud se entra al bloque *catch* y se retorna el error correspondiente.

 En caso de obtenerse una respuesta y que la misma sea exitosa, se *setean* los parámetros recibidos en el componente configuración, con la función **setParameters** y se resuelve la promesa con el valor correspondiente al *access_token*. En caso de error, se rechaza la promesa devolviendo el error recibido.

### Funcionalidad de *refreshToken*

#### Generalidades

La función **refreshToken** se encarga de obtener un nuevo *token*, cuando un *token* obtenido anteriormente se vuelve inválido o cuando simplemente se desea obtener uno nuevo. Por ende, esta función depende del *token* obtenido en la función **getToken**. A partir de este dato se realiza una consulta *Refresh Token Request* con el método POST al *Token Endpoint*.

Como resultado de la solicitud se obtiene un *Refresh Token Response* conteniendo los parámetros correspondientes, que serán los mismos que en un *Token Response*. En caso de éxito, los valores de estos parámetros son almacenados en el componente de configuración, y la función retorna el *access_token* generado. En caso contrario, se retorna al RP un código y descripción acorde al error ocurrido.

#### Archivos y Parámetros

La implementación de la funcionalidad de **refreshToken** involucra los mismos archivos y mismos parámetros que **getToken**, ya que sus funcionalidades se encuentran implementadas en la misma función.

#### Código

La función **getTokenOrRefresh** en el caso de la funcionalidad de **refreshToken** invoca a la función **makeRequest** con el parámetro REQUEST_TYPES.GET_REFRESH_TOKEN, indicando que es un *request* del tipo *refreshToken*. Luego, dentro de **makeRequest**, las implementaciones de **getToken** y **refreshToken** serán la misma, a diferencia del *body* de la solicitud *fetch*. En el caso de la funcionalidad **refreshToken**, el *body* solo necesita del *grant\_type* mencionado en *Refresh Token Request Params* y el *refresh_token* obtenido anteriormente a través de **getToken**.

### Funcionalidad de *Logout*

#### Generalidades

La funcionalidad de *logout* se encarga de cerrar la sesión del usuario final en el OP para lo cual se utiliza el navegador web del dispositivo móvil. El funcionamiento general del *logout* consiste en una función que devuelve una promesa. Para esto, primero se envía un *Logout Request* al OP a través del navegador web, donde se incluyen los parámetros necesarios para que el OP pueda efectuar el cierre de sesión. Los parámetros obligatorios enviados son: *id_token_hint* y *post_logout_redirect_uri*. El primero se corresponde con el *id_token* obtenido en la última *Get Token Request* o *Refresh Token Request*, mientras que el segundo se corresponde con la dirección a la cual el RP espera que se redireccione al usuario final una vez finalizado el proceso de cierre de sesión. Esta dirección deberá coincidir con la provista al momento del registro del RP ante el OP. Además de los parámetros obligatorios se tiene la opción de brindar el parámetro opcional *state*.

En caso de que los parámetros sean los correctos, la función de **logout** redirecciona al usuario final a la aplicación del RP, y si corresponde, devuelve el parámetro *state*. En caso contrario, se retorna una descripción acorde al error ocurrido.

#### Archivos y Parámetros

La implementación de la funcionalidad de *logout* involucra los siguientes archivos:

- **sdk/requests/logout.js**: Donde se implementa la función **logout**. Esta función se encarga de realizar la *Logout Request*.
- **sdk/requests/index.js**: Donde se implementa la función **makeRequest**. Esta función invoca la función **logout**.
- **sdk/interfaces/index.js**: Donde se invoca la función de **makeRequest**.
- **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtienen los parámetros necesarios.
- **sdk/utils/constants.js**: Contiene las constantes a utilizar.
- **sdk/utils/endpoints.js**: Contiene los *endpoints* a utilizar. Se obtienen los parámetros necesarios para realizar las *requests* invocando la función **getParameters** definida en el módulo de configuración.

La función **logout** no recibe parámetros, sino que obtiene los parámetros necesarios a utilizar en la *request* a través del módulo de configuración, en la función **logoutEndpoint** definida en el archivo de *endpoints* previamente mencionado, y retorna una promesa. Cuando se resuelve dicha promesa se obtiene un código y descripción indicando que la operación resultó exitosa, y si corresponde el parámetro *state*. En caso contrario, cuando se rechaza la promesa se retorna un código y descripción indicando el error correspondiente.

#### Código

La función de **logout** es declarada como una función asincrónica de la siguiente manera:

```javascript
const logout = async () => {
```

El fin de la función *async* es simplificar el uso de promesas. Esta función devolverá una promesa llamada *promise*, la cual es creada al principio del código. En el cuerpo de la función, dentro del bloque *try*, se declara un *Event Listener* que escucha por eventos del tipo '*url*', y ejecutará la función **handleOpenUrl** en caso de un evento de este tipo. Para poder interactuar con el *browser*, se utiliza linking. Esto se puede ver en la siguiente línea:

```javascript
Linking.addEventListener('url', handleOpenUrl);
```

En este punto se tiene un *Event Listener* que queda esperando por un evento del tipo *url*. Luego, se verifica que los parámetros necesarios para realizar el cierre de sesión se encuentren ya definidos en el módulo de configuración. Si alguno de estos parámetros no se encuentra inicializado, se rechaza la promesa con un mensaje de error correspondiente. Por otro lado, si se encuentran inicializados, la función intenta abrir el navegador con la *url* deseada para enviar al *Logout Endpoint*. Esta *url* contendrá el *id_token_hint*, el *post_logout_redirect_uri*, y opcionalmente *state*. Esto se puede ver a continuación

```javascript
Linking.openURL(logoutEndpoint())
```

Donde *logoutEndpoint* se encuentra en el archivo *endpoints.js*, con el siguiente valor:

```javascript
https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}
```

Al abrir el *browser*, *Linking.openURL* devuelve una promesa, que se resuelve apenas se abre el browser o no.

Una vez realizado el request se retorna un *response* que corresponde con un HTTP *redirect* a la *post_logout_redirect_uri*, lo cual es detectado por el *Event Listener* como un evento *url*. Esto es visible para el usuario final a través de un mensaje desplegado en el *browser* que pregunta si desea volver a la aplicación. Luego, se ejecuta la función **handleOpenUrl**, donde el evento capturado es un objeto que tiene *key url* y *value* un *string*. Este *value* será la *url* que en caso de éxito es la *post_logout_redirect_uri* (con *state* como parámetro si corresponde) y en caso contrario un error correspondiente.

En caso que la *url* retornada sea efectivamente dicha URI, se resuelve la promesa. En caso contrario se rechaza la promesa, con un mensaje de error correspondiente. Finalmente, se remueve el *Event Listener* para no seguir pendiente por más eventos. En el cuerpo de la función de **logout** también se encuentra un bloque *catch*, que en caso de error remueve el *Event Listener*, rechaza la promesa y devuelve un mensaje de error acorde.
