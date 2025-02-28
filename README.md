# Mapyzer

Sub-Proyecto de Articulación COVID-19 Chubut

## Despliegue sin Docker
Clonar el proyecto:
```
git clone git@github.com:MarkelJaure/mapyzer.git
```

### BackEnd
- Mover a la carpeta de backend
    ```shell
    cd backend
    ```
- Instalar las dependencias:
    ```shell
    npm install
    ```
- Desplegar servidor en modo desarrollo:
    ```shell
    npm run dev
    ```
- Usar `http://localhost:3000/`

### FrontEnd
- Mover a la carpeta de frontend
    ```shell
    cd frontend
    ```
- Instalar las dependencias:
    ```shell
    npm install
    ```
- Desplegar servidor en modo desarrollo:
    ```shell
    ng serve --poll=2000
    ```
- Usar `http://localhost:4200/`

- Para matar el proceso (servidor backend)
    ```shell
    sudo kill -9 $(sudo lsof -t -i:3000)
     ```
- Para ejecutar los test definidos.
    ```shell
    cd frontend
    npm test
     ```

## Despliegue con Docker
**Para este despliegue es necesario tener instalado Docker y Docker-Compose, de no ser asi, se puede ver su instalacion mas abajo**

**Si se presentan errores de permisos, utilizar el prefijo "sudo" en los siguientes comandos**

Clonar el proyecto:
```
git clone git@github.com:MarkelJaure/mapyzer.git
```

- Ingresar al nuevo directorio
    ```shell
    cd mapyzer
     ``` 

- Crear la imagen del contenedor
    ```shell
    docker-compose build
     ``` 
	o 
    ```shell
    ./mapyzer build
     ``` 

- Levantar los contenedores
    ```shell
    docker-compose up
     ``` 
	o 
    ```shell
    ./mapyzer up
     ```
**En su primera ejecución puede tardar debido a la creación de la Base de Datos**

- Usar `http://localhost:28002/`

- Detener los contenedores
    ```shell
    Ctrl + C
     ```

- Bajar los contenedores
    ```shell
    docker-compose stop
     ``` 
	o
    ```shell
    ./mapyzer stop
     ```

- Destruir los contenedores
    ```shell
    docker-compose down
     ``` 
	o
    ```shell
    ./mapyzer down
     ```

**Es recomendable utilizar este comando solo de ser neceasario debido a que se destruye la imagen de la base de datos y se perdera lo almacenado**

## Instalacion Docker y Docker-Compose

- Instalar Docker:
    ```shell
    sudo apt install docker
     ```

- Instalar Docker-Compose
    ```shell
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/bin/docker-compose
     ```

- Verificar instalaciones:
    ```shell
    docker -v
     ```
    ```shell
    docker-compose -v
     ```

**En caso de error por permiso denegado en el despliegue con Docker utilizar**

- Otorgar permisos del docker (opcional)
    ```shell
    sudo chmod +x /usr/bin/docker-compose
     ```

- Otorgar permisos en la carpeta mapyzer (opcional)
    ```shell
    sudo chmod -R a+w ./mapyzer
     ```

