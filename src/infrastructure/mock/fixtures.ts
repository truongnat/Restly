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
    key: 'User-Agent',
    value: 'Restly/1.0.0',
    description: 'Client identifier',
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
    url: 'https://api.restly.app/v1/user/profile',
    status: 200,
    statusText: 'OK',
    durationMs: 124,
    when: '2 mins ago',
    group: 'Today',
  },
  {
    id: 'h2',
    method: 'POST',
    url: 'https://api.restly.app/v1/auth/login',
    status: 201,
    statusText: 'Created',
    durationMs: 210,
    when: '18 mins ago',
    group: 'Today',
  },
  {
    id: 'h3',
    method: 'GET',
    url: 'https://api.restly.app/v1/invoices',
    status: 500,
    statusText: 'Error',
    durationMs: 890,
    when: 'Yesterday 18:42',
    group: 'Yesterday',
  },
]

export const mockEnvironments: Environment[] = [
  {
    id: 'env-prod',
    name: 'Production',
    color: 'bg-emerald-500',
    variables: [
      { id: 'v1', enabled: true, key: 'base_url', value: 'https://api.restly.com' },
      { id: 'v2', enabled: true, key: 'api_key', value: '••••••••••••', secret: true },
      { id: 'v3', enabled: true, key: 'tenant', value: 'acme-prod' },
    ],
  },
  {
    id: 'env-staging',
    name: 'Staging',
    color: 'bg-amber-500',
    variables: [
      { id: 'v1', enabled: true, key: 'base_url', value: 'https://staging.restly.com' },
      { id: 'v2', enabled: true, key: 'api_key', value: '••••••••', secret: true },
    ],
  },
  {
    id: 'env-local',
    name: 'Local',
    color: 'bg-sky-500',
    variables: [{ id: 'v1', enabled: true, key: 'base_url', value: 'http://localhost:3000' }],
  },
]
