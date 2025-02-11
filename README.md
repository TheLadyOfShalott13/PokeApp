# Poke App System

## Project Specifications
This project is used to demonstrate an example of a custom stack combining MySQL with the commonly known elements of the MERN stack (ie. MySQL, Express.js, React.js, Node.js) CRUD application. The ORM used here is **sequelize**. The backend is hosted as a **microservice**, each CRUD action invokes an **API** to a service. Login authentication is done using **JWT**. Data is fetched and updated regularly with cron jobs.

## Table of Contents
- [Basic Idea](#basic-idea)
- [Running The Project](#running-the-project)
- [Product Features](#product-features)
- [Use Cases](#use-cases)
- [Dependencies](#dependencies)
- [License](#license)
- [Authors](#authors)

## Basic Idea
This is an application that will fetch data from the PokéAPI and allow users to view and manage a list of Pokémon. Using cron jobs, the list of Pokemon, Pokemon Types and Pokemon evolutions are uploaded and updated at regular intervals from the PokeAPI. Users can sign up and login and favorite their favorite pokemons. They can also click on the pokemon for an evolutionary breakdown and their position in the evolution chain. 

## Running the Project
### Prerequisites
The following must be installed and setup before proceeding with running this project:
- MySQL Server
- MySQL Workbench or DBBeaver or DataGrip (or any other MySQL GUI application to view/modify data)
- Node Package Manager on the backend server
- Nodemon via command line `npm install nodemon`

_Note: This project uses the Javascript ES6 standard._

### Setting up the backend
In order to run this project, we need to follow the below steps:
1. Navigate to `/server` folder
2. Create a `.env` file of the following format:
    ```
   DB_HOST = <Database_Host>
   DB_USER = <Database_User>
   DB_PASSWORD = <Password_for_MySQL>
   DB_NAME = <Database_Name>
   DB_PORT = <Database_Port>
   APP_PORT = <Backend_Port>
   JWT = <JS_Web_Token_String>
   FRONTEND_URL = <Frontend_URL>
   BACKEND_URL = <Backend_URL>
   ```
    - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` are MySQL connection information.
    - `APP_PORT` refers to the backend port number.
    - `JWT` is the Javascript Web Token used for authentication and can be any kind of string generated.
    - `FRONTEND_URL` is the URL including port number of the authorized frontend server (eg. `FRONTEND_URL` = http://localhost:5173)
    - `BACKEND_URL` is the URL including port number of the authorized backend server (eg. `BACKEND_URL` = http://localhost:7700)
3. (Only if running it for the first time) Run the command `npm install` to install all the dependencies given in the `package.json` file.
4. Nodemon must be installed globally. Run this command to do so: `npm install -g nodemon`
5. Finally, to run the backend server, run the command `nodemon ./index.js`

### Setting up the frontend
In order to run this project, we need to follow the below steps:
1. Navigate to `/client` folder
2. Create a `.env` file of the following format:
    ```
   REACT_APP_BACKEND_URL = <Backend_URL>
   REACT_APP_FRONTEND_URL = <Frontend_URL>
   ```
    - `REACT_APP_BACKEND_URL` is the URL including port number of the authorized backend server (eg. `REACT_APP_BACKEND_URL` = http://localhost:7700)
    - `REACT_APP_FRONTEND_URL` is the URL including port number of the authorized frontend server (eg. `REACT_APP_FRONTEND_URL` = http://localhost:5173)
3. (Only if running it for the first time) Run the command `npm install` to install all the dependencies given in the `package.json` file. 
4. Run the command `npm start`

## Product Features
These are the key functionalities of our application that make it unique and useful:
- Client side search options - filtration by favorites, poketype and name all in one page
- Automated jobs for persisting data from PokeAPI into MySQL using cron scheduler
- Dynamic data rendering and updates upon user interaction
- Microservice based architecture using RESTful APIs
- User Authentication using JWT based Authorization 

## Use Cases
- Fetching data from the DB and display the first 150 Pokémon in a scrollable list. 
- Clicking on a Pokémon displays its types and evolution options (if available).
- Users can add or remove Pokémons from their favorites list on a click of a button. Updates are persisted without reloading the page.
- Menus can be added and modified. Every menu item will be associated with a restaurant and a category.
- Users can view all poketypes and choose to filter by selected poketype


## Dependencies
### Backend
1. **Axios**: Promise based Node.js API Middleware
2. **Axios-Mock-Adapter**: Mock Promise based Node.js API Middleware used in testing 
3. **Bcrypt.js**: Node.js password hashing and comparison library
4. **Body-Parser**: Node.js json body parsing library. Used for processing JSON requests
5. **Cookie-Parser**: Node.js cookie parsing library. Used for setting cookies that will be used to authenticate active sessions.
6. **Cors**: Cross-Origin Resource Sharing library
7. **Dotenv**: Node.js `.env` Middleware
8. **Express.js**: Node.js framework
9. **Helmet**: Helps to secure express apps by setting HTTP response headers.
10. **JSON Web Token (JWT)**: Token based authentication used while logging in
11. **Morgan**: Node.js request logger middleware
12. **Multer**: Node.js file uploader middleware (handling `multipart/form-data` forms)
13. **MySQL2**: Node.js MySQL driver
14. **Nodemon**: Automatically restarts the application when file changes in the directory are detected.
15. **Sequelize**: ORM (Object Relational Mapping) library used for interacting with MySQL Server
16. **Sinon** and **Sinon-chai**: Node.js Testing framework
17. **Mocha** and **Chai**: Node.js Testing frameworks with assertion framework

### Frontend
1. **Axios**: Promise based Node.js API Middleware
2. **React.js**: Asynchronous frontend JS framework
3. **React Bootstrap**: React.js Bootstrap Styling Library
4. **React DOM**: React.js DOM renderer
5. **React Router DOM**: React.js Router Library
6. **React Select**: React.js Select Component
7. **React Tooltip**: React.js Tooltip Component
8. **ajv** and **ajv-keywords**: Node.js JSON schema validator
9. **Web Vitals**: Web application health logger
10. **Jest**: React testing framework


## License
This is a personal project not open to distribution or duplication without the consent of the author.

## Authors
Created exclusively by [Nisreen K. aka TheLadyOfShalott](https://github.com/TheLadyOfShalott13)