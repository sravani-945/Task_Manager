# Task Manager Application

A full-stack task management application built with React frontend and Node.js/Express backend with user authentication.

## Features

- User authentication (login/signup)
- Add, edit, complete, and delete tasks
- View completed and pending tasks
- Filter tasks by status
- Responsive and modern UI

## Technology Stack

### Frontend
- React.js (Port 3000)
- Bootstrap 5
- Axios for API requests

### Backend
- Node.js with Express (Port 8080)
- JSON Web Tokens (JWT) for authentication
- LowDB for data storage
- RESTful API

## Running the Application

### Access URLs

- **Frontend URL:** [http://localhost:3000](http://localhost:3000)
- **Backend API URL:** [http://localhost:8080](http://localhost:8080)

### Backend (Node.js Express)

1. Navigate to the backend-node directory
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   node server.js
   ```

### Frontend

1. Navigate to the frontend directory
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/status?completed=true|false` - Get tasks by completion status
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `PATCH /api/tasks/{id}/toggle` - Toggle task completion status
- `DELETE /api/tasks/{id}` - Delete a task
