# Restly Example Server

A comprehensive API server for testing all Restly features. This server provides endpoints for:

- ✅ REST CRUD operations (Users, Posts, Comments)
- ✅ Authentication (Basic Auth, Bearer Token, API Key)
- ✅ Pagination, filtering, sorting
- ✅ Delayed responses & timeout testing
- ✅ Error simulation (4xx, 5xx)
- ✅ File upload/download
- ✅ Streaming responses (SSE, chunked)
- ✅ Various content types (JSON, XML, HTML, CSV, YAML)
- ✅ Batch operations
- ✅ Redirect chains

## Quick Start

```bash
cd examples/server
npm install
npm start
```

Server runs at **http://localhost:3000**

## Test Credentials

| Type | Value |
|------|-------|
| Basic Auth | `admin` / `secret123` |
| Basic Auth | `user` / `password456` |
| API Key (read/write) | `rk_live_abc123` |
| API Key (read only) | `rk_test_xyz789` |

## API Endpoints

### Users API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (supports `?page=`, `?limit=`, `?role=`, `?search=`, `?sortBy=`, `?order=`) |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user (full) |
| PATCH | `/api/users/:id` | Update user (partial) |
| DELETE | `/api/users/:id` | Delete user |

### Posts API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List posts (`?userId=`, `?tag=`, `?q=`, `?include=author`) |
| GET | `/api/posts/:id` | Get post with comments |
| POST | `/api/posts` | Create post |
| DELETE | `/api/posts/:id` | Delete post + comments |
| GET | `/api/posts/:id/comments` | Get post comments |
| POST | `/api/posts/:id/comments` | Add comment |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (returns Bearer token) |
| GET | `/api/auth/verify` | Verify Bearer token |
| GET | `/api/auth/basic` | Test Basic Auth |
| GET | `/api/auth/apikey` | Test API Key (`X-API-Key` header) |
| POST | `/api/auth/logout` | Logout |

### Debug & Testing

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/debug/delay/:ms` | Delayed response (max 30s) |
| GET | `/api/debug/error/:code` | Simulate HTTP error |
| ALL | `/api/debug/echo` | Echo request details |
| GET | `/api/debug/headers` | Custom response headers |
| GET | `/api/debug/content-type/:type` | Different content types |
| GET | `/api/debug/large/:sizeKb` | Large response (max 5MB) |
| GET | `/api/debug/redirect/:count` | Redirect chain |

### Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/files/upload` | Upload single file |
| POST | `/api/files/upload-multiple` | Upload multiple files |
| GET | `/api/files/download/:type` | Download sample file |

### Streaming

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stream/events` | Server-Sent Events |
| GET | `/api/stream/chunks` | Chunked response |

### Batch Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/batch/users` | Bulk create users |

### Notifications (Polling)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications (`?since=`) |
| POST | `/api/notifications` | Create notification |
| PATCH | `/api/notifications/:id/read` | Mark as read |

## Example Requests

### List users with pagination
```bash
curl "http://localhost:3000/api/users?page=1&limit=2&sortBy=name&order=asc"
```

### Create a user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "New User", "email": "new@example.com", "role": "user"}'
```

### Login and get token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "any"}'
```

### Use Bearer token
```bash
curl http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer <your-token>"
```

### Basic Auth
```bash
curl http://localhost:3000/api/auth/basic \
  -u admin:secret123
```

### API Key
```bash
curl http://localhost:3000/api/auth/apikey \
  -H "X-API-Key: rk_live_abc123"
```

### Test timeout
```bash
curl http://localhost:3000/api/debug/delay/5000
```

### Simulate errors
```bash
curl http://localhost:3000/api/debug/error/500
curl http://localhost:3000/api/debug/error/429
```

### Upload file
```bash
curl -X POST http://localhost:3000/api/files/upload \
  -F "file=@/path/to/file.txt"
```

### Server-Sent Events
```bash
curl http://localhost:3000/api/stream/events?count=5
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |

## License

MIT
