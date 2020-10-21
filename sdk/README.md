# Funcionalidades del componente SDK
En este documento se explicarán las diferentes funcionalidades provistas por el componente SDK. En particular, se presentarán en detalle las funcionalidades de *Logout*, ...

## Funcionalidad de *Logout*

### Generalidades
La funcionalidad de **Logout** se encarga de cerrar la sesión del usuario final en el OP (OpenID *Provider*) para lo cual se utiliza el navegador web del dispositivo móvil. El funcionamiento general del *Logout* consiste en una función que devuelve una [promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Usar_promesas). Para esto, primero se envía una *Logout Request* al OP a través del navegador web, donde se incluyen los parámetros necesarios para que el OP pueda efectuar el cierre de sesión. Los parámetros obligatorios enviados son: *id_token_hint* y *post_logout_redirect_uri*. El primero se corresponde con el *id_token* obtenido en la última *Get Token Request* o *Refresh Token Request*, mientras que el segundo se corresponde con la dirección a la cual el RP espera que se redireccione al usuario final una vez finalizado el proceso de cierre de sesión. Esta dirección deberá coincidir con la provista al momento del [registro](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integración+con+OpenID+Connect) del RP ante el OP.

Además de los parámetros obligatorios se tiene la opción de brindar un parámetro opcional *state*, el cual es un valor opaco que tiene la función de mantener el estado entre el pedido y la respuesta.

En caso de que los parámetros sean los correctos, la función de Logout redirecciona al usuario final a la aplicación del RP, y si corresponde, devuelve el parámetro *state*. En caso contrario, se retorna una descripción acorde al error ocurrido.

### Archivos y Parámetros
La implementación de la funcionalidad de *Logout* involucra los siguientes archivos:
* **sdk/requests/logout.js**: Donde se implementa la función **logout**. Esta función se encarga de realizar la *Logout Request*.
* **sdk/requests/index.js**: Donde se implementa la función **makeRequest**. Esta función invoca la función **logout**.
* **sdk/interfaces/index.js**: Donde se invoca la función de **makeRequest**.
*  **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtendrán parámetros necesarios.
* **sdk/utils/constants.js**: Contiene constantes que serán utilizadas.
* **sdk/utils/endpoints.js**: Contiene los endpoints que serán utilizados. Se obtienen los parámetros necesarios para realizar las *requests* invocando la función **getParameters()** definida en el módulo de configuración.

La función **logout** no recibe parámetros, sino que obtiene los parámetros necesarios a utilizar en la request a través del módulo de configuración, en la función **logoutEndpoint()** definida en el archivo de *endpoints* previamente mencionado, y retorna una promesa. Cuando se resuelve dicha promesa se obtiene un código y descripción indicando que la operación resultó exitosa, y si corresponde, el parámetro *state*. En caso contrario, cuando se rechaza la promesa se retorna un código y descripción indicando el error correspondiente.

### Código
La función de **logout** es declarada como una función asincrónica de la siguiente manera:

    const logout = async () => {

El fin de la función [*async*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/funcion_asincrona) es simplificar el uso de promesas. Esta función devolverá una promesa llamada *promise*, la cual es creada al principio del código. En el cuerpo de la función, dentro del bloque [*try*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), se declara un [*Event Listener*](https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener) que escuchará por eventos del tipo 'url', y ejecutará la función **handleOpenUrl** en caso de un evento de este tipo. Para poder interactuar con el *browser*, se utiliza [Linking](https://reactnative.dev/docs/linking). Esto se puede ver en la siguiente línea 

    Linking.addEventListener('url', handleOpenUrl);

Entonces, se tiene un *Event Listener* que quedará esperando por un evento del tipo url. Luego, se verifica que los parámetros necesarios para realizar el cierre de sesión se encuentren ya definidos en el módulo de configuración. Si alguno de estos parámetros no se encuentra inicializado, se rechaza la promesa con un mensaje de error correspondiente. Por otro lado, si se encuentran inicializados, la función intenta abrir el navegador con la url deseada para enviar al *Logout Endpoint*. Esta url contendrá el *id_token_hint*, el *post_logout_redirect_uri*, y opcionalmente *state*. Esto se puede ver a continuación

    Linking.openURL(logoutEndpoint())

Donde *logoutEndpoint* se encuentra en el archivo *endpoints.js*, con el siguiente valor:

    `https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}`

Al abrir el *browser*, *Linking.openURL* devuelve una promesa, que se resuelve apenas se abre el browser o no.

Una vez realizado el request se retorna un *response* que corresponde con un HTTP *redirect* a la *post_logout_redirect_uri*, lo cual es detectado por el *Event Listener* como un evento url (*redirect*). Esto es visible para el usuario final a través de un mensaje desplegado en el *browser* que pregunta si desea volver a la aplicación. Luego, se ejecuta la función **handleOpenUrl**, donde el evento capturado es un objeto que tiene *key url* y *value* un *string*. Este *value* será la *url* que en caso de éxito es la *post_logout_redirect_uri* (con *state* como parámetro si corresponde) y en caso contrario un error correspondiente. En caso de que la *url* retornada sea efectivamente dicha URI, se resuelve la promesa. En caso contrario se rechaza la promesa, con un mensaje de error correspondiente. Finalmente, se remueve el *Event Listener* para no seguir pendiente por más eventos. En el cuerpo de la función de **logout** también se encuentra un bloque [*catch*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), que en caso de error remueve el *Event Listener*, rechaza la promesa y devuelve un mensaje de error acorde.