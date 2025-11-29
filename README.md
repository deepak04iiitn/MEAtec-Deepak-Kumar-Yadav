# TaskFlow - Task Management Application

A full-stack task management application built with React, Node.js, Express, Prisma, and MongoDB. Users can register, log in, and manage their tasks with a modern, responsive interface.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with registration and login
- **Task Management**: Full CRUD operations for tasks (Create, Read, Update, Delete)
- **Modern UI**: Beautiful, responsive design with TailwindCSS
- **Form Validation**: Client and server-side validation using Zod
- **Protected Routes**: Secure API endpoints and frontend route protection
- **Real-time Updates**: Instant UI updates with Redux state management

## 🛠️ Technology Stack

### Frontend
- React 19
- Vite
- TailwindCSS
- Redux Toolkit
- React Router
- React Hook Form
- Axios
- Lucide React
- date-fns

### Backend
- Node.js
- Express
- Prisma ORM
- MongoDB
- JWT (jsonwebtoken)
- bcryptjs
- Zod

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## 🔧 Local Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MEAtec
```

### 2. Install Dependencies

Install root dependencies:
```bash
npm install
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# For MongoDB Atlas:
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# For Local MongoDB:
DATABASE_URL=mongodb://localhost:27017/taskmanager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Important Notes:**
- **Database name is required**: The connection string MUST include the database name
- **MongoDB Atlas format**: `mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority`
- **Local MongoDB format**: `mongodb://localhost:27017/database_name`
- **Special characters in password**: URL-encode special characters (`@` → `%40`, `#` → `%23`, etc.)
- Use a strong, random string for `JWT_SECRET` in production

### 4. Initialize Database

Generate Prisma Client and push schema to database:
```bash
npm run prisma:generate
npm run prisma:push
```

### 5. (Optional) Frontend Environment Variables

Create a `.env` file in the `frontend` directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

If not provided, it defaults to `http://localhost:5000/api`.

## 🏃 How to Run the Application

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
npm run dev
```
The backend server will run on `http://localhost:5000`

**Terminal 2 - Start Frontend Development Server:**
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173` (or the port Vite assigns)

### Production Mode

**Build Frontend:**
```bash
npm run build
```

**Start Production Server:**
```bash
npm start
```

## 📚 API Endpoint Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

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

**Validation Rules:**
- `username`: 3-30 characters, alphanumeric and underscores only
- `password`: Minimum 6 characters, maximum 100 characters

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

### Task Endpoints (Protected - Require JWT)

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### GET `/api/tasks`
Get all tasks for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

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

**Headers:**
```
Authorization: Bearer <token>
```

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

**Validation Rules:**
- `title`: Required, 1-200 characters
- `description`: Optional, maximum 1000 characters
- `status`: Must be either "pending" or "completed" (defaults to "pending")

#### PUT `/api/tasks/:id`
Update an existing task.

**Headers:**
```
Authorization: Bearer <token>
```

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

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## 🔒 Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs before storage
2. **JWT Authentication**: Secure token-based authentication
3. **User Isolation**: Users can only access their own tasks
4. **Input Validation**: All inputs are validated using Zod schemas on both frontend and backend
5. **Error Handling**: Comprehensive error handling with appropriate status codes
6. **Protected Routes**: Frontend routes and API endpoints are protected

## 📊 Database Schema

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

## ⚠️ Error Responses

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

## 📁 Project Structure

```
MEAtec/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── prisma.js
│   │   └── validation.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   └── DeleteConfirmationModal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── user/
│   │   │   │   └── userSlice.js
│   │   │   └── task/
│   │   │       └── taskSlice.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── taskService.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── validationSchemas.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
```

## 🧪 Available Scripts

### Root Level
- `npm run dev` - Start backend server in development mode
- `npm start` - Start backend server in production mode
- `npm run build` - Build frontend for production
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push Prisma schema to database
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Usage

1. **Register a new account** or **login** with existing credentials
2. **Create tasks** using the "New Task" button
3. **View tasks** in grid or list view
4. **Filter tasks** by status (All, Pending, Completed)
5. **Edit tasks** by clicking the edit icon
6. **Delete tasks** with confirmation modal
7. **Toggle task status** by clicking the checkbox

## 📝 Notes

- The frontend automatically stores JWT tokens in localStorage
- Tokens are automatically included in API requests via Axios interceptors
- Protected routes redirect to login if user is not authenticated
- All API requests are validated on both client and server side

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

