# SDK ID Uruguay
El propósito de esta documentación es proveer una guía pasos a paso a los desarrolladores interesados en integrar la función de inicio de sesión con ID Uruguay.

Este SDK se basa en el protocolo OAuth 2.0 y OpenID Connect para su implementación, brindando una capa de abstracción al usuario, simplificando su utilización.

## Instalación
Lo primero que se debe hacer es instalar la app mediante el comando: 

`$ npm install sdk-gubuy-test`

Esto añadirá las dependencias correspondientes al proyecto a desarrollar.

## Asignar el certificado

Actualmente funciona únicamente para Android. Lo que se debe hacer es copiar el certificado `certificate.cer` en la carpeta \app\android\app\src\main\assets.

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

Se debe crear un archivo con variables de ambiente `env.js` en la carpeta raíz del proyecto, con el siguiente contenido:

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

Donde YOUR_CLIENT_ID y YOUR_CLIENT_SECRET es el client id y client secret provisto por AGESIC. Este archivo .env no se versiona para proteger el client id y el client secret, con lo que es necesario que cada uno lo agregue a su ambiente de desarrollo, con su respectiva información.

### Componente de configuración

En caso de tener un archivo `env.js`, primero se debe obtener las constantes definidas en el, mediante los siguientes comandos:

```javascript
import ENV from './env';

/*...*/

const { sdkIdUClientId, sdkIdUClientSecret } = ENV();
```

Se debe inicializar el componente de configuración con la función `initialize`, ya teniendo definidos el `clientId` y el `clientSecret` en env.js.

Para esto se invoca al siguiente comando:

```javascript
initialize('redirect_uri', sdkIdUClientId, sdkIdUClientSecret);
```

Luego de esto, el componente de configuración estará inicializado correctamente.

### LoginButton
El botón de Login es el encargado de invocar a la función Login del sdk. En la [App de ejemplo](https://github.com/elirosselli/pis2020/blob/develop/app/LoginButton/index.js) se puede ver una posible implementación de este. 

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
La función `handleLogin` del LoginButton debe invocar a la función `login` del sdk. Esta retornará error en caso de que algo haya salido mal, o en su defecto, retornará el `authCode` correspondiente.

De esta forma, la función quedaría:

``` javascript
 const handleLogin = async () => {
    try {
      const code = await login();
    } catch (err) {
      /*
      Manejar el error.
      */
    }
  };
```


### Función getToken

Una vez obtenido el code en el proceso de `login`, es posible obtener el `access_token` correpondiente. Para esto se debe invocar a la función `getToken` del sdk, por ejemplo, con el siguiente código:

```javascript
const token = await getToken();
```

Una posible implementación es invocar a la función una vez obtenido el code, en el `handleLogin`, quedando este último:

```javascript
const handleLogin = async () => {
    try {
      const code = await login();
      const token = await getToken();
    } catch (err) {
     /*
      Manejar el error.
      */
    }
};
```

### Función refreshToken

El token otorgado por el OP tiene un tiempo de expiración fijo, por lo que una vez transcurrido este tiempo, el token pasará a ser inválido. Para obtener un nuevo token es suficiente con invocar a la función `refreshToken` del sdk:

```javascript
const token = await refreshToken();
```

Esta función requiere que la función `getToken` haya sido ejecutada de forma correcta.

### Función getUserInfo

Una vez obtenido el acces_token en el proceso de `getToken`, este se utiliza para solicitar información sobre el usuario al UserInfo Endpoint, y el UserInfo Endpoint retorna un listado de claims del usuario. 

Para realizar esto en la app se debe invocar la funcion `getUserInfo` del sdk, por ejemplo, con el siguiente código:

```javascript
const userInfo = await getUserInfo();
```
Una posible implementación es invocar a la función luego de obtener el access token en la funcion `handleLogin`:

```javascript
const LoginButton = ({ handleUserInfo }) => {
  const handleLogin = async () => {
    try {
      const code = await login();
      const token = await getToken();
      const userInfo = await getUserInfo();
      // Guardo Info de usuario en la APP
      handleUserInfo(userInfo);
    } catch (err) {
      /*
      Manejar el error.
      */
    }
};
```

Notar que en este ejemplo de implementación se llama a la función `handleUserInfo` pasada por parametros a `LoginButton`. En este caso `handleUserInfo` es una función en `App.js` que almacena el lo que se le pase como parametro en un state, para poder luego acceder a esa información y utilizarla.

Este es un ejemplo de como se puede invocar el componente `LoginButton`, para pode guardar la información del usuario conseguida mediante `getUserInfo` en la App:

```javascript
const App = () => {
  const [userInfo, setUserInfo] = useState({});
  return (
  ...
    <LoginButton handleUserInfo={setUserInfo} />
  ...
  );
};
```

### Función Logout

La función `logout` del sdk permite al usuario final cerrar su sesión con IdUruguay. 

Esta función toma los parámetros idToken, postLogoutRedirectUri, y opcionalmente state, y envía una solicitud al Logout Endpoint de la API con estos parámetros, cerrando la sesión del usuario final en el OP. Se abre además un browser mediante la librería Linking de react-native, que muestra al usuario final que efectivamente se está realizando el logout. 

De esta forma, una posible implementación es desde la app invocar esta funcionalidad mediante un componente `LogoutButton`, similar a como se mencionaba previamente como invocar al componente `LoginButton`. 

Un ejemplo del `LogoutButton` podría ser el siguiente:

 ```javascript
 const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      const redirectUri = await logout();
      console.log(`PostLogoutRedirectUri: ${redirectUri}`);
    } catch (err) {
      /*
      Manejar el error.
      */
    }
  };

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handleLogout}>
      <View style={styles.buttonSeparator}>
        <Image source={LogoAgesicSimple} style={styles.buttonLogo} />
      </View>
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  );
};
 ```