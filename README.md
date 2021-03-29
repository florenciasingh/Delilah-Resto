# DelilahResto

**Proyecto Delilah Restó**

API para pedidos de comida deliciosa. Como cliente podras registrarte, ver el listado de nuestros productos y realizar una orden. Los administradores del restaurante tienen la posibilidad de recibir pedidos y actualizarlos.

## Requisitos

### Instalar NodeJS

Nodejs es un entorno JavaScript que nos permite ejecutar en el servidor, de manera asíncrona, con una arquitectura orientada a eventos y basado en el motor V8 de Google.

- [Descargar Nodejs](https://nodejs.org/en/download/)

### Instalar XAMPP

XAMPP es una distribución de Apache completamente gratuita y fácil de instalar que contiene MariaDB, PHP y Perl.

- [Descargar XAMPP](https://www.apachefriends.org/es/download.html)

### Instalar Postman

Es una herramienta que principalmente nos permite crear peticiones sobre APIs de una forma muy sencilla y poder, de esta manera, probar las APIs

- [Descargar Postman](https://www.postman.com/product/api-client/)

## Despliegue

**1) Clonar el proyecto**

- Clonar el repositorio desde github accediendo al link: [Delilah Restó](https://github.com/florenciasingh/Delilah-Resto.git)
- Desde la consola ejecutar el comando:

```
git clone https://github.com/florenciasingh/Delilah-Resto.git
```

**2) Instalar dependencias**

```
npm install
```

**3) Creando base de datos**

- Abrir XAMPP e iniciar los servicios de **Apache** y **MYSQL**
- Para abrir MYSQL presionar el botón **Admin** ó acceder a **[phpmyadmin](http://localhost/phpmyadmin/)**.
- Generar la base de datos **delilahresto**, dentro del panle de control de la base de datos ejecutar y/o importar el archivo que se encuentra en: **/scriptsDB/deliahrestoDB.sql**

**4) Iniciar el servidor**

```
npm run start
```

ó

```
node ./src/index.js
```

## Documentación de la API

Abrir el archivo **spec.yml** y copiar su contenido en **[Swagger](https://editor.swagger.io/)** o importar el mismo desde las opciones.

A continuación, se muestra un breve resumen de todos los endpoints disponibles.

**URL: http://localhost:3000/**

| Métod  | Endpoints      | Descripción                                                      | Rol       |
| ------ | -------------- | ---------------------------------------------------------------- | --------- |
| POST   | /auth/login    | Autenticación al sistema                                         | all       |
| GET    | /users/all     | Obtiene información de todos los usuarios                        | **admin** |
| GET    | /users         | Obtiene información del usuario que inició la sesión             | all       |
| POST   | /users         | Crea un nuevo usuario                                            | all       |
| PUT    | /users         | Modifica la información del usuario que inició la sesión         | all       |
| GET    | /products      | Obtiene información de todos los productos                       | all       |
| GET    | /products/{id} | Obtiene información de un producto                               | all       |
| PUT    | /products/{id} | Modifica la información del producto                             | **admin** |
| DELETE | /products/{id} | Elimina un producto                                              | **admin** |
| POST   | /products      | Crea un nuevo producto                                           | **admin** |
| GET    | /orders/all    | Obtiene información de todos los pedidos                         | **admin** |
| GET    | /orders        | Obtiene información de los pedidos del usuario que inició sesión | all       |
| PUT    | /orders/{id}   | Modifica el estado de un pedido                                  | **admin** |
| DELETE | /orders/{id}   | Cancela el pedido                                                | **admin** |
| POST   | /orders        | Crea un nuevo pedido del usuario que inició sesión               | all       |

## Testing

Testear los endpoints provistos desde postman para poder hacer uso de la API y base de datos generadas

## Recursos y tecnologías utilizadas

- Node
- Postman
- XAMPP
- Swagger
- NPM PACKAGES:
  - Express
  - Nodemon
  - Jsonwebtoken
  - Dotenv
  - Mysql
  - Moment
  - Bcryptjs
  - Cors
