# PIS2020

## Metodología de desarrollo

### Instalación del proyecto

Para instalar el proyecto por primera vez se debe de instalar la branch `develop` y luego seguir las instrucciones correspondientes en cada carpeta.

### Sistema de branches y PRs

Al comenzar a trabajar en una feature, se deberá crear una nueva branch desde la branch `develop` con el nombre `feature/nombre-de-la-feature`.
Si se está arreglando un error o bug, la branch deberá llamarse `bugfix/nombre-del-bugfix`.

Una vez finalizado el trabajo en una feature (o bugfix), se deberá crear un Pull Request (PR) a la branch `develop`. Una vez creado el PR, otro implementador (o en casos muy complejos incluso dos) deberá revisarlo y aprobarlo (o pedirle al desarrollador que se realicen cambios). **Solo una vez aprobado el PR es que se debe hacer el merge a `develop`**.

La branch `master` está reservada únicamente para releases.
