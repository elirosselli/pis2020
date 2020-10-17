# Funcionalidades del componente SDK
En este documento se explicarán las diferentes funcionalidades provistas por el componente SDK. En particular, se presentarán en detalle las funcionalidades de *Login*, ...

## Funcionalidad de *Login*

### Generalidades
La funcionalidad de **Login** se encarga de autenticar al usuario final directamente ante el OP (OpenID *Provider*), lo cual se logra abriendo el navegador web del dispositivo móvil con la aplicación que utilice el componente. El funcionamiento general del *Login* consiste en una función que devuelve una [promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Usar_promesas), que primero envía un *Authentication Request* al OP a través del navegador, donde se incluyen los parámetros necesarios para la validación. Si el RP (*Relaying Party*) es validado de forma exitosa, entonces el usuario ingresa sus credenciales en el navegador y confirma (o no) los datos a los cuales le dará acceso al RP. Una vez autenticado el usuario final, el mismo deberá darle permiso al navegador para volver a la aplicación. En caso de éxito, la función de Login devolverá el código de autenticación, o en caso contrario, ya sea porque no se pudo autenticar al RP, no se pudo autenticar al usuario final o el mismo no brindó los permisos necesarios, o no se pudo realizar el *request*, se retorna un mensaje de error acorde. 

### Archivos y Parámetros
La implementación de la funcionalidad de *Login* involucra los siguientes archivos:
* **sdk/interfaces/index.js**: Donde se implementa la función de **login**.
* **sdk/requests/index.js**: La función de login utilizará la función **makeRequest** de este archivo, que se encargará de realizar el *request* mencionado anteriormente.
*  **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtendrán parámetros necesarios.
* **sdk/requests/endpoints.js**: Contiene constantes que serán utilizadas.

  
La función **login** no recibe parámetros, sino que obtiene los parámetros necesarios a través del módulo de configuración y retorna una promesa, que cuando se resuelve retorna un código de autenticación, o cuando se rechaza retorna un mensaje de error acorde. 

