import type {
  CollectionFolder,
  Environment,
  HeaderRow,
  HistoryItem,
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
    key: 'id',
    value: 'usr_9981223',
    description: 'Required user identifier',
  },
  {
    id: 'p2',
    enabled: true,
    key: 'include',
    value: 'billing, subscription',
    description: 'Relationships to expand',
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
  bearerToken: 'restly_mock_token_sec_9981223',
}

export const mockBody = sampleResponseJson
export const mockContentType = 'application/json'

export const mockFolders: CollectionFolder[] = [
  {
    id: 'auth',
    name: 'Auth',
    open: true,
    requests: [
      {
        id: 'req-login',
        name: 'Login',
        method: 'POST',
        url: 'https://api.restly.com/v1/auth/login',
      },
    ],
  },
  {
    id: 'payments',
    name: 'Payments',
    open: true,
    requests: [
      {
        id: 'req-get-user',
        name: 'Get User',
        method: 'GET',
        url: 'https://api.restly.com/v1/user',
      },
      {
        id: 'req-charge',
        name: 'Charge',
        method: 'POST',
        url: 'https://api.restly.com/v1/payments/charge',
      },
    ],
  },
]

export const mockHistory: HistoryItem[] = [
  {
    id: 'h1',
    method: 'GET',
    url: 'https://api.restly.com/v1/user',
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
    url: 'https://api.restly.com/v1/auth/login',
    status: 201,
    statusText: 'Created',
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
    body: '{\n  "email": "alex.smith@restly.com",\n  "password": "{{password}}"\n}',
    contentType: 'application/json',
    auth: { type: 'none' },
  },
  {
    id: 'h3',
    method: 'POST',
    url: 'https://api.restly.com/v1/payments/charge',
    status: 200,
    statusText: 'OK',
    durationMs: 342,
    when: '45 mins ago',
    group: 'Today',
    params: [],
    headers: [
      ...mockHeaders,
      {
        id: 'h-idem',
        enabled: true,
        key: 'Idempotency-Key',
        value: 'chg_demo_9981223',
      },
    ],
    body: '{\n  "amount": 4999,\n  "currency": "usd",\n  "customer": "cus_{{user_id}}"\n}',
    contentType: 'application/json',
    auth: mockAuth,
  },
  {
    id: 'h4',
    method: 'PUT',
    url: 'https://api.restly.com/v1/user/profile',
    status: 204,
    statusText: 'No Content',
    durationMs: 56,
    when: 'Yesterday 16:12',
    group: 'Yesterday',
    params: [],
    headers: mockHeaders,
    body: '{\n  "name": "Alex Smith",\n  "status": "active",\n  "metadata": {\n    "region": "us-east-1"\n  }\n}',
    contentType: 'application/json',
    auth: mockAuth,
  },
  {
    id: 'h5',
    method: 'GET',
    url: 'https://api.restly.com/v1/invoices',
    status: 500,
    statusText: 'Internal Server Error',
    durationMs: 890,
    when: 'Yesterday 11:20',
    group: 'Yesterday',
    params: [
      {
        id: 'p-inv-1',
        enabled: true,
        key: 'limit',
        value: '50',
        description: 'Page size',
      },
      {
        id: 'p-inv-2',
        enabled: true,
        key: 'status',
        value: 'open',
        description: '',
      },
    ],
    headers: mockHeaders,
    body: '',
    contentType: 'application/json',
    auth: mockAuth,
  },
  {
    id: 'h6',
    method: 'DELETE',
    url: 'https://api.restly.com/v1/webhooks/12',
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
    method: 'PATCH',
    url: 'https://api.restly.com/v1/environments/env-prod',
    status: 200,
    statusText: 'OK',
    durationMs: 98,
    when: 'Last week',
    group: 'Older',
    params: [],
    headers: mockHeaders,
    body: '{\n  "name": "Production",\n  "variables": [\n    { "key": "base_url", "value": "https://api.restly.com" }\n  ]\n}',
    contentType: 'application/json',
    auth: {
      type: 'basic',
      basicUsername: 'restly',
      basicPassword: '{{api_secret}}',
    },
  },
  {
    id: 'h8',
    method: 'POST',
    url: 'https://api.restly.com/v1/notes',
    status: 201,
    statusText: 'Created',
    durationMs: 155,
    when: 'Last week',
    group: 'Older',
    params: [],
    headers: [
      {
        id: 'h-xml-ct',
        enabled: true,
        key: 'Content-Type',
        value: 'application/xml',
      },
      {
        id: 'h-xml-accept',
        enabled: true,
        key: 'Accept',
        value: 'application/xml',
      },
    ],
    body: '<?xml version="1.0" encoding="UTF-8"?>\n<note>\n  <to>{{user_id}}</to>\n  <from>Restly</from>\n  <heading>Reminder</heading>\n  <body>Ship the History reopen flow</body>\n</note>',
    contentType: 'application/xml',
    auth: mockAuth,
  },
]

export const mockEnvironments: Environment[] = [
  {
    id: 'env-prod',
    name: 'Production',
    color: 'bg-emerald-500',
    variables: [
      {
        id: 'v1',
        enabled: true,
        key: 'base_url',
        value: 'https://api.restly.com',
        description: 'Main production API endpoint',
      },
      {
        id: 'v2',
        enabled: true,
        key: 'api_key',
        value: 'restly_live_sk_demo_9981223',
        secret: true,
        description: 'Bearer / API authentication key',
      },
      {
        id: 'v3',
        enabled: true,
        key: 'tenant',
        value: 'acme-prod',
        description: 'Tenant slug',
      },
      {
        id: 'v4',
        enabled: true,
        key: 'user_id',
        value: 'usr_9981223',
        description: 'Default user id for path/body tokens',
      },
      {
        id: 'v5',
        enabled: true,
        key: 'password',
        value: 'RestlyDemo!2026',
        secret: true,
        description: 'Demo login password',
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
      {
        id: 'v3',
        enabled: true,
        key: 'user_id',
        value: 'usr_staging_42',
        description: 'Staging user id',
      },
      {
        id: 'v4',
        enabled: true,
        key: 'password',
        value: 'StagingDemo!2026',
        secret: true,
        description: 'Staging login password',
      },
    ],
  },
  {
    id: 'env-local',
    name: 'Local',
    color: 'bg-sky-500',
    variables: [
      {
        id: 'v1',
        enabled: true,
        key: 'base_url',
        value: 'http://localhost:3000',
        description: 'Local API server',
      },
      {
        id: 'v2',
        enabled: true,
        key: 'api_key',
        value: 'local_dev_key',
        secret: true,
        description: 'Local mock key',
      },
      {
        id: 'v3',
        enabled: false,
        key: 'debug',
        value: 'true',
        description: 'Toggle verbose logging (disabled by default)',
      },
    ],
  },
]
