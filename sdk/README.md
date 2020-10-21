# Introducción

En este documento se presentan las distintas funcionalidades brindadas por el componente SDK y una guía para lograr la integración del componente SDK con la aplicación. Además, se exponen definiciones previas necesarias para entender el protocolo utilizado para la autenticación y autorización del usuario final.

## Consideraciones Previas

Para lograr autenticar y autorizar al usuario final el componente SDK establece una comunicación con el servidor de *ID Uruguay* utilizando el protocolo *OpenID Connect 1.0*.
Este es un protocolo de identidad simple y de estándar abierto creado sobre el protocolo [OAuth 2.0](https://tools.ietf.org/html/rfc6749), el cual permite a aplicaciones cliente (*Relaying Party* - RP) verificar la identidad de un usuario final basado en la autenticación realizada por este en un Servidor de Autorización (*OpenID Provider* - OP), así como también obtener información personal del usuario final mediante el uso de una *API REST*.
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
    | *response_type* | Requerido | Valor que determina el tipo de flujo de autenticación a utilizar. En caso del *Authorization Code Flow*, es valor es "*code*".             |
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

    - *Logout Reponse*: respuesta HTTP (a una *Logout Request*) que no incluye parámetros. Esta respuesta es obtenida desde el *Logout Endpoint*.

Cabe destacar que ante un posible error la *response* generada por el OP contiene los siguientes parámetros:

| Parámetro         | Tipo      | Descripción                                                                                                  |
|-------------------|-----------|--------------------------------------------------------------------------------------------------------------|
| *error*             | Requerido | Un código de error de los descritos en [OAuth 2.0](https://tools.ietf.org/html/rfc6749#section-5.1)                                                             |
| *error_description* | Opcional  | Descripción del error que provee información para ayudar a los desarrolladores a entender el error ocurrido. |
| *state* | Recomendado | El valor exacto recibido del RP en el parámetro *state* del *request* correspondiente.

## Guía de instalación

(Poner aca la guia de instalacion que esta en el archivo instalacion.md de feature/documentacion-instalacion)

## Funcionalidades del componente SDK

Esta sección presenta las funcionalidades brindadas por el componente SDK. Para cada funcionalidad se explica su utilidad y la forma en la que se encuentra implementada.

### Funcionalidad de *Login*

#### Generalidades

La funcionalidad de **login** se encarga de autenticar al usuario final directamente ante el OP para lo cual se utiliza el navegador web del dispositivo móvil. El funcionamiento general del *login* consiste en una función que devuelve una [promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Usar_promesas). Para esto, primero se envía un *Authentication Request* al OP a través del navegador web, donde se incluyen los parámetros necesarios para que el OP pueda validar al RP. Los parámetros obligatorios enviados son: *scope*, *response_type*, *client_id* y *redirect_uri*.

Para validar al RP, el OP verifica que el *client_id* y *redirect_uri* enviados en la *Authentication Request* coinciden con los generados al momento del [registro](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integración+con+OpenID+Connect) del RP ante el OP. Una vez que el RP es validado, el usuario final puede realizar el proceso de autenticación y autorización directamente ante el OP a través del navegador web. En este proceso se deben ingresar las credenciales de Usuario gub.uy y autorizar al RP al acceso a los datos solicitados. Cuando esta acción finaliza el usuario final debe confirmar para volver a la aplicación.

En caso de éxito, es decir que la RP sea validada ante el OP y el usuario final realice el proceso de autorización y autenticación correctamente, la función de **Login** devuelve el parámetro *code*. En caso contrario, ya sea porque no se pudo autenticar al RP, porque el usuario final no autoriza a la aplicación o porque no se puede realizar el *request*, se retorna una descripción acorde al error ocurrido.

#### Archivos y Parámetros

La implementación de la funcionalidad de *login* involucra los siguientes archivos:

- **sdk/interfaces/index.js**: Donde se implementa la función de **login**.
- **sdk/requests/index.js**: La función de **login** utiliza la función **makeRequest** de este archivo, que se encarga de realizar el *request* mencionado anteriormente.
- **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtienen los parámetros necesarios.
- **sdk/requests/endpoints.js**: Contiene las constantes a utilizar.

La función **login** no recibe parámetros, sino que obtiene los parámetros necesarios a utilizar en el *request* a través del módulo de configuración y retorna una promesa. Cuando se resuelve dicha promesa se obtiene un código y descripción indicando que la operación resultó exitosa y el parámetro *code*. En caso contrario, cuando se rechaza la promesa se retorna un código y descripción indicando el error correspondiente.

#### Código

La función de **login** es declarada como una función asincrónica de la siguiente manera:

    const login = async () => {

El fin de la función [*async*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/funcion_asincrona) es simplificar el uso de promesas. Esta función devolverá una promesa llamada *promise*, la cual es creada al principio del código. En el cuerpo de la función, dentro del bloque [*try*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), se declara un [*Event Listener*](https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener) que escuchará por eventos del tipo '*url*', y ejecutará la función **handleOpenUrl** en caso de un evento de este tipo. Para poder interactuar con el *browser*, se utiliza [Linking](https://reactnative.dev/docs/linking). Esto se puede ver en la siguiente línea:

    Linking.addEventListener('url', handleOpenUrl);

En este punto se tiene un *Event Listener* que quedará esperando por un evento del tipo '*url*'. Luego, se ejecuta la función **makeRequest**, con el parámetro REQUEST_TYPES.LOGIN, indicando que es un *request* del tipo *login*.
Luego, la función obtiene los parámetros necesarios del módulo de configuración con la función **getParameters** (previamente inicializados a través de la función **initialize**) e intenta abrir el navegador con la *url* deseada para enviar al *Login Endpoint*. Esta *url* contendrá el *scope* deseado, el *response type*, *client\_id* indicado, *redirect\_uri* y opcionalmente *state*, *nonce*, *prompt* y *arc_values*. Esto se puede ver a continuación:

    Linking.openURL(loginEndpoint(parameters.clientId))

Donde *loginEndpoint* se encuentra en el archivo *endpoints.js*, con el siguiente valor:

    `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`

Al abrir el *browser*, *Linking.openURL* devuelve una promesa, que se resuelve apenas se abre el browser o no. Luego, el usuario final ingresa sus credenciales y decide si confirmar el acceso por parte de la aplicación a los datos solicitados.

Una vez realizado el *request* se retorna un *response* que corresponde con un HTTP *redirect* a la *redirect_uri*, lo cual es detectado por el *Event Listener* como un evento *url* (*redirect*). Esto es visible para el usuario final a través de un mensaje desplegado en el *browser* que pregunta si desea volver a la aplicación. Luego, se ejecuta la función **handleOpenUrl**, donde el evento capturado es un objeto que tiene *key url* y *value* un *string*. Este *value* será la *url* que en caso de éxito contiene el *code* y en caso contrario un error correspondiente.

Adicionalmente, se intenta obtener el *code* a través de una expresión regular. En caso de encontrarse, se resuelve la promesa retornando dicho parámetro. En caso contrario se rechaza la promesa, con un mensaje de error correspondiente. Finalmente, se remueve el *Event Listener* para no seguir pendiente por más eventos. En el cuerpo de la función de **login** también se encuentra un bloque [*catch*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), que en caso de error remueve el *Event Listener*, rechaza la promesa y devuelve un mensaje de error acorde.

### Funcionalidad de *getToken*

#### Generalidades

La función **getToken** se encarga de la comunicación entre la aplicación de usuario y el *Token Endpoint*, de forma de obtener los datos correspondientes a un Token Request. El objetivo principal de esta función es obtener un *token* para posteriormente utilizarlo con el fin de adquirir información del usuario final previamente autenticado. Por ende, esta función depende del *code* obtenido en la función **login**, además de requerir los datos de autenticación del usuario (*client_id* y *client_secret*), y la *redirect_uri* correspondiente. A partir de estos datos se realiza una consulta (*Token Request*) con el método POST al *Token Endpoint*, siguiendo lo definido en la [*API de ID Uruguay*](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect#section-ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect-Token+Endpoint+(/oidc/v1/token)).

Como resultado de la solicitud se obtiene un *Token Response* conteniendo los parámetros correspondientes. En caso de éxito, los valores de estos parámetros son almacenados en el componente de configuración, y la función retorna el *access_token* generado. En caso contrario, se retorna al usuario un código y descripción acorde al error ocurrido.

#### Archivos y Parámetros

La implementación de la funcionalidad de **getToken** involucra los siguientes archivos:

- **sdk/interfaces/index.js**: Donde se implementa la función de **getToken**.
- **sdk/requests/index.js**: La función de **getToken** utiliza la función **makeRequest** de este archivo, que se encarga de realizar el *request* mencionado anteriormente.
- **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtienen los parámetros necesarios.
- **sdk/requests/endpoints.js**: Contiene las constantes necesarias.

La función **getToken** no recibe parámetros, sino que obtiene los parámetros necesarios a través del módulo de configuración y retorna una promesa. Cuando se resuelve dicha promesa retorna el *access_token*. En caso contrario, cuando se rechaza la promesa se retorna un código y descripción indicando el error correspondiente.

#### Código

La función **getToken** invoca a la función **makeRequest** con el parámetro REQUEST_TYPES.GET_TOKEN, indicando que es un *request* del tipo *getToken*. Esta última, recibe como único parámetro el tipo de *request*. Por lo tanto, la función toma los parámetros del componente configuración, que van a ser utilizados a la hora de realizar la solicitud.

Se utiliza la librería [base-64](https://github.com/mathiasbynens/base64) para codificar el *clientId* y el *clientSecret* siguiendo el esquema de autenticación [HTTP Basic Auth](https://tools.ietf.org/html/rfc7617). A continuación se arma la solicitud, mediante la función `fetch` y se procede a su envío. Utilizando la función de sincronismos `await` se espera una posible respuesta por parte del *Token Endpoint*. Ante un error en la solicitud se entra al bloque *catch* y se retorna el error correspondiente.

 En caso de obtenerse una respuesta y que la misma sea exitosa, se setean los parámetros recibidos en el componente configuración, con la función **setParameters** y se resuelve la promesa con el valor correspondiente al *access_token*. En caso de error, se rechaza la promesa devolviendo el error recibido.

### Funcionalidad de *Logout*

(Poner aca la docu de logout que esta en el archivo readme.md de feature/documentacion-logout)
