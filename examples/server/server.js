/**
 * Restly Example Server
 *
 * A comprehensive API server for testing all Restly features:
 * - REST CRUD operations
 * - Authentication (Basic, Bearer, API Key)
 * - Pagination, filtering, sorting
 * - Delayed responses & timeouts
 * - Error simulation
 * - File upload/download
 * - Streaming responses
 * - Various content types
 *
 * Usage: npm start (runs on http://localhost:3000)
 */

import { dirname } from 'path'
import { fileURLToPath } from 'url'

import cors from 'cors'
import express from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.text())

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

// ============================================================================
// In-Memory Database
// ============================================================================

const db = {
  users: [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'admin',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'user',
      createdAt: '2024-02-20T14:45:00Z',
    },
    {
      id: '3',
      name: 'Carol Williams',
      email: 'carol@example.com',
      role: 'user',
      createdAt: '2024-03-10T09:15:00Z',
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david@example.com',
      role: 'moderator',
      createdAt: '2024-04-05T16:20:00Z',
    },
    {
      id: '5',
      name: 'Eve Davis',
      email: 'eve@example.com',
      role: 'user',
      createdAt: '2024-05-12T11:00:00Z',
    },
  ],
  posts: [
    {
      id: '1',
      userId: '1',
      title: 'Getting Started with REST APIs',
      body: 'REST APIs are the backbone of modern web development...',
      tags: ['api', 'rest', 'tutorial'],
      views: 1520,
      createdAt: '2024-06-01T08:00:00Z',
    },
    {
      id: '2',
      userId: '2',
      title: 'Understanding HTTP Methods',
      body: 'GET, POST, PUT, PATCH, DELETE - each has its purpose...',
      tags: ['http', 'methods'],
      views: 890,
      createdAt: '2024-06-05T12:30:00Z',
    },
    {
      id: '3',
      userId: '1',
      title: 'Authentication Best Practices',
      body: 'Securing your API with proper authentication...',
      tags: ['security', 'auth', 'jwt'],
      views: 2340,
      createdAt: '2024-06-10T15:45:00Z',
    },
    {
      id: '4',
      userId: '3',
      title: 'Error Handling in APIs',
      body: 'Proper error responses make debugging easier...',
      tags: ['errors', 'best-practices'],
      views: 670,
      createdAt: '2024-06-15T09:20:00Z',
    },
    {
      id: '5',
      userId: '4',
      title: 'Pagination Strategies',
      body: 'Offset vs cursor-based pagination compared...',
      tags: ['pagination', 'performance'],
      views: 1100,
      createdAt: '2024-06-20T14:10:00Z',
    },
  ],
  comments: [
    {
      id: '1',
      postId: '1',
      userId: '2',
      body: 'Great introduction!',
      createdAt: '2024-06-02T10:00:00Z',
    },
    {
      id: '2',
      postId: '1',
      userId: '3',
      body: 'Very helpful, thanks!',
      createdAt: '2024-06-02T11:30:00Z',
    },
    {
      id: '3',
      postId: '3',
      userId: '4',
      body: 'Security is so important.',
      createdAt: '2024-06-11T08:15:00Z',
    },
  ],
  tokens: new Map(), // For session management
}

// Valid API keys for testing
const API_KEYS = {
  rk_live_abc123: { name: 'Production Key', permissions: ['read', 'write'] },
  rk_test_xyz789: { name: 'Test Key', permissions: ['read'] },
}

// Valid credentials for Basic Auth
const BASIC_AUTH_USERS = {
  admin: 'secret123',
  user: 'password456',
}

// ============================================================================
// Helper Functions
// ============================================================================

function paginate(items, page = 1, limit = 10) {
  const start = (page - 1) * limit
  const end = start + limit
  return {
    data: items.slice(start, end),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
      hasNext: end < items.length,
      hasPrev: page > 1,
    },
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function generateToken(user) {
  const token = uuidv4()
  db.tokens.set(token, { userId: user.id, createdAt: new Date().toISOString() })
  return token
}

// ============================================================================
// Root & Health
// ============================================================================

app.get('/', (req, res) => {
  res.json({
    name: 'Restly Example API',
    version: '1.0.0',
    description: 'A comprehensive API for testing Restly features',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      comments: '/api/comments',
      auth: '/api/auth',
      files: '/api/files',
      stream: '/api/stream',
      debug: '/api/debug',
    },
    documentation: '/api/docs',
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  })
})

// ============================================================================
// API Documentation
// ============================================================================