### Código
La función de **login** es declarada como una función asincrónica de la siguiente manera:

    const login = async () => {

El fin de la función [*async*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/funcion_asincrona) es simplificar el uso de promesas. Esta función devolverá una promesa, creada al principio del código, llamada *promise*. En el cuerpo de la función, dentro del bloque [*try*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), se declara un [*Event Listener*](https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener) que escuchará por eventos del tipo 'url', y ejecutará la función **handleOpenUrl** en caso de un evento de este tipo. Para poder interactuar con el *browser*, se utiliza [Linking](https://reactnative.dev/docs/linking). Esto se puede ver en la siguiente línea 

    Linking.addEventListener('url', handleOpenUrl);

Entonces, se tiene un *Event Listener* que quedará esperando por un evento del tipo url. Luego, se ejecuta la función **makeRequest**, con el parámetro REQUEST_TYPES.LOGIN, indicando que es un *request* del tipo *login*. Esta función es la encargada de solicitar al usuario sus credenciales y permisos. 
Entonces, la función obtiene los parámetros necesarios del módulo de configuración con la función **getParameters()** (siendo previo su seteo a través de la función **initialize**) e intenta abrir el navegador con la url deseada para enviar al *Login Endpoint*. Esta url contendrá el *scope* deseado, el *response type*, *client id* indicado y la *redirect uri*. Esto se puede ver a continuación

    Linking.openURL(loginEndpoint(parameters.clientId))
Donde *loginEndpoint* está encontrado en el archivo *endpoints.js*, teniendo el siguiente valor

    `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`

Y donde el valor de *redirectUri* se obtiene del módulo de configuración. Al abrir el *browser* *Linking.openURL* devuelve una promesa, que se resuelve apenas se abre el browser o no. El usuario entonces ingresará sus credenciales y aceptará compartir los datos solicitados o no. Una vez realizado el request, la aplicación preguntará al usuario final si desea volver a la aplicación, lo cual detectará el *Event Listener* como un evento url (*redirect*). Entonces, se ejecutará la función **handleOpenUrl**. En esta última, el evento capturado es un objeto que tiene *key url* y *value* un *string*, donde este *value* será la *url* que contenga (o no) el código de autorización. Entonces, se intenta obtener el código de autorización a través de una expresión regular. En caso de encontrarse el código, se resuelve la promesa retornando el código, en caso contrario se rechaza la promesa, con un mensaje de error correspondiente. Luego, se remueve el *Event Listener* para no seguir escuchando por más eventos. En el cuerpo de la función de **login** también se encuentra un bloque [*catch*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), que en caso de error remueve el *Event Listener*, rechaza la promesa y devuelve un mensaje de error acorde.


## Funcionalidad de *getToken*

### Generalidades
La función **getToken** se encarga de la comunicación entre la aplicación de usuario  y el *Token Endpoint*, de forma de obtener los datos correspondientes a una *Token Request*. El fin principal de esta función será obtener un *token* para posteriormente utilizarlo con el fin de obtener información del usuario final previamente autenticado. Por ende, esta función depende del *authorization code* obtenido en la función ***login***, además de requerir los datos de autenticación del usuario (***clientId*** y ***clientSecret***), y la ***redirectUri*** correspondiente. A partir de estos datos se realiza una consulta (*Token Request*) con el método POST al tokenEnpoint, siguiendo lo definido en la [*API de ID Uruguay*](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect#section-ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect-Token+Endpoint+(/oidc/v1/token)). 

Como resultado de la solicitud, se obtiene una *Token Response*, que incluye los siguientes parámetros codificados como `application/json`. En caso de éxito, la respuesta HTTP tiene código `200 OK` y contiene los siguientes datos: 

| Parámetro     	| Tipo        	| Descripción                                                               	|
|---------------	|-------------	|---------------------------------------------------------------------------	|
| *access_token*  	| Requerido   	| *Access Token* emitido por el OP                                            	|
| *token_type*    	| Requerido   	| Tipo de *token*. Será siempre `Bearer`                                      	|
| *id_token*      	| Requerido   	| *ID Token* asociado a la sesión de autenticación                            	|
| *expires_in*    	| Recomendado 	| Tiempo de vida del *Access Token* en segundos. Valor por defecto 60 minutos 	|
| *refresh_token* 	| Opcional    	| Refresh Token que puede ser utilizado para obtener nuevos *Access Tokens*   	|

Estos datos serán guardados en el componente de configuración, y la función retornará únicamente el *access_token* generado.


En caso de error, la respuesta tiene un código de error `HTTP 400 Bad Request` y tiene la siguiente estructura:
| Parámetro         	| Tipo      	| Descripción                                                                                                  	|
|-------------------	|-----------	|--------------------------------------------------------------------------------------------------------------	|
| *error*             	| Requerido 	| Un código de error de los descritos en [OAuth 2.0](https://tools.ietf.org/html/rfc6749#section-5.1)                                                             	|
| *error_description* 	| Opcional  	| Descripción del error que provee información para ayudar a los desarrolladores a entender el error ocurrido. 	|

Los datos de error son devueltos como resultado de la función **makeRequest**.



### Archivos y Parámetros

La implementación de la funcionalidad de *getToken* involucra los siguientes archivos:
* **sdk/interfaces/index.js**: Donde se implementa la función de **getToken**.
* **sdk/requests/index.js**: La función de *getToken* utilizará la función **makeRequest** de este archivo, que se encargará de realizar el *request* mencionado anteriormente.
*  **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtendrán parámetros necesarios.
* **sdk/requests/endpoints.js**: Contiene constantes que serán utilizadas.

  
La función **getToken** no recibe parámetros, sino que obtiene los parámetros necesarios a través del módulo de configuración y retorna una promesa, que cuando se resuelve retorna el `access_token`, o cuando se rechaza retorna un mensaje de error acorde. 


### Código

La función **getToken** implementada en `interfaces/index.js` cumple la función de invocar a la función ***makeRequest*** con el parámetro REQUEST_TYPES.GET_TOKEN, indicando que es un *request* del tipo *getToken*.

La función **makeRequest** implementada en `requests/index.js` recibe como único parámetro el tipo de request. Dada esta situación, la función toma los parámetros del componente configuración, que van a ser utilizados a la hora de realizar la solicitud.

Entonces, la función utiliza la librería [base-64](https://github.com/mathiasbynens/base64) para codificar el *clientId* y el *clientSecret* siguiendo el esquema de autenticación [HTTP Basic Auth](https://tools.ietf.org/html/rfc7617). A continuación se arma la solicitud, mediante la función `fetch` y se procede a su envío. Utilizando la función de sincronismos `await` se espera una posible respuesta por parte del *endpoint*, o error en la solicitud, entrando al bloque *catch* y retornando el error correspondiente.

Cuando se obtiene una respuesta, la misma puede tener código 200, indicando éxito, o 400, indicando error en la solicitud, como fue mencionado anteriormente. En caso de éxito, se setean los parámetros recibidos en el componente configuración, con la función **setParameters** y se resuelve la promesa con el valor correspondiente al *access_token*. En caso de error, se rechaza la misma devolviendo el error recibido.