# Prototype App

## Instalación y configuración

Se deberá seguir las instrucciones de configuración de ambiente disponibles en la [documentación de React Native](https://reactnative.dev/docs/environment-setup), en la tab de "React Native CLI Quickstart", sección "Installing dependencies". 

En Linux/Windows, esto incluye instalar Android Studio, y allí descargar un SDK específico. En MacOS, se deberá instalar XCode para poder levantar un emulador iOS, o Android Studio si se quiere levantar un emulador Android.

Una vez instalado Android Studio (o XCode) y configurado lo necesario, se deberá ejecutar el comando
`npm install`
para instalar los paquetes necesarios. 


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

Se deberá levantar un emulador (Android o iOS), o conectar un dispositivo real a la computadora. Para levantar un emulador en Android Studio, se debe ir a "Configure", y en ese menú se debe seleccionar "AVD Manager". Tener en cuenta que el AVD debe utilizar el SDK previamente instalado deberá ejecutar el comando
`npx react-native start`

En otra terminal, ejecutar además el comando
`npx react-native run-android` o `npx react-native run-ios`
para levantar la aplicación en el emulador o dispositivo. 

De encontrarse con algún error, puede ser útil la página de [Troubleshooting](https://reactnative.dev/docs/troubleshooting#content) de la documentación de React Native.
