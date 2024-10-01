# Todo List Demo

This is a Todo List Application that allows users to manage their tasks efficiently. It features user authentication (registration, login, and logout) and supports basic CRUD operations for managing todos (create, read, update, delete). The frontend is served as static resources from the public folder, and it interacts with a Node.js backend that uses Express.js and MongoDB for data storage.

## Features

-   **User Authentication**: Users can register, log in, and log out securely.
-   **Todo Management**: Authenticated users can add, complete, delete, and clear todos.
-   **JWT Authentication**: Secure authentication with JWT (JSON Web Tokens).
-   **Real-time Updates**: Todo list updates dynamically on user interaction.
-   **Data Persistence**: All data is stored in MongoDB, ensuring user-specific task management.

## Tech Stack

### Frontend:

-   HTML, CSS, JavaScript (served from the public folder)

### Backend:

-   Node.js, Express.js
-   MongoDB and Mongoose for data persistence
-   bcrypt for password hashing
-   JSON Web Tokens (JWT) for user authentication

### Middleware:

-   Custom request logger
-   Custom route registitor
-   JWT token validation middleware
-   Body validation middleware

## API Endpoints

### Auth Routes:

-   **POST** `/api/auth/register`: Register a new user.
-   **POST** `/api/auth/login`: Log in an existing user.
-   **POST** `/api/auth/refresh`: Refresh JWT token.

### Todo Routes:

-   **GET** `/api/todos`: Get all todos for the authenticated user.
-   **POST** `/api/todos`: Add a new todo.
-   **PUT** `/api/todos/:id/complete`: Toggle completion status of a todo.
-   **DELETE** `/api/todos/:id`: Delete a specific todo.
-   **DELETE** `/api/todos/clear`: Clear all todos for the authenticated user.
