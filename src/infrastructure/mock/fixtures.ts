import type {
  AuthProfile,
  CollectionFolder,
  Environment,
  HeaderRow,
  HistoryItem,
  MockServer,
  ParamRow,
  RequestAuth,
} from '@/entities'

export const sampleResponseJson = `{
  "id": "usr_9981223",
  "object": "user",
  "email": "alex.smith@restly.com",
  "name": "Alex Smith",
  "status": "active",
  "metadata": {
    "role": "administrator",
    "region": "us-east-1",
    "last_login": "2023-11-20T14:48:01Z"
  },
  "subscription": {
    "plan": "Enterprise",
    "renewal_date": "2024-12-01"
  }
}`

export const mockParams: ParamRow[] = [
  {
    id: 'p1',
    enabled: true,
    key: 'page',
    value: '1',
    description: 'Page number',
  },
  {
    id: 'p2',
    enabled: true,
    key: 'limit',
    value: '10',
    description: 'Items per page',
  },
]

export const mockHeaders: HeaderRow[] = [
  {
    id: 'h1',
    enabled: true,
    key: 'Accept',
    value: 'application/json',
    description: 'Expected response format',
  },
  {
    id: 'h2',
    enabled: true,
    key: 'Content-Type',
    value: 'application/json',
    description: 'Request body media type',
  },
  {
    id: 'h3',
    enabled: true,
    key: 'User-Agent',
    value: 'Restly/1.0.0',
    description: 'Client identifier',
  },
  {
    id: 'h4',
    enabled: true,
    key: 'X-Request-Id',
    value: 'req_mock_9981223',
    description: 'Client correlation id',
  },
]

export const mockAuth: RequestAuth = {
  type: 'bearer',
  bearerToken: '8ff1b6f8-99a3-47bb-bb76-c457b34dcf38',
}

export const mockBody = sampleResponseJson
export const mockContentType = 'application/json'

export const mockFolders: CollectionFolder[] = [
  {
    id: 'users',
    name: 'Users',
    open: true,
    requests: [
      {
        id: 'req-get-user',
        name: 'List Users',
        method: 'GET',
        url: 'http://localhost:3000/api/users',
      },
      {
        id: 'req-create-user',
        name: 'Create User',
        method: 'POST',
        url: 'http://localhost:3000/api/users',
      },
    ],
  },
  {
    id: 'auth',
    name: 'Auth',
    open: true,
    requests: [
      {
        id: 'req-login',
        name: 'Login',
        method: 'POST',
        url: 'http://localhost:3000/api/auth/login',
      },
      {
        id: 'req-basic',
        name: 'Basic Auth',
        method: 'GET',
        url: 'http://localhost:3000/api/auth/basic',
      },
    ],
  },
  {
    id: 'debug',
    name: 'Debug',
    open: false,
    requests: [
      {
        id: 'req-delay',
        name: 'Delayed Response',
        method: 'GET',
        url: 'http://localhost:3000/api/debug/delay/2000',
      },
      {
        id: 'req-error',
        name: 'Error 500',
        method: 'GET',
        url: 'http://localhost:3000/api/debug/error/500',
      },
    ],
  },
]

export const mockHistory: HistoryItem[] = [
  {
    id: 'h1',
    method: 'GET',
    url: 'http://localhost:3000/api/users',
    status: 200,
    statusText: 'OK',
    durationMs: 124,
    when: '2 mins ago',
    group: 'Today',
    params: mockParams,
    headers: mockHeaders,
    body: '',
    contentType: 'application/json',
    auth: mockAuth,
  },
  {
    id: 'h2',
    method: 'POST',
    url: 'http://localhost:3000/api/auth/login',
    status: 200,
    statusText: 'OK',
    durationMs: 210,
    when: '18 mins ago',
    group: 'Today',
    params: [],
    headers: [
      {
        id: 'h-login-ct',
        enabled: true,
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        id: 'h-login-accept',
        enabled: true,
        key: 'Accept',
        value: 'application/json',
      },
    ],
    body: '{\n  "email": "alice@example.com",\n  "password": "any"\n}',
    contentType: 'application/json',
    auth: { type: 'none' },
  },
  {
    id: 'h3',
    method: 'GET',
    url: 'http://localhost:3000/api/posts',
    status: 200,
    statusText: 'OK',
    durationMs: 342,
    when: '45 mins ago',
    group: 'Today',
    params: [
      {
        id: 'p-posts-1',
        enabled: true,
        key: 'include',
        value: 'author',
        description: '',
      },
    ],
    headers: mockHeaders,
    body: '',
    contentType: 'application/json',
    auth: mockAuth,
  },
  {
    id: 'h4',
    method: 'GET',
    url: 'http://localhost:3000/api/auth/basic',
    status: 200,
    statusText: 'OK',
    durationMs: 56,
    when: 'Yesterday 16:12',
    group: 'Yesterday',
    params: [],
    headers: mockHeaders,
    body: '',
    contentType: 'application/json',
    auth: {
      type: 'basic',
      basicUsername: 'admin',
      basicPassword: 'secret123',
    },
  },
  {
    id: 'h5',
    method: 'GET',
    url: 'http://localhost:3000/api/debug/error/500',
    status: 500,
    statusText: 'Internal Server Error',
    durationMs: 890,
    when: 'Yesterday 11:20',
    group: 'Yesterday',
    params: [],
    headers: mockHeaders,
    body: '',
    contentType: 'application/json',
    auth: { type: 'none' },
  },
  {
    id: 'h6',
    method: 'GET',
    url: 'http://localhost:3000/api/users/999',
    status: 404,
    statusText: 'Not Found',
    durationMs: 61,
    when: '3 days ago',
    group: 'Older',
    params: [],
    headers: [
      {
        id: 'h-del-accept',
        enabled: true,
        key: 'Accept',
        value: 'application/json',
      },
    ],
    body: '',
    contentType: 'application/json',
    auth: mockAuth,
  },
  {
    id: 'h7',
    method: 'GET',
    url: 'http://localhost:3000/api/auth/apikey',
    status: 200,
    statusText: 'OK',
    durationMs: 98,
    when: 'Last week',
    group: 'Older',
    params: [],
    headers: [
      ...mockHeaders,
      {
        id: 'h-apikey',
        enabled: true,
        key: 'X-API-Key',
        value: 'rk_live_abc123',
      },
    ],
    body: '',
    contentType: 'application/json',
    auth: {
      type: 'apikey',
      apiKey: 'rk_live_abc123',
      apiKeyHeader: 'X-API-Key',
      apiKeyIn: 'header',
    },
  },
  {
    id: 'h8',
    method: 'GET',
    url: 'http://localhost:3000/api/debug/delay/2000',
    status: 200,
    statusText: 'OK',
    durationMs: 2015,
    when: 'Last week',
    group: 'Older',
    params: [],
    headers: mockHeaders,
    body: '',
    contentType: 'application/json',
    auth: { type: 'none' },
  },
]

