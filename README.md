<!-- PROJECT LOGO -->
<p align="center">
  <h3 align="center">Task Manager Node.js API</h3>
  <p align="center">
    A simple NodeJS, Express API
    <br/>
    <br/>
    <a href="https://task-manager-node-api-kp.herokuapp.com/">API live deployment</a>
  </p>
</p>
<br/>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#initialisation">Initialisation</a></li>
      </ul>
    </li>
    <li>
      <a href="#description">Description</a>
      <ul>
        <li><a href="#user-routes">User routes</a></li>
        <li><a href="#task-routes">Task routes</a></li>
      </ul>
    </li>
    <li>
      <a href="#testing">Testing</a>
    </li>
  </ol>
</details>
<br/>


<!-- ABOUT THE PROJECT -->
## About The Project

A task manager API that can be used as a boilerplate for similarly structured APIs.
The features that the API provides are the following:
* User authentication.
* Email notifications for opening and closing an account.
* User and task route authorization.
* User and tasks CRUD operations.
* Tasks pagination and sorting.

## Built With

* [NodeJS](https://nodejs.org/en/)
* [ExpressJS](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/cloud/atlas)


<!-- GETTING STARTED -->
## Getting Started

In order to use this app a local mongoDB instance is needed. In order for the email feature to function a Sendgrid account API key is needed.

### Prerequisites

* [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
* [Sendgrid API](https://app.sendgrid.com/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/kikooOOoo16/task-manager-node-api.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Inside the server root directory add the MongoDB URL, a JSON web token secret (used for token creation, it can by any string) and the Sendgrid API key in a dev.env file under the following keys: 
   (`dev.env` file)
   ```JS
   JWTSECRET=can_be_any_string
   SENDGRID_API_KEY=sendgrid_api
   MONGODB_URL=mongodb://127.0.0.1:27017/task-manager-api
   ```
5. In order for testing to work a seperate environment variables file is needed. In the same directory as the dev.env file create a test.env file (`test.env` file):
   ```JS
   JWTSECRET=can_be_any_string
   SENDGRID_API_KEY=sendgrid_api
   MONGODB_URL=mongodb://127.0.0.1:27017/task-manager-api-test
   ```
### Initialisation

1. The server's start script is configured with [nodemon](https://www.npmjs.com/package/nodemon). To start the server just run :
   ```sh
   npm run start:server
   ```
## Description

The REST API to the example app is described below.

### User routes

### User login request

`POST /users/login`
  
  body:
   ```JSON
  {
      "email" : "user1@mail.com",
      "password": "123456789"
  }
   ```

### Response

    HTTP/1.1 200 OK
    Date: Sun, 13 Jun 2021 12:37:45 GMT
    Status: 200 OK
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    
   ```JSON
  {
      "user": {
          "age": 33,
          "_id": "606e2bbd04aba95c94aa3192",
          "name": "User",
          "email": "user1@mail.com",
          "createdAt": "2021-04-07T22:01:33.581Z",
          "updatedAt": "2021-06-13T12:37:45.386Z",
          "__v": 4
      },
      "token": "eyJhbGciOihIjzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDZlMmJiZDA0YWFhOTNjOTRhYTMxOTIiLCJpYXQiOjE2MjM1ODc4NjV9.pz0CP9b-zI3CuZL0osHFUS_oU4JmlT1pXdeLiCdKjjU"
  }
   ```
   
    HTTP/1.1 400 Bad Request
    Date: Sun, 13 Jun 2021 20:06:02 GMT
    Status: 400 Bad Request
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    
   ```JSON
  {
      "message": "User authentication failed! Invalid credentials."
  }
   ```
   
### User signup request

`POST /users
  
  body:
   ```JSON
{
    "name": "User1",
    "email": "user1@mail.com",
    "password": "123456789",
    "age": 33
}
   ```

### Response

    HTTP/1.1 201 Created
    Date: Sun, 13 Jun 2021 12:37:45 GMT
    Status: 201 Created
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    
   ```JSON
  {
      "message": "New user created.",
      "user": {
          "age": 33,
          "_id": "60c667081622a100156fac7c",
          "name": "User1",
          "email": "user1@mail.com",
          "createdAt": "2021-06-13T20:14:00.331Z",
          "updatedAt": "2021-06-13T20:14:00.473Z",
          "__v": 1
      },
      "token": "eyJgvCsiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGM2NjcwODE2MjJhMTAwMTU2ZmFjN2MiLCJpYXQiOjE2MjM2MTUyNDB9.lErRCRd-MfPj6U9UMsq0Y8ZK9BtjVHseGPqN_x8TMx4"
  }
   ```
   
    HTTP/1.1 400 Bad Request
    Date: Sun, 13 Jun 2021 20:06:02 GMT
    Status: 400 Bad Request
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    
   ```JSON
  {
      "message": "E11000 duplicate key error collection: task-manager-db.users index: email_1 dup key: { email: \"kikoooooo_@hotmail.com\" }"
  }
  {
      "message": "User validation failed: password: Path `password` (`1583`) is shorter than the minimum allowed length (7)."
  }
   ```
   
### User logout request

`POST /users/logout
  
### Response

    HTTP/1.1 200 OK
    Date: Sun, 13 Jun 2021 12:37:45 GMT
    Status: 200 OK
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    
 ```JSON
{
    "message": "User logged out!"
}
 ```
  
### User logout from everywhere
 
 `POST /users/logoutall

### Response

    HTTP/1.1 200 OK
    Date: Sun, 13 Jun 2021 12:37:45 GMT
    Status: 200 OK
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    
 ```JSON
{
    "message": "User logged out from all sessions!"
}
 ```
 
 ### User profile image upload
 
`POST /users/profile/image

  body:
   ```JSON
{
  profileImage: profile.jpg
}
   ```

### Response

    HTTP/1.1 200 OK
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 200 OK
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    
   ```JSON
{
    "message": "File uploaded successfully"
}
   ```

    HTTP/1.1 400 Bad Request
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 400 Bad Request
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    
   ```JSON
{
    "message": "User image upload failed. Error: File must be an image."
}
   ```

### Get user profile data

`GET /users/profile

### Response

    HTTP/1.1 200 OK
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 200 OK
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8

   ```JSON
{
    "user": {
        "age": 33,
        "_id": "606e2bdf44aaa93c94aa3192",
        "name": "User",
        "email": "user1@mail.com",
        "createdAt": "2021-04-07T22:01:33.581Z",
        "updatedAt": "2021-06-13T20:31:16.261Z",
        "__v": 4
    }
}
   ```
   
    HTTP/1.1 401 Unauthorized
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 401 Unauthorized
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
   
   ```JSON
{
    "message": "Unauthorized action!"
}
   ```
   
### Get user's profile image

`GET /users/:id/image

### Response

    HTTP/1.1 200 OK
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 200 OK
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8

  ```JSON
{
    "message": "File uploaded successfully"
}
  ```

    HTTP/1.1 404 Not Found
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 404 Not Found
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8

  ```JSON
{
    "message": "A problem occurred when getting the user's profile image."
}
  ```
  
### Patch user's profile data

`PATCH /users/profile

body:
   ```JSON
{
    "email": "user1@mail.com",
    "age": 34
}
   ```
### Response

    HTTP/1.1 201 Created
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 201 Created
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8

  ```JSON
{
    "user": {
        "age": 34,
        "_id": "603e2bbd04aaa94f94aa3122",
        "name": "User1",
        "email": "user1@mail.com",
        "createdAt": "2021-04-07T22:01:33.581Z",
        "updatedAt": "2021-06-13T20:46:52.653Z",
        "__v": 6
    }
}
  ```
  
    HTTP/1.1 401 Unauthorized
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 401 Unauthorized
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
  
  ```JSON
{
    "message": "Unauthorized action!"
}
  ```
  
### Delete user profile

`DELETE /users/profile

### Response

    HTTP/1.1 201 Created
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 201 Created
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8

  ```JSON
{
    "user": {
        "age": 27,
        "_id": "606e2bbd04aaa93c94aa3192",
        "name": "User",
        "email": "user1@mail.com",
        "createdAt": "2021-04-07T22:01:33.581Z",
        "updatedAt": "2021-06-13T21:13:10.463Z",
        "__v": 8
    },
    "message": "User deleted successfully."
}
  ```
  
    HTTP/1.1 401 Unauthorized
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 401 Unauthorized
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
  
  ```JSON
{
    "message": "Unauthorized action!"
}
  ```
  
  
### Task routes

### Get all tasks

`GET /tasks?sortBy=createdAt:desc&sortBy=description:desc&sortBy=completed:asc
  
### Response

    HTTP/1.1 200 OK
    Date: Sun, 13 Jun 2021 12:37:45 GMT
    Status: 200 OK
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    
   ```JSON
    {
        "tasks": [
            {
                "completed": true,
                "_id": "6074s910757de10fb073c499",
                "description": "Feed my cat.",
                "owner": "646e2bbd04aaa93c94aa3192",
                "createdAt": "2021-04-16T20:52:48.429Z",
                "updatedAt": "2021-04-16T20:52:48.429Z",
                "__v": 0
            },
            {
                "completed": true,
                "_id": "606f5cba58caec3708bb3940",
                "description": "Trim the trees in my garden.",
                "owner": "606e2bbd04aaa93c94aa3192",
                "createdAt": "2021-04-08T19:42:50.361Z",
                "updatedAt": "2021-04-08T19:42:50.361Z",
                "__v": 0
            }
        ]
    }
   ```
   
    HTTP/1.1 401 Unauthorized
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 401 Unauthorized
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
  
  ```JSON
{
    "message": "Unauthorized action!"
}
  ```
  
### Get single task data 

`GET /tasks/6074s910757de10fb073c499

### Response

    HTTP/1.1 200 OK
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 200 OK
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8

```JSON
{
    "task": {
        "completed": true,
        "_id": "6074s910757de10fb073c499",
        "description": "Feed my cat.",
        "owner": "606e2bbd04aaa93c94aa3192",
        "createdAt": "2021-04-16T20:52:48.429Z",
        "updatedAt": "2021-04-16T20:52:48.429Z",
        "__v": 0
    }
}
```

    HTTP/1.1 401 Unauthorized
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 401 Unauthorized
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    
```JSON
{
    "message": "Unauthorized action!"
}
```

### Create new task

`POST /tasks

body:
```JSON
{
    "description": "Create github readme file for this API.",
    "completed": false
}
```

### Response

    HTTP/1.1 201 Created
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 201 Created
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8

```JSON
{
    "task": {
        "completed": false,
        "_id": "60c677c68fe1352ce478cdb7",
        "description": "Create github readme file for this API.",
        "owner": "607889c0daef831f58d0ed98",
        "createdAt": "2021-06-13T21:25:26.106Z",
        "updatedAt": "2021-06-13T21:25:26.106Z",
        "__v": 0
    },
    "message": "New task saved successfully."
}
```

### Update task data

`PATCH /tasks/:id

body:
```JSON
{
    "completed": "true"
}
```

### Response

    HTTP/1.1 201 Created
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 201 Created
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8

```JSON
    "newTask": {
        "completed": true,
        "_id": "60c677c68fe1352ce478cdb7",
        "description": "Create github readme file for this API.",
        "owner": "607889c0daef831f58d0ed98",
        "createdAt": "2021-06-13T21:25:26.106Z",
        "updatedAt": "2021-06-13T21:28:28.860Z",
        "__v": 0
    }
```

### Delete task

`DELETE /tasks/:id

### Response

    HTTP/1.1 201 Created
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 201 Created
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8

```JSON
    "deletedTask": {
        "completed": true,
        "_id": "60c677c68fe1352ce478cdb7",
        "description": "Create github readme file for this API.",
        "owner": "607889c0daef831f58d0ed98",
        "createdAt": "2021-06-13T21:25:26.106Z",
        "updatedAt": "2021-06-13T21:28:28.860Z",
        "__v": 0
    },
    "message": "Task deleted successfully."
```

    HTTP/1.1 401 Unauthorized
    Date: Sun, 13 Jun 2021 20:31:16 GMT
    Status: 401 Unauthorized
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    
```JSON
{
    "message": "Unauthorized action!"
}
```

## Testing

Unit testing in this API is done by using [Jest](https://jestjs.io/). In order to run the Jest unit tests use the following command:

```sh
  npm run test
```

<!-- CONTACT -->
## Contact

Kristijan Pavlevski - kristijan.pavlevski@outlook.com

Project Link: [https://github.com/kikooOOoo16/task-manager-node-api](https://github.com/kikooOOoo16/task-manager-node-api)
