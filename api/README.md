# Mock API con FastAPI 

## Descripción

Este módulo se utilizará como mock de la API Rest de Usuario gub.uy para el desarrollo del prototipo. La tecnología utilizada es [FastAPI](https://fastapi.tiangolo.com/), un framework de python que permite el desarrollo de APIs REST de manera rápida y sencilla. 

## Instalación y configuración

### Paso 1: Crear el virtual environment

Se utilizará un virtual environment de python3 (venv) para facilitar la instalación de paquetes y asegurarse de que todos trabajemos con las mismas versiones.

Para crear este virtual environment, se debe ejecutar el siguiente comando:

`python3 -m venv env`

*Nota:* Si bien el parámetro env es el nombre (o el path) de la carpeta donde se guardará el ambiente virtual, se propone que utilicemos todos el mismo, ya que de esta manera la carpeta ya queda en el gitignore para no ser versionada.

### Paso 2: Activar el virtual environment

 Para activar el virtual environment, se debe ejecutar el siguiente comando:
`source env/bin/activate`

Si lo necesitan, el comando para descativarlo es simplemente:
`deactivate`

### Paso 3: Instalar los paquetes necesarios

Se deben instalar los paquetes necesarios a partir del archivo requirements.txt. De no contar con el comando pip, este deberá ser instalado previamente.

`pip install -r requirements.txt`

*Nota:* Si esto les da un error de uvloops (algo tipo Python.h no such file or directory) durante la instalación de uvicorn pueden tener que instalarse el paquete python3-dev. 

# Levantar el servidor

Una vez que se instaló lo necesario, se puede levantar el servidor con el siguiente comando:
`uvicorn main:app --reload`

Si todo salió bien, deberían ver un mensaje de éxito en la consola, y al ir a http://localhost:8000/ deberían poder acceder al endpoint de Hello World.