app.get('/api/docs', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'Restly Example API',
      version: '1.0.0',
      description: 'Comprehensive API for testing HTTP clients',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    paths: {
      '/api/users': { get: { summary: 'List users' }, post: { summary: 'Create user' } },
      '/api/users/{id}': {
        get: { summary: 'Get user' },
        put: { summary: 'Update user' },
        delete: { summary: 'Delete user' },
      },
      '/api/posts': { get: { summary: 'List posts' }, post: { summary: 'Create post' } },
      '/api/auth/login': { post: { summary: 'Login (returns token)' } },
      '/api/auth/basic': { get: { summary: 'Basic Auth test' } },
      '/api/auth/apikey': { get: { summary: 'API Key test' } },
      '/api/debug/delay/{ms}': { get: { summary: 'Delayed response' } },
      '/api/debug/error/{code}': { get: { summary: 'Error simulation' } },
      '/api/files/upload': { post: { summary: 'Upload file' } },
      '/api/stream/events': { get: { summary: 'Server-Sent Events' } },
    },
  })
})

// ============================================================================
// Users API (CRUD)
// ============================================================================

app.get('/api/users', (req, res) => {
  let users = [...db.users]

  // Filtering
  if (req.query.role) {
    users = users.filter((u) => u.role === req.query.role)
  }
  if (req.query.search) {
    const search = req.query.search.toLowerCase()
    users = users.filter(
      (u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search),
    )
  }

  // Sorting
  const sortBy = req.query.sortBy || 'createdAt'
  const order = req.query.order === 'desc' ? -1 : 1
  users.sort((a, b) => (a[sortBy] > b[sortBy] ? order : -order))

  // Pagination
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const result = paginate(users, page, limit)

  res.json(result)
})

app.get('/api/users/:id', (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' })
  }
  res.json({ data: user })
})

app.post('/api/users', (req, res) => {
  const { name, email, role = 'user' } = req.body

  if (!name || !email) {
    return res.status(400).json({
      error: 'Validation failed',
      details: [
        { field: 'name', message: 'Name is required' },
        { field: 'email', message: 'Email is required' },
      ].filter((d) => !req.body[d.field.replace('Name', 'name')]),
    })
  }

  if (db.users.some((u) => u.email === email)) {
    return res.status(409).json({ error: 'Email already exists', code: 'EMAIL_EXISTS' })
  }

  const user = {
    id: String(db.users.length + 1),
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
  }

  db.users.push(user)
  res.status(201).json({ data: user, message: 'User created successfully' })
})

app.put('/api/users/:id', (req, res) => {
  const index = db.users.findIndex((u) => u.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' })
  }

  const { name, email, role } = req.body
  db.users[index] = {
    ...db.users[index],
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role }),
    updatedAt: new Date().toISOString(),
  }

  res.json({ data: db.users[index], message: 'User updated successfully' })
})

app.patch('/api/users/:id', (req, res) => {
  const index = db.users.findIndex((u) => u.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' })
  }

  db.users[index] = { ...db.users[index], ...req.body, updatedAt: new Date().toISOString() }
  res.json({ data: db.users[index], message: 'User patched successfully' })
})

app.delete('/api/users/:id', (req, res) => {
  const index = db.users.findIndex((u) => u.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' })
  }

  const deleted = db.users.splice(index, 1)[0]
  res.json({ data: deleted, message: 'User deleted successfully' })
})

// ============================================================================
// Posts API (with relations)
// ============================================================================

app.get('/api/posts', (req, res) => {
  let posts = [...db.posts]

  // Filter by user
  if (req.query.userId) {
    posts = posts.filter((p) => p.userId === req.query.userId)
  }

  // Filter by tag
  if (req.query.tag) {
    posts = posts.filter((p) => p.tags.includes(req.query.tag))
  }

  // Search
  if (req.query.q) {
    const q = req.query.q.toLowerCase()
    posts = posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q),
    )
  }

  // Sort by views or date
  const sortBy = req.query.sortBy || 'createdAt'
  const order = req.query.order === 'asc' ? 1 : -1
  posts.sort((a, b) => (a[sortBy] > b[sortBy] ? order : -order))

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const result = paginate(posts, page, limit)

  // Include author info if requested
  if (req.query.include === 'author') {
    result.data = result.data.map((post) => ({
      ...post,
      author: db.users.find((u) => u.id === post.userId) || null,
    }))
  }

  res.json(result)
})

