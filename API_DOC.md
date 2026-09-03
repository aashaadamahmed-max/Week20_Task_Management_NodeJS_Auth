# Task Management API

REST API for managing users, tasks, and subtasks with JWT authentication.

## Base URL
`http://localhost:3000`

## Setup
Create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

## Authentication
Protected routes require a JWT in the header:
```http
Authorization: Bearer <token>
```
Get a token from `POST /api/auth/register` or `POST /api/auth/login`.

## Response Format
Success:
```json
{ "success": true, "data": { } }
```
Error:
```json
{ "success": false, "message": "..." }
```
> Note: auth/user routes and the global 404 use the `message` key for errors, while task/subtask routes use the `error` key. Check both.

## Endpoints

### Auth & User
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user, returns a token |
| POST | `/api/auth/login` | No | Log in, returns a token |
| GET | `/api/auth/me` | Yes | Get current user profile |
| PUT | `/api/auth/me` | Yes | Update current user profile |
| DELETE | `/api/auth/me` | Yes | Delete current user account |
| GET | `/api/protected` | Yes | Example protected route, returns the user |

### Tasks
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/tasks` | Yes | List all tasks for the user |
| GET | `/api/tasks/:id` | Yes | Get a task by ID |
| POST | `/api/tasks` | Yes | Create a task |
| PUT | `/api/tasks/:id` | Yes | Update a task |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |

### Subtasks
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/tasks/:taskId/subtasks` | Yes | List subtasks for a task |
| POST | `/api/tasks/:taskId/subtasks` | Yes | Create a subtask |
| GET | `/api/subtasks/:id` | Yes | Get a subtask by ID |
| PUT | `/api/subtasks/:id` | Yes | Update a subtask |
| DELETE | `/api/subtasks/:id` | Yes | Delete a subtask |

## Request Examples

**Register** — `POST /api/auth/register`
```json
{ "name": "John Doe", "email": "john@example.com", "password": "securePassword123" }
```
Returns `201` with `{ "success": true, "token": "...", "user": { ... } }`.

**Create task** — `POST /api/tasks`
```json
{
  "title": "Design landing page",
  "description": "Create a responsive landing page.",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-09-01T00:00:00.000Z",
  "assignedTo": "john@example.com",
  "subtasks": [{ "title": "Review wireframe", "completed": false }]
}
```
Enums — Status: `pending`, `in-progress`, `completed`, `cancelled` · Priority: `low`, `medium`, `high`, `urgent`

## Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created (register, create task/subtask) |
| 400 | Missing/invalid fields |
| 401 | Auth failed (see below) |
| 404 | Resource or route not found |
| 409 | Email already exists (register) |
| 500 | Server error |

### Auth errors (401)
| Message | When |
|---------|------|
| `Access token required` | No token provided |
| `Invalid token` | Malformed token |
| `Token expired` | Token has expired |
| `Invalid token - user not found` | User no longer exists |

### Not found (404)
- Task/subtask routes: `{ "success": false, "error": "Task not found" }`
- Unknown route: `{ "success": false, "message": "Route not found" }`

## Notes
- Every task and subtask is scoped to the authenticated user.
- Passwords are never returned in responses.
- Timestamps are ISO 8601.