export const mockEnvironments: Environment[] = [
  {
    id: 'env-local',
    name: 'Local Dev',
    color: 'bg-emerald-500',
    variables: [
      {
        id: 'v1',
        enabled: true,
        key: 'base_url',
        value: 'http://localhost:3000',
        description: 'Example server URL',
      },
      {
        id: 'v2',
        enabled: true,
        key: 'api_key',
        value: 'rk_live_abc123',
        secret: true,
        description: 'API Key (read/write)',
      },
      {
        id: 'v3',
        enabled: true,
        key: 'username',
        value: 'admin',
        description: 'Basic Auth username',
      },
      {
        id: 'v4',
        enabled: true,
        key: 'password',
        value: 'secret123',
        secret: true,
        description: 'Basic Auth password',
      },
    ],
  },
  {
    id: 'env-staging',
    name: 'Staging',
    color: 'bg-amber-500',
    variables: [
      {
        id: 'v1',
        enabled: true,
        key: 'base_url',
        value: 'https://staging.restly.com',
        description: 'Staging API host',
      },
      {
        id: 'v2',
        enabled: true,
        key: 'api_key',
        value: 'restly_test_sk_demo_staging',
        secret: true,
        description: 'Staging API key',
      },
    ],
  },
  {
    id: 'env-prod',
    name: 'Production',
    color: 'bg-sky-500',
    variables: [
      {
        id: 'v1',
        enabled: true,
        key: 'base_url',
        value: 'https://api.restly.com',
        description: 'Production API host',
      },
      {
        id: 'v2',
        enabled: true,
        key: 'api_key',
        value: 'restly_live_sk_demo',
        secret: true,
        description: 'Production API key',
      },
    ],
  },
]

export const mockAuthProfiles: AuthProfile[] = [
  {
    id: 'auth-bearer',
    name: 'Bearer Token',
    description: 'Example server Bearer token',
    auth: {
      type: 'bearer',
      bearerToken: '8ff1b6f8-99a3-47bb-bb76-c457b34dcf38',
    },
  },
  {
    id: 'auth-basic-admin',
    name: 'Admin Basic',
    description: 'Basic Auth for example server',
    auth: {
      type: 'basic',
      basicUsername: 'admin',
      basicPassword: 'secret123',
    },
  },
  {
    id: 'auth-apikey',
    name: 'API Key',
    description: 'API Key authentication',
    auth: {
      type: 'apikey',
      apiKey: 'rk_live_abc123',
      apiKeyHeader: 'X-API-Key',
      apiKeyIn: 'header',
    },
  },
]

export const mockServers: MockServer[] = [
  {
    id: 'mock-users',
    name: 'Users API',
    baseUrl: 'http://localhost:3000/api',
    running: true,
    description: 'Example server user endpoints',
    routes: [
      {
        id: 'mr-1',
        enabled: true,
        method: 'GET',
        path: '/users',
        status: 200,
        delayMs: 120,
        responseBody: '{\n  "data": [\n    { "id": "1", "name": "Alice" }\n  ]\n}',
      },
      {
        id: 'mr-2',
        enabled: true,
        method: 'POST',
        path: '/users',
        status: 201,
        delayMs: 80,
        responseBody: '{\n  "data": { "id": "6", "name": "New User" },\n  "message": "Created"\n}',
      },
      {
        id: 'mr-3',
        enabled: false,
        method: 'DELETE',
        path: '/users/:id',
        status: 200,
        delayMs: 40,
        responseBody: '{\n  "message": "Deleted"\n}',
      },
    ],
  },
  {
    id: 'mock-auth',
    name: 'Auth API',
    baseUrl: 'http://localhost:3000/api/auth',
    running: false,
    description: 'Authentication endpoints',
    routes: [
      {
        id: 'mr-4',
        enabled: true,
        method: 'POST',
        path: '/login',
        status: 200,
        delayMs: 250,
        responseBody:
          '{\n  "data": {\n    "token": "mock-token-123",\n    "tokenType": "Bearer"\n  }\n}',
      },
      {
        id: 'mr-5',
        enabled: true,
        method: 'GET',
        path: '/basic',
        status: 200,
        delayMs: 60,
        responseBody: '{\n  "data": { "authenticated": true }\n}',
      },
    ],
  },
]