app.get('/api/posts/:id', (req, res) => {
  const post = db.posts.find((p) => p.id === req.params.id)
  if (!post) {
    return res.status(404).json({ error: 'Post not found', code: 'POST_NOT_FOUND' })
  }

  // Increment view count
  post.views++

  const comments = db.comments.filter((c) => c.postId === post.id)
  const author = db.users.find((u) => u.id === post.userId)

  res.json({
    data: { ...post, author, comments },
  })
})

app.post('/api/posts', (req, res) => {
  const { userId, title, body, tags = [] } = req.body

  if (!userId || !title || !body) {
    return res.status(400).json({
      error: 'Validation failed',
      required: ['userId', 'title', 'body'],
    })
  }

  if (!db.users.some((u) => u.id === userId)) {
    return res.status(400).json({ error: 'Invalid userId', code: 'INVALID_USER' })
  }

  const post = {
    id: String(db.posts.length + 1),
    userId,
    title,
    body,
    tags,
    views: 0,
    createdAt: new Date().toISOString(),
  }

  db.posts.push(post)
  res.status(201).json({ data: post, message: 'Post created successfully' })
})

app.delete('/api/posts/:id', (req, res) => {
  const index = db.posts.findIndex((p) => p.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found', code: 'POST_NOT_FOUND' })
  }

  const deleted = db.posts.splice(index, 1)[0]
  // Also delete related comments
  db.comments = db.comments.filter((c) => c.postId !== deleted.id)

  res.json({ data: deleted, message: 'Post and comments deleted' })
})

// ============================================================================
// Comments API
// ============================================================================

app.get('/api/posts/:postId/comments', (req, res) => {
  const comments = db.comments.filter((c) => c.postId === req.params.postId)
  res.json({ data: comments, total: comments.length })
})

app.post('/api/posts/:postId/comments', (req, res) => {
  const { userId, body } = req.body

  if (!db.posts.some((p) => p.id === req.params.postId)) {
    return res.status(404).json({ error: 'Post not found' })
  }

  const comment = {
    id: String(db.comments.length + 1),
    postId: req.params.postId,
    userId,
    body,
    createdAt: new Date().toISOString(),
  }

  db.comments.push(comment)
  res.status(201).json({ data: comment })
})

// ============================================================================
// Authentication Endpoints
// ============================================================================

// Login - returns Bearer token
app.post('/api/auth/login', (req, res) => {
  const { email, password: _password } = req.body

  // Simple validation (in real app, check password hash)
  const user = db.users.find((u) => u.email === email)
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials', code: 'AUTH_FAILED' })
  }

  const token = generateToken(user)

  res.json({
    data: {
      token,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
  })
})

// Verify Bearer token
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.split(' ')[1]
  const session = db.tokens.get(token)

  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired token', code: 'TOKEN_INVALID' })
  }

  const user = db.users.find((u) => u.id === session.userId)
  res.json({ data: { valid: true, user } })
})

// Basic Auth test
app.get('/api/auth/basic', (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Restly API"')
    return res.status(401).json({ error: 'Basic authentication required' })
  }

  const base64 = authHeader.split(' ')[1]
  const [username, password] = Buffer.from(base64, 'base64').toString().split(':')

  if (BASIC_AUTH_USERS[username] !== password) {
    return res.status(401).json({ error: 'Invalid credentials', code: 'AUTH_FAILED' })
  }

  res.json({
    data: {
      authenticated: true,
      username,
      message: `Welcome, ${username}!`,
    },
  })
})

// API Key test
app.get('/api/auth/apikey', (req, res) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey

  if (!apiKey) {
    return res
      .status(401)
      .json({ error: 'API key required', hint: 'Use X-API-Key header or ?apiKey= query param' })
  }

  const keyInfo = API_KEYS[apiKey]
  if (!keyInfo) {
    return res.status(403).json({ error: 'Invalid API key', code: 'INVALID_API_KEY' })
  }

  res.json({
    data: {
      valid: true,
      keyName: keyInfo.name,
      permissions: keyInfo.permissions,
    },
  })
})

// Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    db.tokens.delete(token)
  }
  res.json({ message: 'Logged out successfully' })
})

// ============================================================================
// Debug & Testing Endpoints
// ============================================================================

// Delayed response
app.get('/api/debug/delay/:ms', async (req, res) => {
  const ms = Math.min(parseInt(req.params.ms) || 1000, 30000) // Max 30s
  await delay(ms)
  res.json({
    message: `Response delayed by ${ms}ms`,
    requestedDelay: ms,
    timestamp: new Date().toISOString(),
  })
})

