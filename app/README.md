# Prototype App

## Instalación y configuración

### React Native

Se deberá seguir las instrucciones de configuración de ambiente disponibles en la [documentación de React Native](https://reactnative.dev/docs/environment-setup), en la tab de "React Native CLI Quickstart", sección "Installing dependencies".

En Linux/Windows, esto incluye instalar Android Studio, y allí descargar un SDK específico. En MacOS, se deberá instalar XCode para poder levantar un emulador iOS, o Android Studio si se quiere levantar un emulador Android.

#### Errores

De encontrarse con algún error, puede ser útil la página de [Troubleshooting](https://reactnative.dev/docs/troubleshooting#content) de la documentación de React Native.

### Watchman y wml

Se utilizará [wml](https://github.com/wix/wml#readme) para poder ver los cambios realizados en el sdk reflejados en la aplicación de ejemplo sin necesidad de re-instalar el paquete sdk. Esta herramienta forma parte del ambiente de desarrollo y su configuración es local a cada computadora, con lo que se debe realizar la siguiente instalación antes de ejecutar la aplicación. Esta instalación y configuración debe ser realizada una única vez.

Para utilizar wml, es necesario instalar [watchman](https://facebook.github.io/watchman/), un servicio provisto por Facebook que observa cambios en los archivos. Para instalar watchman, se deben seguir los pasos explicados en [su documentación](https://facebook.github.io/watchman/docs/install.html). En sistemas operativos Linux o MacOS, se recomienda usar [homebrew](https://brew.sh/) para la instalación (si no está instalado en su sistema, se puede instalar fácilmente siguiendo los pasos en su sitio web). En sistemas Windows, se puede instalar watchman mediante una de las distribuciones binarias provistas en su documentación de instalación.

Una vez instalado watchman, se debe instalar wml. Para ello, se debe ir a la raíz del proyecto (pis2020) y ejecutar el comando:

`npm install -g wml`

Se observa que esta instalación de wml es global (no local al proyecto).

Por último, también en la raíz del proyecto, se debe ejecutar el comando:

`wml add ./sdk ./app/node_modules/sdk-gubuy-test`

Si al ejecutar el comando este devuelve un error de permisos, es posible que necesiten permisos de root para ejecutarlo, con lo que deberán ejecutarlo con `sudo`:

`sudo wml add ./sdk ./app/node_modules/sdk-gubuy-test`

Al ejecutar el comando, es posible que se muestre un mensaje similar a "Source folder is an npm package, add `node_modules` to ignored folders? Y/n", con la opción de responder que sí (Y) o que no (n). Se deberá confirmar con Y.

Este comando causa que cuando se ejecute wml, este detecte los cambios en la carpeta sdk y los copie automáticamente al sdk-gubuy-test en los node_modules de la aplicación de ejemplo, permitiendo así ver los cambios realizados en tiempo real y sin necesidad de re-instalar el paquete del sdk. Se observa que esto ocurre únicamente cuando se está ejecutando wml (las instrucciones para ejecutarlo se encuentran en la siguiente sección).

## Ejecutar la aplicación

### 1. Archivo con variables de ambiente

Primero, debe crear un archivo `env.js` en esta carpeta (app), con el siguiente contenido:

```javascript
const variables = {
    development: {
      sdkIdUClientId: "DEV_CLIENT_ID",
      sdkIdUClientSecret: "DEV_CLIENT_SECRET",
    },
    production: {
        sdkIdUClientId: "PROD_CLIENT_ID",
        sdkIdUClientSecret: "PROD_CLIENT_SECRET",
    },
  };
  const getEnvVariables = () => {
    return variables;
  };
  export default getEnvVariables; // export a reference to the function
```

Donde DEV_CLIENT_ID y DEV_CLIENT_SECRET es nuestro client id y client secret provisto por AGESIC para el modo testing, y PROD_CLIENT_ID y PROD_CLIENT_SECRET es nuestro client id y client secret provisto por AGESIC para el modo producción. Este archivo .env no se versiona para proteger el client id y el client secret, con lo que es necesario que cada uno lo agregue a su ambiente de desarrollo.

### 2. Instalación de paquetes

Se deberá ejecutar el comando `npm install` en la carpeta /sdk y luego en la carpeta /app para instalar los paquetes necesarios. Si está utilizando macOS, luego de utilizar el comando anterior deberá ir a la carpeta `ios` dentro de la carpeta app y utilizar el comando `pod install`.

### 3. Iniciar wml

Una vez instalados los paquetes, se debe ejecutar wml para que observe los cambios en el sdk y los copie a la aplicación de ejemplo. Esto se hace ejecutando el siguiente comando en la raíz del proyecto:

`wml start`

Deberían ver en la consola una salida con la lista de archivos que fueron copiados de la carpeta de origen (en este caso /sdk) a la de destino (/app/node_modules/sdk-gubuy-test).

**Nota para Windows:** En sistemas operativos Windows, es posible que el comando `wml start` no produzca ningún resultado. Para resolver esto, se debe probar ejecutar antes el comando `watchman watch C:\Users\%user%\AppData\Roaming\npm\node_modules\wml\src`, y luego si `wml start`.

### 4a. Ejecutar en Android

En el caso de estar probando en un dispositivo o emulador Android, se debe conectar el dispositivo (ver [documentación de React Native](https://reactnative.dev/docs/running-on-device)) o iniciar un emulador. Para ejecutar un emulador en Android Studio, se debe ir a "Configure", y en ese menú se debe seleccionar "AVD Manager". Tener en cuenta que el AVD debe utilizar el SDK Android previamente instalado.

Una vez iniciado el emulador, deberá ejecutar el comando `npx react-native start` dentro de la carpeta /app.

En otra terminal, ejecutar además el comando `npx react-native run-android` en la misma carpeta para ejecutar la aplicación en el emulador o dispositivo.

### 4b. Ejecutar en iOS

Ejectuar el comando `npx react-native run-ios` dentro de la carpeta /app.

Al ejectuar este comando, se abrirá un emulador iOS ejecutando la aplicación.
