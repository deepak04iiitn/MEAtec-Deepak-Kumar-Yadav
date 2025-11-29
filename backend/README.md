# Backend API Documentation

## Overview
This is a RESTful API for a task management application built with Node.js, Express, Prisma, and MongoDB.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Important Notes:** 
- **Database name is required**: The connection string MUST include the database name
- Use a strong, random string for `JWT_SECRET` in production
- **For MongoDB Atlas**, the format is:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
  ```
  Example: `mongodb+srv://user:pass@meatec.5gif284.mongodb.net/taskmanager?retryWrites=true&w=majority`
- **For local MongoDB**, the format is:
  ```
  mongodb://localhost:27017/database_name
  ```
  Example: `mongodb://localhost:27017/taskmanager`
- **Special characters in password**: If your password contains special characters like `@`, `#`, `%`, etc., you must URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `%` becomes `%25`
  - etc.

### 3. Initialize Prisma
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (creates tables)
npm run prisma:push
```

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "john_doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Authenticate a user and get JWT token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "username": "john_doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Tasks (Protected Routes - Require JWT)

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### GET `/api/tasks`
Get all tasks for the authenticated user.

**Response (200):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "...",
      "title": "Complete project",
      "description": "Finish the backend implementation",
      "status": "pending",
      "userId": "...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the backend implementation",
  "status": "pending"
}
```

**Note:** `description` is optional, `status` defaults to "pending" if not provided.

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "...",
    "title": "Complete project",
    "description": "Finish the backend implementation",
    "status": "pending",
    "userId": "...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT `/api/tasks/:id`
Update an existing task.

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "...",
    "title": "Updated title",
    "description": "Updated description",
    "status": "completed",
    "userId": "...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE `/api/tasks/:id`
Delete a task.

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Validation Rules

### User Registration/Login
- **username**: 3-30 characters, alphanumeric and underscores only
- **password**: Minimum 6 characters, maximum 100 characters

### Tasks
- **title**: Required, 1-200 characters
- **description**: Optional, maximum 1000 characters
- **status**: Must be either "pending" or "completed" (defaults to "pending")

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

Common status codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (user doesn't own the resource)
- `404`: Not Found
- `409`: Conflict (duplicate username)
- `500`: Internal Server Error

## Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs before storage
2. **JWT Authentication**: Secure token-based authentication
3. **User Isolation**: Users can only access their own tasks
4. **Input Validation**: All inputs are validated using Zod schemas
5. **Error Handling**: Comprehensive error handling with appropriate status codes

## Database Schema

### User Model
- `id`: ObjectId (Primary Key)
- `username`: String (Unique)
- `password`: String (Hashed)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `tasks`: Relation to Task[]

### Task Model
- `id`: ObjectId (Primary Key)
- `title`: String
- `description`: String? (Optional)
- `status`: String (default: "pending")
- `userId`: ObjectId (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

