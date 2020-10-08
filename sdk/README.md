# Funcionalidades del componente SDK
En este documento se explicarán las diferentes funcionalidades provistas por el componente SDK. En particular, se presentarán en detalle las funcionalidades de *Login*, ...

## Funcionalidad de *Login*

### Generalidades
La funcionalidad de **Login** se encarga de autenticar al usuario final directamente ante el OP (OpenID *Provider*), lo cual se logra abriendo el navegador web del dispósitivo móvil con la aplicación que utilice el componente. El funcionamiento general del *Login* consiste en una función que devuelve una promesa, que primero envía un *Authentication Request* al OP a través del navegador, donde se incluyen los parametros necesarios para la validación. Si el RP (*Relaying Party*) es validado de forma exitosa, entonces el usuario ingresa sus credenciales en el navegador y confirma (o no) los datos que le dará acceso al RP. En caso de éxito, la función de Login devolverá el código de autenticación, o en caso contrario un mensaje de error. En caso de que los parámetros de autenticación brindados no sean validados por el OP, o que el usuario final decida no compartir sus datos con el RP, se devuelve un mensaje de error acorde. 

### Archivos y Parámetros
La implementación de la funcionalidad de *Login* involucra los siguientes archivos:
* **sdk/interfaces/index.js**: Donde se implementa la función de **login**.
* **sdk/requests/index.js**: La función de login utilizará la función **makeRequest** de este archivo, que se encargará de realizar el *request* mencionado anteriormente.
  
La función **login** recibe como parámetro el **Client ID** del usuario (TODO: agregar parametros) y retorna una promesa, que cuando se resuelve devuelve un código de autenticación, o cuando se rechaza devuelve un mensaje de error correspondiente. 

### Código
La función de **login** es declarada como una función asincrónica de la siguiente manera:

    const login = async clientId => {

El fin de la función *async* es simplificar el uso de promesas. Esta función devolverá una promesa, declarada al principio del código, llamada *promise*. En el cuerpo de la función 