# Task Management API

## Base URL

```text
http://localhost:3000
```

## Authentication

Protected endpoints require:

```http
Authorization: Bearer <jwt-token>
```

Missing, invalid, expired, or user-less tokens return `401 Unauthorized`.

## Response format

Successful responses use:

```json
{
  "success": true,
  "data": {}
}
```

Error responses use either `message` or `error`, depending on the endpoint:

```json
{
  "success": false,
  "message": "Error description"
}
```

## HTTP status codes

| Code | Meaning | Used by |
| --- | --- | --- |
| 200 | Request completed successfully | Successful GET, PUT, DELETE, login, and protected responses |
| 201 | Resource created | Registration, task creation, and subtask creation |
| 400 | Invalid input or operation error | Login/register validation, task creation/update, subtask creation/update, profile update/delete |
| 401 | Authentication failed | Missing, invalid, or expired JWT |
| 404 | Route or resource not found | Unknown routes and some subtask/resource checks |
| 409 | Conflict | Registration with an existing email |
| 500 | Unexpected server or database error | Unhandled route, authentication, and server errors |

## Auth endpoints

### Register

```http
POST /api/auth/register
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Responses:

- `201 Created` - user registered and JWT returned.
- `400 Bad Request` - `name`, `email`, or `password` is missing.
- `409 Conflict` - email already exists.
- `500 Internal Server Error` - registration/database error.

### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Responses:

- `200 OK` - credentials are valid and JWT returned.
- `400 Bad Request` - email or password is missing.
- `401 Unauthorized` - email or password is invalid.
- `500 Internal Server Error` - login/database error.

### Get current profile

```http
GET /api/auth/me
```

Responses:

- `200 OK` - current user profile.
- `401 Unauthorized` - authentication failed.
- `500 Internal Server Error` - profile retrieval error.

### Update current profile

```http
PUT /api/auth/me
```

Request body may include `name`, `email`, or `password`.

Responses:

- `200 OK` - profile updated.
- `400 Bad Request` - update failed, including an email conflict.
- `401 Unauthorized` - authentication failed.

### Delete current profile

```http
DELETE /api/auth/me
```

Responses:

- `200 OK` - account deleted.
- `400 Bad Request` - deletion failed.
- `401 Unauthorized` - authentication failed.

## Task endpoints

All task endpoints require authentication.

### Get all tasks

```http
GET /api/tasks
```

Responses:

- `200 OK` - returns the authenticated user's tasks.
- `401 Unauthorized` - authentication failed.
- `500 Internal Server Error` - task retrieval error.

### Get one task

```http
GET /api/tasks/:id
```

Responses:

- `200 OK` - task returned.
- `401 Unauthorized` - authentication failed.
- `500 Internal Server Error` - task lookup error, including a missing task.

### Create a task

```http
POST /api/tasks
```

Request body:

```json
{
  "title": "Design landing page",
  "description": "Create a responsive landing page.",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-09-01T00:00:00.000Z",
  "assignedTo": "john@example.com",
  "subtasks": []
}
```

Allowed values:

- `status`: `pending`, `in-progress`, `completed`, `cancelled`
- `priority`: `low`, `medium`, `high`, `urgent`

Responses:

- `201 Created` - task created.
- `400 Bad Request` - invalid task data.
- `401 Unauthorized` - authentication failed.

### Update a task

```http
PUT /api/tasks/:id
```

Responses:

- `200 OK` - task updated.
- `400 Bad Request` - update error, including a missing task.
- `401 Unauthorized` - authentication failed.

### Delete a task

```http
DELETE /api/tasks/:id
```

Responses:

- `200 OK` - task deleted.
- `404 Not Found` - exact `Task not found` error.
- `500 Internal Server Error` - other deletion errors, including wrapped missing-task errors.
- `401 Unauthorized` - authentication failed.

## Subtask endpoints

All subtask endpoints require authentication.

### Get subtasks for a task

```http
GET /api/tasks/:taskId/subtasks
```

Responses:

- `200 OK` - subtasks returned.
- `404 Not Found` - task is missing or access is denied.
- `500 Internal Server Error` - other retrieval errors.
- `401 Unauthorized` - authentication failed.

### Get one subtask

```http
GET /api/subtasks/:id
```

Responses:

- `200 OK` - subtask returned.
- `404 Not Found` - subtask is missing or access is denied.
- `500 Internal Server Error` - other retrieval errors.
- `401 Unauthorized` - authentication failed.

### Create a subtask

```http
POST /api/tasks/:taskId/subtasks
```

Request body:

```json
{
  "title": "Review wireframe",
  "description": "Check the initial sketch.",
  "completed": false
}
```

Responses:

- `201 Created` - subtask created.
- `400 Bad Request` - invalid subtask data.
- `404 Not Found` - parent task is missing or access is denied.
- `401 Unauthorized` - authentication failed.

### Update a subtask

```http
PUT /api/subtasks/:id
```

Responses:

- `200 OK` - subtask updated.
- `400 Bad Request` - update error.
- `404 Not Found` - subtask is missing or access is denied.
- `401 Unauthorized` - authentication failed.

### Delete a subtask

```http
DELETE /api/subtasks/:id
```

Responses:

- `200 OK` - subtask deleted.
- `404 Not Found` - subtask is missing or access is denied.
- `500 Internal Server Error` - other deletion errors.
- `401 Unauthorized` - authentication failed.

## Additional endpoints

### Protected example

```http
GET /api/protected
```

- `200 OK` - authenticated user accepted.
- `401 Unauthorized` - authentication failed.

### Unknown route

Any route not listed in this document returns:

- `404 Not Found`
