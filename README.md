# Proyecto Final Renta Autos - API REST NodeJs y MySQL 
REST API usando Node.js, el framework web Express y el sistema gestor de bases de datos MySQL, con los métodos HTTP GET, POST, PUT y DELETE.

<hr/>

## Dependencias de desarrollo
- dotenv: para manejar variables de entorno
- express: framework para crear aplicaciones web
- promise-mysql: manejar conexiones asincronas a la base de datos (Consultas)
- babel: Compilador de javascript (Convierte código de javascript a código general para que los navegadores lo soporten) 
- morgan: Ver en consola peticiones que se realizan
- nodemon: para reflejar cambios automáticamente con cada cambio que realicemos en la api

<hr/>

## Instalación
Instala las dependencias necesarias de Nodejs. (Indicados en package.json)
	
	npm install

<hr/>

## Instalación de Dependencias
Estos son los comandos que se utilizaron para instalar las dependencias mencionadas anteriormente, pero solo son ejemplos si se desea crear el proyecto desde cero. 
Ya que para evitar eso solo se ejecuta el comando anterior mencionado anteriormente que instala todas las dependencias.

	npm i dotenv express promise-mysql
	npm i @babel/cli @babel/core @babel/node @babel/preset-env morgan nodemon -D

<hr/>

## Ejecutar Api
Ejecuta la aplicación en modo de desarrollo.\
Abra [http://localhost:5000](http://localhost:5000) para verlo en su navegador.
	
	npm run dev

La página se recargará cuando realice cambios.

<hr/>

## Crear y asignar variables de entorno en un archivo .env (En la raíz del proyecto)

	HOST=host
	DATABASE=database
	USER=user
	PASSWORD=password