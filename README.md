# TaskManager Backend

This is the backend for the TaskManager application, built with Node.js and Express. It provides RESTful API endpoints for managing tasks.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Tasks](#tasks)
- [Environment Variables](#environment-variables)
- [Swagger API Documentation](#swagger-api-documentation)
- [Testing]

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/priyan434/tests.git
    cd tests-main
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the necessary environment variables.

  

4. Start the server:

    ```sh
    nodemon server.js
    # or
    node server.js
    ```

## Usage

After starting the server, the backend API will be accessible at `http://localhost:5000` by default. You can use tools like Postman or Curl to interact with the API endpoints.

## API Endpoints

### Authentication

- **POST /auth/register**
  - Description: Register a new user
  - Request Body: `{ "name": "example", "password": "example" }`

- **POST /auth/login**
  - Description: Log in an existing user
  - Request Body: `{ "name": "example", "password": "example" }`

### Tasks

- **GET /tasks**
  - Description: Get all tasks
  - Headers: `{ "x-auth-token": " <token>" }`

- **POST /tasks**
  - Description: Create a new task
  - Headers: `{ "x-auth-token": "<token>" }`
 

- **GET /tasks/:id**
  - Description: Get a task by ID
  - Headers: `{ "x-auth-token": "<token>" }`

- **PUT /tasks/:id**
  - Description: Update a task by ID
  - Headers: `{ "x-auth-token": "<token>" }`
 

- **DELETE /tasks/:id**
  - Description: Delete a task by ID
  - Headers: `{ "x-auth-token": "<token>" }`

## Environment Variables

The following environment variables need to be set in the `.env` file:

- `PORT`: The port number on which the server will run (default: 5000)
- `MONGODB_URI`: The connection string for the MongoDB database
- `JWT_SECRET_KEY`: Secret key for signing JWT tokens

-   Example `.env` file:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/taskmanager
    JWT_SECRET_KEY=your_secret_key
    ```

## Swagger API Documentation

You can access the Swagger documentation at `http://localhost:5000/api-docs`.

add the token after logging-in in the authorization section of swagger api documnetation ui

## Testing
Run this code in terminal to perform testing operation
 ```sh
   npm test
    ```