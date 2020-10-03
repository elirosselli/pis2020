# Prototype App

## Instalación y configuración

Se deberá seguir las instrucciones de configuración de ambiente disponibles en la [documentación de React Native](https://reactnative.dev/docs/environment-setup), en la tab de "React Native CLI Quickstart", sección "Installing dependencies".

En Linux/Windows, esto incluye instalar Android Studio, y allí descargar un SDK específico. En MacOS, se deberá instalar XCode para poder levantar un emulador iOS, o Android Studio si se quiere levantar un emulador Android.

Una vez instalado Android Studio (o XCode) y configurado lo necesario, se deberá ejecutar el comando
`npm install` en la carpeta /app para instalar los paquetes necesarios. Si esta utilizando macOS, luego de utilizar el comando anterior deberá ir a la carpeta `ios` y utilizar el comando `pod install`.

## Levantar la aplicación

Primero, debe crear un archivo `env.js` en esta carpeta (app), con el siguiente contenido:

```
const variables = {
    development: {
      sdkIdUClientId: "YOUR_CLIENT_ID",
    },
    production: {
        sdkIdUClientId: "YOUR_CLIENT_ID",
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

Donde YOUR_CLIENT_ID es nuestro client id provisto por AGESIC. Este archivo .env no se versiona para proteger este client id, con lo que es necesario que cada uno lo agregue a su ambiente de desarrollo.

### Android

En el caso de estar probando en un dispositivo o emulador Android, se debe conectar el dispositivo (ver [documentación](https://reactnative.dev/docs/running-on-device) de React Native) o iniciar un emulador. Para ejecutar un emulador en Android Studio, se debe ir a "Configure", y en ese menú se debe seleccionar "AVD Manager". Tener en cuenta que el AVD debe utilizar el SDK Android previamente instalado.

Una vez iniciado el emulador, deberá ejecutar el comando `npx react-native start` dentro de la carpeta /app.

En otra terminal, ejecutar además el comando `npx react-native run-android` en la misma carpeta para ejecutar la aplicación en el emulador o dispositivo.

### iOS

Ejectuar el comando `npx react-native run-ios` dentro de la carpeta /app.

Al ejectuar este comando, se abrirá un emulador iOS ejecutando la aplicación.

### Errores

De encontrarse con algún error, puede ser útil la página de [Troubleshooting](https://reactnative.dev/docs/troubleshooting#content) de la documentación de React Native.

## Realizar cambios en sdk

Luego de realizar cambios en el sdk, cuando se quieran ver reflejados en la aplicación de ejemplo, se debe ir a la carpeta /sdk y ejecutar el comando `npm pack`. Esto generará un `.tgz`.
Luego se debe ir a la carpeta /app y en el `package.json` editar la dependencia de `sdk-gubuy-test` y actualizar la ruta (por ejemplo `file:../sdk/sdk-gubuy-test-1.0.0.tgz`) del nuevo `tgz` (actualizar versión).
Por último se deberá ejecutar `npm install` en la carpeta /app para actualizar los nuevos node-modules con las dependencias nuevas.

Tener en cuenta que este procedimiento se debe realizar cada vez que se realicen cambios en el sdk y se quieran ver reflejados los cambios en la aplicación de ejemplo.