// Error simulation
app.get('/api/debug/error/:code', (req, res) => {
  const code = parseInt(req.params.code)
  const errors = {
    400: { error: 'Bad Request', message: 'The request was malformed' },
    401: { error: 'Unauthorized', message: 'Authentication required' },
    403: { error: 'Forbidden', message: 'Access denied' },
    404: { error: 'Not Found', message: 'Resource does not exist' },
    409: { error: 'Conflict', message: 'Resource conflict' },
    422: { error: 'Unprocessable Entity', message: 'Validation failed' },
    429: { error: 'Too Many Requests', message: 'Rate limit exceeded', retryAfter: 60 },
    500: { error: 'Internal Server Error', message: 'Something went wrong' },
    502: { error: 'Bad Gateway', message: 'Upstream server error' },
    503: { error: 'Service Unavailable', message: 'Server is down' },
  }

  const error = errors[code] || { error: 'Unknown Error', message: `Status ${code}` }

  if (code === 429) {
    res.set('Retry-After', '60')
  }

  res.status(code).json({ ...error, code, timestamp: new Date().toISOString() })
})

// Echo request details
app.all('/api/debug/echo', (req, res) => {
  res.json({
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.body,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  })
})

// Response headers test
app.get('/api/debug/headers', (req, res) => {
  res.set({
    'X-Custom-Header': 'custom-value',
    'X-Request-Id': uuidv4(),
    'X-RateLimit-Limit': '100',
    'X-RateLimit-Remaining': '99',
    'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 3600),
    'Cache-Control': 'no-cache',
  })
  res.json({ message: 'Check response headers' })
})

// Different content types
app.get('/api/debug/content-type/:type', (req, res) => {
  const type = req.params.type

  switch (type) {
    case 'json':
      res.json({ format: 'json', data: { nested: { value: true } } })
      break
    case 'xml':
      res
        .type('application/xml')
        .send('<?xml version="1.0"?><response><format>xml</format><status>ok</status></response>')
      break
    case 'html':
      res
        .type('text/html')
        .send('<html><body><h1>HTML Response</h1><p>This is HTML content.</p></body></html>')
      break
    case 'text':
      res.type('text/plain').send('Plain text response')
      break
    case 'csv':
      res.type('text/csv').send('id,name,email\n1,Alice,alice@example.com\n2,Bob,bob@example.com')
      break
    case 'yaml':
      res.type('text/yaml').send('format: yaml\ndata:\n  nested:\n    value: true')
      break
    default:
      res
        .status(400)
        .json({ error: 'Unknown type', available: ['json', 'xml', 'html', 'text', 'csv', 'yaml'] })
  }
})

// Large response (for testing response size limits)
app.get('/api/debug/large/:sizeKb', (req, res) => {
  const sizeKb = Math.min(parseInt(req.params.sizeKb) || 100, 5000) // Max 5MB
  const chunk = 'x'.repeat(1024) // 1KB
  const data = chunk.repeat(sizeKb)

  res.set('X-Response-Size-KB', String(sizeKb))
  res.json({
    sizeKb,
    data,
    message: `This response is approximately ${sizeKb}KB`,
  })
})

// Redirect chain
app.get('/api/debug/redirect/:count', (req, res) => {
  const count = parseInt(req.params.count) || 1
  if (count > 1) {
    res.redirect(`/api/debug/redirect/${count - 1}`)
  } else {
    res.json({ message: 'Redirect chain complete', originalCount: req.query.original || count })
  }
})

// ============================================================================
// File Operations
// ============================================================================

// Upload file
app.post('/api/files/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: 'No file uploaded', hint: 'Use form-data with field name "file"' })
  }

  res.status(201).json({
    data: {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      encoding: req.file.encoding,
    },
    message: 'File uploaded successfully',
  })
})

// Upload multiple files
app.post('/api/files/upload-multiple', upload.array('files', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' })
  }

  res.status(201).json({
    data: req.files.map((f) => ({
      filename: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
    })),
    count: req.files.length,
    message: 'Files uploaded successfully',
  })
})

