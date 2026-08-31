Waa tan dukumentigaaga oo loo kordhiyay route-yada cusub ee Profile Management (`PUT /api/auth/me` iyo `DELETE /api/auth/me`) si uu u noqdo mid dhamaystiran.

---

# Task Management API Documentation

## Base URL

* Local development: `http://localhost:3000`

## Authentication

Most routes require a JWT token in the `Authorization` header.

Header format:

```http
Authorization: Bearer <token>

```

Example:

```bash
curl -H "Authorization: Bearer <your_token>" http://localhost:3000/api/tasks

```

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000

```

## Response Format

Successful responses return:

```json
{
  "success": true,
  "data": {}
}

```

Error responses return:

```json
{
  "success": false,
  "message": "Description of the error"
}

```

## User Model

```json
{
  "id": "cuid",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed-password",
  "createdAt": "2026-08-28T00:00:00.000Z",
  "updatedAt": "2026-08-28T00:00:00.000Z"
}

```

Note: Password values are excluded from normal API responses.

## Auth & User Routes

### Register a new user

* Method: `POST`
* Route: `/api/auth/register`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

```

Success response (201):

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cmc123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-08-28T00:00:00.000Z"
  }
}

```

### Login

* Method: `POST`
* Route: `/api/auth/login`

Request body:

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}

```

Success response (200):

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cmc123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-08-28T00:00:00.000Z",
    "updatedAt": "2026-08-28T00:00:00.000Z"
  }
}

```

### Get current user profile

* Method: `GET`
* Route: `/api/auth/me`
* Authentication: Required

Success response (200):

```json
{
  "success": true,
  "data": {
    "id": "cmc123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-08-28T00:00:00.000Z"
  }
}

```

### Update user profile

* Method: `PUT`
* Route: `/api/auth/me`
* Authentication: Required

Request body:

```json
{
  "name": "John Updated Doe",
  "email": "john.new@example.com"
}

```

Success response (200):

```json
{
  "success": true,
  "data": {
    "id": "cmc123",
    "name": "John Updated Doe",
    "email": "john.new@example.com",
    "createdAt": "2026-08-28T00:00:00.000Z",
    "updatedAt": "2026-08-31T00:00:00.000Z"
  }
}

```

### Delete user account

* Method: `DELETE`
* Route: `/api/auth/me`
* Authentication: Required

Success response (200):

```json
{
  "success": true,
  "message": "Account deleted successfully",
  "user": {
    "id": "cmc123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

```

---

## Task Routes

### Get all tasks

* Method: `GET`
* Route: `/api/tasks`
* Authentication: Required

Success response:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "tsk_123",
      "title": "Design landing page",
      "description": "Create a responsive landing page for the app.",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-09-01T00:00:00.000Z",
      "assignedTo": "john@example.com",
      "createdAt": "2026-08-28T00:00:00.000Z",
      "updatedAt": "2026-08-28T00:00:00.000Z",
      "userId": "cmc123",
      "subtasks": []
    }
  ]
}

```

### Get task by ID

* Method: `GET`
* Route: `/api/tasks/:id`
* Authentication: Required

### Create a task

* Method: `POST`
* Route: `/api/tasks`
* Authentication: Required

Request body:

```json
{
  "title": "Design landing page",
  "description": "Create a responsive landing page for the app.",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-09-01T00:00:00.000Z",
  "assignedTo": "john@example.com",
  "subtasks": [
    {
      "title": "Review wireframe",
      "description": "Check the initial sketch with the team.",
      "completed": false
    }
  ]
}

```

Allowed enum values:

* Status: `pending`, `in-progress`, `completed`, `cancelled`
* Priority: `low`, `medium`, `high`, `urgent`

Success response (201):

```json
{
  "success": true,
  "data": {
    "id": "tsk_123",
    "title": "Design landing page",
    "description": "Create a responsive landing page for the app.",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-09-01T00:00:00.000Z",
    "assignedTo": "john@example.com",
    "createdAt": "2026-08-28T00:00:00.000Z",
    "updatedAt": "2026-08-28T00:00:00.000Z",
    "userId": "cmc123",
    "subtasks": [
      {
        "id": "sub_123",
        "title": "Review wireframe",
        "description": "Check the initial sketch with the team.",
        "completed": false,
        "taskId": "tsk_123",
        "createdAt": "2026-08-28T00:00:00.000Z",
        "updatedAt": "2026-08-28T00:00:00.000Z"
      }
    ]
  }
}

```

### Update a task

* Method: `PUT`
* Route: `/api/tasks/:id`
* Authentication: Required

Example request body:

```json
{
  "title": "Update landing page design",
  "status": "in-progress",
  "priority": "medium"
}

```

### Delete a task

* Method: `DELETE`
* Route: `/api/tasks/:id`
* Authentication: Required

---

## Subtask Routes

### Get all subtasks for a task

* Method: `GET`
* Route: `/api/tasks/:taskId/subtasks`
* Authentication: Required

### Get a subtask by ID

* Method: `GET`
* Route: `/api/subtasks/:id`
* Authentication: Required

### Create a subtask

* Method: `POST`
* Route: `/api/tasks/:taskId/subtasks`
* Authentication: Required

Request body:

```json
{
  "title": "Review wireframe",
  "description": "Check the initial sketch with the team.",
  "completed": false
}

```

### Update a subtask

* Method: `PUT`
* Route: `/api/subtasks/:id`
* Authentication: Required

### Delete a subtask

* Method: `DELETE`
* Route: `/api/subtasks/:id`
* Authentication: Required

---

## Common Errors

### 401 Unauthorized

Returned when the JWT token is missing, invalid, expired, or rejected.

```json
{
  "success": false,
  "message": "Invalid token"
}

```

### 404 Not Found

Returned when a task or subtask does not exist for the authenticated user.

```json
{
  "success": false,
  "error": "Task not found"
}

```

### 400 Bad Request

Returned when request validation fails or input data is invalid.

```json
{
  "success": false,
  "error": "Error processing request"
}

```

---

## Example Curl Commands

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'

```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'

```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated Doe"
  }'

```

### Delete Profile

```bash
curl -X DELETE http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"

```

### Get tasks

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/tasks

```

### Create a task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write API docs",
    "description": "Document all endpoints clearly.",
    "status": "pending",
    "priority": "high"
  }'

```

---

## Notes

* This API is designed for authenticated users; each task belongs to a single user.
* Task and subtask records are scoped to the authenticated user.
* All timestamps are returned in ISO 8601 format.