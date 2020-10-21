

## Funcionalidad de *getToken*

### Generalidades
La función **getToken** se encarga de la comunicación entre la aplicación de usuario y el *Token Endpoint*, de forma de obtener los datos correspondientes a un Token Request. El objetivo principal de esta función es obtener un *token* para posteriormente utilizarlo con el fin de adquirir información del usuario final previamente autenticado. Por ende, esta función depende del *code* obtenido en la función **login**, además de requerir los datos de autenticación del usuario (*client_id* y *client_secret*), y la *redirect_uri* correspondiente. A partir de estos datos se realiza una consulta (*Token Request*) con el método POST al *Token Endpoint*, siguiendo lo definido en la [*API de ID Uruguay*](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect#section-ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect-Token+Endpoint+(/oidc/v1/token)).

Como resultado de la solicitud se obtiene un *Token Response* conteniendo los parámetros correspondientes que son presentados en la sección Glosario. En caso de éxito, los valores de estos parámetros son almacenados en el componente de configuración, y la función retorna el *access_token* generado. En caso contrario, se retorna al usuario un código y descripción acorde al error ocurrido. 


### Archivos y Parámetros

La implementación de la funcionalidad de **getToken** involucra los siguientes archivos:
* **sdk/interfaces/index.js**: Donde se implementa la función de **getToken**.
* **sdk/requests/index.js**: La función de **getToken** utiliza la función **makeRequest** de este archivo, que se encarga de realizar el *request* mencionado anteriormente.
*  **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtienen los parámetros necesarios.
* **sdk/requests/endpoints.js**: Contiene las constantes necesarias.

  
La función **getToken** no recibe parámetros, sino que obtiene los parámetros necesarios a través del módulo de configuración y retorna una promesa. Cuando se resuelve dicha promesa retorna el *access_token*. En caso contrario, cuando se rechaza la promesa se retorna un código y descripción indicando el error correspondiente.


### Código

La función **getToken** invoca a la función **makeRequest** con el parámetro REQUEST_TYPES.GET_TOKEN, indicando que es un *request* del tipo *getToken*. Esta última, recibe como único parámetro el tipo de *request*. Por lo tanto, la función toma los parámetros del componente configuración, que van a ser utilizados a la hora de realizar la solicitud.


Se utiliza la librería [base-64](https://github.com/mathiasbynens/base64) para codificar el *clientId* y el *clientSecret* siguiendo el esquema de autenticación [HTTP Basic Auth](https://tools.ietf.org/html/rfc7617). A continuación se arma la solicitud, mediante la función `fetch` y se procede a su envío. Utilizando la función de sincronismos `await` se espera una posible respuesta por parte del *Token Endpoint*. Ante un error en la solicitud se entra al bloque *catch* y se retorna el error correspondiente.

 En caso de obtenerse una respuesta y que la misma sea exitosa, se setean los parámetros recibidos en el componente configuración, con la función **setParameters** y se resuelve la promesa con el valor correspondiente al *access_token*. En caso de error, se rechaza la promesa devolviendo el error recibido.