// Download sample file
app.get('/api/files/download/:type', (req, res) => {
  const type = req.params.type

  const files = {
    json: {
      name: 'sample.json',
      content: JSON.stringify({ sample: true }, null, 2),
      mime: 'application/json',
    },
    text: {
      name: 'sample.txt',
      content: 'This is a sample text file.\nLine 2\nLine 3',
      mime: 'text/plain',
    },
    csv: {
      name: 'sample.csv',
      content: 'id,name,value\n1,Item A,100\n2,Item B,200',
      mime: 'text/csv',
    },
  }

  const file = files[type]
  if (!file) {
    return res.status(404).json({ error: 'File type not found', available: Object.keys(files) })
  }

  res.set({
    'Content-Type': file.mime,
    'Content-Disposition': `attachment; filename="${file.name}"`,
  })
  res.send(file.content)
})

// ============================================================================
// Streaming Endpoints
// ============================================================================

// Server-Sent Events
app.get('/api/stream/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })

  let count = 0
  const maxEvents = parseInt(req.query.count) || 10

  const interval = setInterval(() => {
    count++
    res.write(`data: ${JSON.stringify({ event: count, time: new Date().toISOString() })}\n\n`)

    if (count >= maxEvents) {
      res.write(`data: ${JSON.stringify({ event: 'done', message: 'Stream complete' })}\n\n`)
      clearInterval(interval)
      res.end()
    }
  }, 1000)

  req.on('close', () => clearInterval(interval))
})

// Chunked response
app.get('/api/stream/chunks', async (req, res) => {
  const chunks = parseInt(req.query.chunks) || 5

  res.set({
    'Content-Type': 'application/json',
    'Transfer-Encoding': 'chunked',
  })

  res.write('[')

  for (let i = 0; i < chunks; i++) {
    await delay(500)
    const item = JSON.stringify({ chunk: i + 1, data: `Data block ${i + 1}` })
    res.write(i > 0 ? ',' + item : item)
  }

  res.write(']')
  res.end()
})

// ============================================================================
// Batch & Bulk Operations
// ============================================================================

app.post('/api/batch/users', (req, res) => {
  const { users } = req.body

  if (!Array.isArray(users)) {
    return res.status(400).json({ error: 'Expected array of users' })
  }

  const results = users.map((u, i) => {
    if (!u.name || !u.email) {
      return { index: i, success: false, error: 'Missing name or email' }
    }

    const user = {
      id: String(db.users.length + 1),
      name: u.name,
      email: u.email,
      role: u.role || 'user',
      createdAt: new Date().toISOString(),
    }
    db.users.push(user)
    return { index: i, success: true, data: user }
  })

  res.status(201).json({
    data: results,
    summary: {
      total: users.length,
      succeeded: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    },
  })
})

// ============================================================================
// WebSocket-like polling endpoint
// ============================================================================

let notifications = []

app.post('/api/notifications', (req, res) => {
  const notification = {
    id: uuidv4(),
    message: req.body.message,
    type: req.body.type || 'info',
    createdAt: new Date().toISOString(),
    read: false,
  }
  notifications.push(notification)
  res.status(201).json({ data: notification })
})

app.get('/api/notifications', (req, res) => {
  const since = req.query.since
  let result = notifications

  if (since) {
    result = notifications.filter((n) => n.createdAt > since)
  }

  res.json({ data: result, total: result.length })
})

app.patch('/api/notifications/:id/read', (req, res) => {
  const notification = notifications.find((n) => n.id === req.params.id)
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' })
  }
  notification.read = true
  res.json({ data: notification })
})

// ============================================================================
// 404 Handler
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    hint: 'Check /api/docs for available endpoints',
    timestamp: new Date().toISOString(),
  })
})

// ============================================================================
// Error Handler
// ============================================================================

app.use((err, req, res, _next) => {
  console.error('Server error:', err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString(),
  })
})

// ============================================================================
// Start Server
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           🚀 Restly Example Server Started 🚀                 ║
╠═══════════════════════════════════════════════════════════════╣
║  URL:          http://localhost:${PORT}                         ║
║  API Docs:     http://localhost:${PORT}/api/docs                ║
║  Health:       http://localhost:${PORT}/health                  ║
╠═══════════════════════════════════════════════════════════════╣
║  Test Credentials:                                            ║
║    Basic Auth:  admin / secret123                             ║
║    API Keys:    rk_live_abc123 (read/write)                   ║
║                 rk_test_xyz789 (read only)                    ║
╠═══════════════════════════════════════════════════════════════╣
║  Quick Tests:                                                 ║
║    GET  /api/users                                            ║
║    GET  /api/posts?include=author                             ║
║    POST /api/auth/login                                       ║
║    GET  /api/debug/delay/2000                                 ║
║    GET  /api/debug/error/500                                  ║
╚═══════════════════════════════════════════════════════════════╝
  `)
})

export default app
