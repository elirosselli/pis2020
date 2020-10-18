# SDK React Native ID Uruguay
El propósito de esta documentación es proveer una guía paso a paso a los desarrolladores interesados en integrar la funcionalidad de autenticación con ID Uruguay a sus aplicaciones React Native. 

Este SDK se basa en el protocolo [OAuth 2.0](https://oauth.net/2/) y [OpenID Connect](https://openid.net/connect/) para su implementación, brindando una capa de abstracción al desarrollador y simplificando la interacción con la API de Id Uruguay. Para que su integración con el SDK funcione, debe registrarse como RP (_Relaying Party_) en Id Uruguay, siguiendo las instrucciones disponibles en la [página web de AGESIC](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integraci%C3%B3n+con+OpenID+Connect)

## Instalación
El SDK se encuentra disponible en npm y puede ser instalado mediante el comando

`$ npm install sdk-gubuy-test`

Este comando añadirá el SDK y las dependencias necesarias a su proyecto.

## Asignar el certificado

En modo de testing, es necesario agregar el certificado de la API de testing de ID Uruguay a los certificados confiables. Para lograr esto debe copiar el certificado certificate.cer en la carpeta `android/app/src/main/assets` de su proyecto React Native. Actualmente esta alternativa funciona únicamente para Android. 

## Funcionalidades

| Función                                                      	| Descripción                                                                                                                                                                             	|
|--------------------------------------------------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| `initialize (redirect_uri, clientId, clientSecret)` 	| Define los parámetros redirect_uri, clientId y clientSecret en el componente configuración.                                                                                             	|
| `login()`                                                     	| Abre una ventana del navegador web del dispositivo para que el usuario final digite sus credenciales e inicie sesión con ID Uruguay. Una vez iniciada la sesión, se realiza una redirección al redirect_uri configurado y se devuelve el authentication code. <br>En caso de error, devuelve el mensaje correspondiente. 	|
| `getToken()`                                                   	| Devuelve el token correspondiente al usuario autenticado.                                                                                                    	|
| `refreshToken()`                                               	| Actualiza el token del usuario autenticado a partir del token actual y de un refresh_token obtenido al ejecutar el `login`.                                                                                                     	|
| `getUserInfo()`                                                	| Devuelve la información provista por ID Uruguay sobre el usuario autenticado.                                                                                                           	|
| `logout()`                                                     	| Abre una ventana del navegador web y cierra la sesión del usuario en ID Uruguay, redirigiendo a la aplicación una vez cerrada la sesión.                                                                                                                                            	|


## Utilización

### Archivo con variables de ambiente (Opcional) 

Se recomienda crear un archivo con variables de ambiente `env.js` en la carpeta raíz del proyecto, con el siguiente contenido:

```javascript
const variables = {
    development: {
      sdkIdUClientId: "YOUR_CLIENT_ID",
      sdkIdUClientSecret: "YOUR_CLIENT_SECRET",
    },
    production: {
        sdkIdUClientId: "YOUR_CLIENT_ID",
        sdkIdUClientSecret: "YOUR_CLIENT_SECRET",
    },
  };

  const getEnvVariables = () => {
    if (__DEV__) {
      return variables.development; // return this if in development mode
    }
    return variables.production; // otherwise, return this
  };

  export default getEnvVariables; // export a reference to the function
```

Donde YOUR_CLIENT_ID y YOUR_CLIENT_SECRET es nuestro client id y client secret provisto por AGESIC. Este archivo .env no se versiona para proteger el client id y el client secret, con lo que es necesario que cada uno lo agregue a su ambiente de desarrollo.

### Componente de configuración

En caso de tener un archivo `env.js`, primero se debe obtener las constantes definidas en el, mediante los comandos

```javascript
import ENV from './env';

/*...*/

const { sdkIdUClientId, sdkIdUClientSecret } = ENV();
```

Se debe inicializar el componente de configuración con la función `initialize`, y teniendo definidos el `clientId` y el `clientSecret`.

Para esto se invoca al siguiente comando:

```javascript
initialize('redirect_uri', sdkIdUClientId, sdkIdUClientSecret);
```

Luego de esto, el componente de configuración estará inicializado correctamente.

### LoginButton
El botón de Login es el encargado de invocar a la función Login del sdk. En la [App de ejemplo]() se puede ver una posible implementación de este. 

 ```javascript
 const LoginButton = () => {
  const handleLogin = async () => {
    try {
      /*
        Manejar el login
      */
    } catch (err) {
      /*
        Manejar el error
      */
    }
  };

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
      <View style={styles.buttonSeparator}>
        <Image source={LogoAgesicSimple} style={styles.buttonLogo} />
      </View>
      <Text style={styles.buttonText}>Login con USUARIO gub.uy</Text>
    </TouchableOpacity>
  );
};
 ```

### Función Login
La función `handleLogin` del LoginButton debe invocar a la función login del sdk. Esta retornará error en caso de que algo haya salido mal, o en su defecto, retornará el `authCode` correspondiente.

De esta forma, la función quedaría:

``` javascript
 const handleLogin = async () => {
    try {
      const code = await login();
      console.log(`Code: ${code}`);
    } catch (err) {
      /*
      Manejar el error.
      */
    }
  };
```


### Función getToken

Una vez obtenido el code en el proceso de `login`, es posible obtener el `access_token` correpondiente. Para esto se debe invocar a la función `getToken`, por ejemplo, con el siguiente código:

```javascript
const token = await getToken();
console.log(`Token: ${token}`);
```

Una posible implementación es invocar a la función una vez obtenido el code, en el `handleLogin`, quedando este último:

```javascript
const handleLogin = async () => {
    try {
      const code = await login();
      console.log(`Code: ${code}`);
      const token = await getToken();
      console.log(`Token: ${token}`);
    } catch (err) {
     /*
      Manejar el error.
      */
    }
};
```

### Función refreshToken

El token otorgado por el OP tiene un tiempo de expiración fijo, por lo que una vez transcurrido este tiempo, el token pasará a ser inválido. Para obtener un nuevo token es suficiente con invocar a la función `refreshToken`.

```javascript
const token = await refreshToken();
console.log(`New Token: ${token}`);
```

Esta función requiere que la función `getToken` haya sido ejecutada de forma correcta.

### Función getUserInfo

Info de getUserInfo

### Función Logout

Info de logout






