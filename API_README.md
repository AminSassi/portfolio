# Express REST API

A simple REST API built with Express.js that provides CRUD operations for managing users.

## Server Information

- **Server URL**: http://localhost:3000
- **API Base URL**: http://localhost:3000/api

## Available Endpoints

### Health Check
- `GET /api/health` - Returns server status and timestamp

### User Management

#### Get All Users
- `GET /api/users`
- Returns all users in the system

#### Get User by ID
- `GET /api/users/:id`
- Returns a specific user by their ID
- Returns 404 if user not found

#### Create New User
- `POST /api/users`
- Creates a new user
- **Request Body**: JSON object with `name` and `email` fields
- **Validation**: Both `name` and `email` are required
- **Validation**: Email must be unique
- Returns 201 on success, 400 on validation error

#### Update User
- `PUT /api/users/:id`
- Updates an existing user
- **Request Body**: JSON object with optional `name` and `email` fields
- Returns 404 if user not found

#### Delete User
- `DELETE /api/users/:id`
- Deletes a user by ID
- Returns 404 if user not found

## Example Usage

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Get User by ID
```bash
curl http://localhost:3000/api/users/1
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Smith","email":"john.smith@example.com"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## Error Handling

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error (detailed error in development mode)

## Running the Server

1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Server will run on http://localhost:3000

## Dependencies

- express: Web framework
- cors: Cross-origin resource sharing
- dotenv: Environment variable management