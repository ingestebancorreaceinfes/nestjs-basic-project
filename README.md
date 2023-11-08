<p  align="center">
<a  href="http://nestjs.com/"  target="blank"><img  src="https://nestjs.com/img/logo-small.svg"  width="200"  alt="Nest Logo"  /></a>
</p>

  
[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

  

  

<!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

  

[![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

  

  

## Descripción

  

  

Módulo para consulta de productos (category material)  y aplicaciones (type material).   

  

### Requerimientos de software

Se debe tener instalados los siguientes programas

- Node js

- npm

- Se debe tener instalado previamente docker y haber subido el servicio de traefik para haceptar servicios posteriormente

### Configuración previa del proyecto

En el repositorio se encontrarán tres archivos de ejemplo con extensión .sample para crear la imagen de docker y posteriormente el contenedor. Estos archivos se deben renombrar y remover la extensión .sample

- .env.example

- Dockerfile.example

- docker-compose.yml.example

  

Cada archivo en la mayoría de variables tiene dos carácteres {} que encierran la explicación de lo que debe contener cada variable y ser reemplazados por este contenido. Por ejemplo en el archivo .env.example

  

```bash

DB_HOST={host  de  la  base  de  datos}

```

Cambiar {host de la base de datos} cambiar por el host correspondiente.

```bash

DB_HOST=192.168.1.16  por  ejemplo

```

Reemplazar el nombre .env.example por .env  y hacer esto mismo con los archivos restantes

  
  

### Despliegue como servicio de docker swarm

  

Para el despliegue se debe, en primera instancia, verificar que el proyecto esté en la rama master, seguidamente hacer un pull de los cambios de la rama master, luego hacer instalación de dependencias, a continuación generar el build del proyecto. Una vez terminado el proceso se debe hacer build del archivo Dockerfile para generar la imagen docker y por último ejecutar el comendo de docker stack para ejecutar el contenedor como servicio de traefik.

A continuación se muestran los comandos a ejecutar en orden

```bash
# Verificar que se esté en la rama master.
# Si no está en la rama master cambiar la rama con el siguiente comando sudo git checkout master
$  sudo  git  branch
*master

$  sudo  git  pull

$  sudo  npm  install

$  sudo  npm  run  build

```

Para generar la imagen docker del proyecto el comando solicita un tag formado por un nombre seguido de : y una versión.  Por ejemplo: 
- nombrerepresentativoparalaimagen:v1.0. 

El comando quedaría como sigue:

```bash

sudo  docker  build  -t  nombrerepresentativoparalaimagen:v1.0  .

```

<strong>Nota:</strong> No olvidar el <strong>.</strong> al final el comando, este punto indica que el archivo Dockerfile está ubicado en esa misma carpeta.

<strong>Nota:</strong> Una vez generada la imagen docker, se debe modificar el archivo docker-compose.yml y reemplazar las llaves {nombre de la imagen a usar} de la variable image por el tag de la imagen generada, que en este ejemplo sería nombrerepresentativoparalaimagen:v1.0

Reemplazar:

```bash

version: '3.3'

  

services:

dev:

image: {nombre de la imagen a usar}

.

.

.

```

Por:

```bash

version: '3.3'

  

services:

dev:

image: nombrerepresentativoparalaimagen:v1.0

.

.

.

```

Por último ejecutar el comando para generar el servicio para traefik

```bash

$  sudo docker  stack  deploy  -c  docker-compose.yml  {nombre  de  servicio}

```

<strong>Nota:</strong> reemplazar {nombre de servicio} por el nombre por el cuál se conocerá el servicio
Prueba 12/09/2023 ------------