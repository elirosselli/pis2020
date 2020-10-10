# Funcionalidades del componente SDK
En este documento se explicarán las diferentes funcionalidades provistas por el componente SDK. En particular, se presentarán en detalle las funcionalidades de *Login*, ...

## Funcionalidad de *Login*

### Generalidades
La funcionalidad de **Login** se encarga de autenticar al usuario final directamente ante el OP (OpenID *Provider*), lo cual se logra abriendo el navegador web del dispósitivo móvil con la aplicación que utilice el componente. El funcionamiento general del *Login* consiste en una función que devuelve una [promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Usar_promesas), que primero envía un *Authentication Request* al OP a través del navegador, donde se incluyen los parámetros necesarios para la validación. Si el RP (*Relaying Party*) es validado de forma exitosa, entonces el usuario ingresa sus credenciales en el navegador y confirma (o no) los datos que le dará acceso al RP. En caso de éxito, la función de Login devolverá el código de autenticación, o en caso contrario un mensaje de error. En caso de que los parámetros de autenticación brindados no sean validados por el OP, o que el usuario final decida no compartir sus datos con el RP, se devuelve un mensaje de error acorde. 

### Archivos y Parámetros
La implementación de la funcionalidad de *Login* involucra los siguientes archivos:
* **sdk/interfaces/index.js**: Donde se implementa la función de **login**.
* **sdk/requests/index.js**: La función de login utilizará la función **makeRequest** de este archivo, que se encargará de realizar el *request* mencionado anteriormente.
* **sdk/requests/endpoints.js**: Contiene constantes que serán utilizadas
  
La función **login** recibe como parámetro el **Client ID** del usuario (TODO: agregar parametros) y retorna una promesa, que cuando se resuelve devuelve un código de autenticación, o cuando se rechaza devuelve un mensaje de error acorde. 

### Código
La función de **login** es declarada como una función asincrónica de la siguiente manera:

    const login = async clientId => {

El fin de la función [*async*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/funcion_asincrona) es simplificar el uso de promesas. Esta función devolverá una promesa, creada al principio del código, llamada *promise*. En el cuerpo de la función, dentro del bloque [*try*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), se declara un [*Event Listener*](https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener) que escuchará por eventos del tipo 'url', y ejecutará la función **handleOpenUrl** en caso de un evento. Para poder interactuar con el *browser*, se utiliza [Linking](https://reactnative.dev/docs/linking). Esto se puede ver en la siguiente línea 

    Linking.addEventListener('url', handleOpenUrl);

Entonces, se tiene un *Event Listener* que quedará esperando por un evento del tipo url. Luego, se ejecuta la función **makeRequest**, con los parámetros REQUEST_TYPES.LOGIN y clientId. Esta función se encarga de abrir el navegador, con la url deseada para enviar al *Login Endpoint* conteniendo el *scope* deseado, el *response type*, *client id* indicado y la *redirect uri*. Este es el *request* que se encarga de solicitar al usuario sus credenciales y permisos. Esto se puede ver a continuación

    Linking.openURL(loginEndpoint(clientId))
Donde *loginEndpoint* encontrado en el archivo *endpoints.js* tiene el siguiente valor

    `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`

Y el valor de *redirectUri* se obtiene el mismo archivo. Al abrir el *browser* *Linking.openURL* devuelve una promesa, que se resuelve apenas se abre el browser o no. El usuario entonces ingresará sus credenciales y aceptará compartir los datos solicitados o no. Una vez realizado el request, la aplicación preguntará al usuario final si desea volver a la aplicación, lo cual detectará el *Event Listener* como un evento url (*redirect*). Entonces, se ejecutará la función **handleOpenUrl**. En esta última, el evento capturado es un objeto que tiene *key url* y *value* un *string*, donde este *value* será la *url* que contenga (o no) el código de autorización. Entonces, se intenta obtener el código de autorización a través de una expresión regular. En caso de encontrarse el código, se resuelve la promesa retornando el código, en caso contrario se rechaza la promesa, con un mensaje de error correspondiente. Luego, se remueve el *Event Listener* para no seguir esuchcando por más eventos. En el cuerpo de la función de **login** también se encuentra un bloque [*catch*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), que en caso de error remueve el *Event Listener*, rechaza la promesa y devuelve un mensaje de error acorde.