# SDK React Native ID Uruguay
El propósito de esta documentación es proveer una guía paso a paso a los desarrolladores interesados en integrar la funcionalidad de autenticación con ID Uruguay a sus aplicaciones React Native. 

Este SDK se basa en el protocolo [OAuth 2.0](https://oauth.net/2/) y [OpenID Connect](https://openid.net/connect/) para su implementación, brindando una capa de abstracción al desarrollador y simplificando la interacción con la API REST de ID Uruguay. Para que su integración con el SDK funcione, debe registrarse como RP (_Relaying Party_) en ID Uruguay, siguiendo las instrucciones disponibles en la [página web de AGESIC](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect).

## Instalación
El SDK se encuentra disponible en npm y puede ser instalado mediante el comando

`$ npm install sdk-gubuy-test`

Este comando añadirá el SDK y las dependencias necesarias a su proyecto.


## Utilización

Para utilizar las funciones del SDK, se deben importar desde `sdk-gubuy-test`. Por ejemplo:

```javascript
  import { initialize, login } from 'sdk-gubyuy-test';
```

Antes de poder utilizar las funciones, se debe inicializar el SDK mediante la función `initialize`.

```javascript
  initizalize('miRedirectUri', 'miClientId', 'miClientSecret');
```
Los valores para los tres parámetros son provistos por ID Uruguay luego de [registrarse](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect) exitosamente como RP.

Una vez inicializado el componente, se puede realizar el login con ID Uruguay mediante una llamada a la función `login`:

```javascript
  await login();
```

Esta llamada podría realizarse cuando el usuario apreta un botón, como se muestra en el siguiente ejemplo:

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

| Función                                                      	| Descripción                                                                                                                                                                             	|
|--------------------------------------------------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| `initialize (redirectUri, clientId, clientSecret)` 	| Inicializa el SDK con los parámetros redirectUri, clientId y clientSecret, que serán utilizados en la interacción con la API de ID Uruguay.                                                                                         	|
| `login()`                                                     	| Abre una ventana del navegador web del dispositivo para que el usuario final digite sus credenciales e inicie sesión con ID Uruguay. Una vez iniciada la sesión, se realiza una redirección al redirectUri configurado y se devuelve el authentication code. <br>En caso de error, devuelve el mensaje correspondiente. 	|
| `getToken()`                                                   	| Devuelve el token correspondiente al usuario autenticado.                                                                                                    	|
| `refreshToken()`                                               	| Actualiza el token del usuario autenticado a partir del token actual y de un refresh_token obtenido al ejecutar el `login`.                                                                                                     	|
| `getUserInfo()`                                                	| Devuelve la información provista por ID Uruguay sobre el usuario autenticado.                                                                                                           	|
| `logout()`                                                     	| Abre una ventana del navegador web y cierra la sesión del usuario en ID Uruguay, redirigiendo a la aplicación una vez cerrada la sesión.                                                                                                                                            	|


### Función Initialize

Se debe inicializar el SDK con la función `initialize`, que recibe como parámetros su _redirect URI_, su _client id_, y su _client secret_.

```javascript
initialize('miRedirectUri', 'miClientId', 'miClientSecret');
```

Luego de esto, el SDK estará inicializado correctamente.

### Función Login

La función `login` abre una ventana en el navegador web del dispositivo con la URL del inicio de sesión con ID Uruguay (https://mi.iduruguay.gub.uy/login o https://mi-testing.iduruguay.gub.uy/login si se está en modo testing). Una vez que el usuario ingresa sus credenciales, este es redirigido a la _redirect URI_ configurada en la inicialización del SDK. Esta función devuelve el `authorization code` correspondiente al usuario autenticado, y en caso de error lanza una excepción.

``` javascript
  try {
    const code = await login();
    /* Hacer algo con el code */
    console.log(`Code: ${code}`);
  } catch (err) {
    /* Manejar el error */
  }
```

El `authorization code` retornado por la función se guarda internamente en el SDK durante la sesión del usuario (no se guarda en el dispositivo, solo en memoria). De no necesitar este código, se puede llamar al login sin guardar la respuesta:

``` javascript
  try { 
    await login();
  } catch (err) {
    /* Manejar el error */
  }
```

Se debe notar que si el usuario no inicia la sesión con ID Uruguay (ya sea porque cierra el navegador, o porque ingresa credenciales incorrectas), no se redirigirá a la _redirect URI_ especificada. 


### Función getToken

Una vez realizado el `login`, es posible obtener el `access_token` correpondiente al usuario autenticado. Para esto se debe invocar a la función `getToken` del SDK:

```javascript
const token = await getToken();
```

Al igual que el `authorization code`, el token retornado se guarda en el SDK, con lo que de no necesitar almacenar el token, también se puede llamar a getToken sin guardar la respuesta.

### Función refreshToken

El token otorgado por ID Uruguay tiene un tiempo de expiración fijo, por lo que una vez transcurrido este tiempo, el token pasará a ser inválido. Para obtener un nuevo token se debe invocar a la función `refreshToken`.

```javascript
const token = await refreshToken();
console.log(`New Token: ${token}`);
```

Esta función requiere que la función `getToken` haya sido ejecutada de forma correcta.

### Función getUserInfo

Info de getUserInfo

### Función Logout

Info de logout

## Certificado Self-Signed en modo Testing

En modo de testing, es necesario agregar el certificado de la API de testing de ID Uruguay a los certificados confiables. Para lograr esto debe copiar el certificado certificate.cer en la carpeta `android/app/src/main/assets` de su proyecto React Native. Actualmente esta alternativa funciona únicamente para Android. 




