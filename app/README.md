# Prototype App

## Instalación

Para instalar todas las dependencias necesarias se debe utilizar el comando `npm install`.

## Activación

Para prender el servidor debe utilizar el comando `expo start`.
Luego, cuando se activó con exito, se puede utilizar el comando `a` para probar el prototipo en Android (es necesario tener un simulador abierto, por ejemplo de Android Studio) o `i` para levantar un simulador de iPhone (solo disponible en macOS)

## Testing

Para testear se puede utilizar `npm run` seguido de alguno de los siguientes comandos: `test`, `testCoverage`, `testWatch`, `testDebug` y `updateSnapshots`. Las especifiaciones de estos comandos se encuentran en el archivo `package.json` dentro del objecto `scripts`.

Si al correr alguno de los comandos, ocurre algún error del estilo de `internal/validators.js:122     throw new ERR_INVALID_ARG_TYPE(name, 'string', value);` se recomienda ir a la consola y utilizar el comando `npm install --save-dev jest@latest`.
