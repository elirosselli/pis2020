# Funcionalidades del componente SDK
En este documento se explicarán las diferentes funcionalidades provistas por el componente SDK. En particular, se presentarán en detalle las funcionalidades de *Login*, ...

## Funcionalidad de *Login*

### Generalidades
La funcionalidad de **Login** se encarga de autenticar al usuario final directamente ante el OP (OpenID *Provider*) para lo cual se utiliza el navegador web del dispositivo móvil. El funcionamiento general del *Login* consiste en una función que devuelve una [promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Usar_promesas). Para esto, primero se envía un *Authentication Request* al OP a través del navegador web, donde se incluyen los parámetros necesarios para que el OP pueda validar al RP (Relaying Party). Los parámetros obligatorios enviados son: *scope*, *response_type*, *client_id* y *redirect_uri* (para una lista exhaustiva de todos los parámetros presentes en la *Authentication Request* y su propósito se tiene la sección ...).

Para validar al RP, el OP verifica que el client_id y redirect_uri enviados en la *Authentication Request* coinciden con los generados al momento del [registro](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integración+con+OpenID+Connect) del RP ante el OP. Una vez que el RP es validado, el usuario final puede realizar el proceso de autenticación y autorización directamente ante el OP a través del navegador web. En este proceso se deben ingresar las credenciales de Usuario gub.uy y autorizar al RP al acceso a los datos solicitados. Cuando esta acción finaliza el usuario final debe confirmar para volver a la aplicación.

En caso de éxito, es decir que la RP sea validada ante el OP y el usuario final realice el proceso de autorización y autenticación correctamente, la función de Login devuelve el parámetro code. En caso contrario, ya sea porque no se pudo autenticar al RP, porque el usuario final no autoriza a la aplicación o porque no se puede realizar el request, se retorna una descripción acorde al error ocurrido.

### Archivos y Parámetros
La implementación de la funcionalidad de *Login* involucra los siguientes archivos:
* **sdk/interfaces/index.js**: Donde se implementa la función de **login**.
* **sdk/requests/index.js**: La función de login utilizará la función **makeRequest** de este archivo, que se encargará de realizar el *request* mencionado anteriormente.
*  **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtendrán parámetros necesarios.
* **sdk/requests/endpoints.js**: Contiene constantes que serán utilizadas.

  
La función **login** no recibe parámetros, sino que obtiene los parámetros necesarios a utilizar en el request a través del módulo de configuración y retorna una promesa. Cuando se resuelve dicha promesa se obtiene un código y descripción indicando que la operación resultó exitosa y el parámetro code. En caso contrario, cuando se rechaza la promesa se retorna un código y descripción indicando el error correspondiente.

### Código
La función de **login** es declarada como una función asincrónica de la siguiente manera:

    const login = async () => {

El fin de la función [*async*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/funcion_asincrona) es simplificar el uso de promesas. Esta función devolverá una promesa llamada *promise*, la cual es creada al principio del código. En el cuerpo de la función, dentro del bloque [*try*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), se declara un [*Event Listener*](https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener) que escuchará por eventos del tipo 'url', y ejecutará la función **handleOpenUrl** en caso de un evento de este tipo. Para poder interactuar con el *browser*, se utiliza [Linking](https://reactnative.dev/docs/linking). Esto se puede ver en la siguiente línea 

    Linking.addEventListener('url', handleOpenUrl);

Entonces, se tiene un *Event Listener* que quedará esperando por un evento del tipo url. Luego, se ejecuta la función **makeRequest**, con el parámetro REQUEST_TYPES.LOGIN, indicando que es un *request* del tipo *login*. Esta función es la encargada de solicitar al usuario sus credenciales y permisos. 
Luego, la función obtiene los parámetros necesarios del módulo de configuración con la función **getParameters()** (previamente inicializados a través de la función **initialize**) e intenta abrir el navegador con la url deseada para enviar al *Login Endpoint*. Esta url contendrá el *scope* deseado, el *response type*, *client id* indicado, *redirect uri* y opcionalmente *state*, *nonce*, *prompt* y *arc_values*. Esto se puede ver a continuación

    Linking.openURL(loginEndpoint(parameters.clientId))

Donde *loginEndpoint* se encuentra en el archivo *endpoints.js*, con el siguiente valor:

    `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`

Al abrir el *browser*, *Linking.openURL* devuelve una promesa, que se resuelve apenas se abre el browser o no. Luego, el usuario final ingresa sus credenciales y decide si confirmar el acceso por parte de la aplicación a los datos solicitados.

Una vez realizado el request se retorna un *response* que corresponde con un HTTP *redirect* a la *redirect_uri*, lo cual es detectado por el *Event Listener* como un evento url (*redirect*). Esto es visible para el usuario final a través de un mensaje desplegado en el *browser* que pregunta si desea volver a la aplicación. Luego, se ejecuta la función **handleOpenUrl**, donde el evento capturado es un objeto que tiene *key url* y *value* un *string*. Este *value* será la *url* que en caso de éxito contiene el *code* y en caso contrario un error correspondiente. Esta función intenta obtener el *code* a través de una expresión regular. En caso de encontrarse, se resuelve la promesa retornando dicho parámetro. En caso contrario se rechaza la promesa, con un mensaje de error correspondiente. Finalmente, se remueve el *Event Listener* para no seguir pendiente por más eventos. En el cuerpo de la función de **login** también se encuentra un bloque [*catch*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), que en caso de error remueve el *Event Listener*, rechaza la promesa y devuelve un mensaje de error acorde.
