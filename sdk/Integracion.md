# SDK ID Uruguay
El propósito de esta documentación es proveer a los desarrolladores interesados en integrar la función de inicio de sesión con ID Uruguay.

Este SDK se basa en el protocolo OAuth 2.0 y OpenID Connect para su implementación, brindando una capa de abstracción al usuario, simplificando su utilización.

## Instalación
Lo primero que se debe hacer es instalar la app mediante el comando 

`$ npm install sdk-gubuy-test`

Esto añadirá las dependencias correspondientes al proyecto a desarrollar.

## Asignar el certificado

Acá iría info sobre el certificado y donde copiarlo.

## Funcionalidades

| Función                                                      	| Descripción                                                                                                                                                                             	|
|--------------------------------------------------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| initialize (redirect_uri, clientId, clientSecret) 	| Define los parámetros redirect_uri, clientId y clientSecret en el componente configuración.                                                                                             	|
| login()                                                      	| Abre la ventana del navegador para que el usuario final digite sus credenciales e inicie sesión en el OP y devuelve el code. <br>En caso de error, devuelve el mensaje correspondiente. 	|
| getToken()                                                   	| Dado el code obtenido en la función login, obtiene el token correspondiente.                                                                                                            	|
| refreshToken()                                               	| Toma el refresh_token recibido previamente y solicita una actualización del token.                                                                                                      	|
| getUserInfo()                                                	| Toma el access_token actual y devuelve la información solicitada al usuario.                                                                                                            	|
| logout()                                                     	| Cierra la sesión del usuario en el endpoint.                                                                                                                                            	|


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

Info de getToken


### Función refreshToken

Info de refreshToken

### Función getUserInfo

Info de getUserInfo








