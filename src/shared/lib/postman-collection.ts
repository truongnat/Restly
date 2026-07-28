import type { CollectionFolder, HttpMethod } from '@/entities'

type PostmanUrl = string | { raw?: string; host?: string[]; path?: string[] }

type PostmanItem = {
  name?: string
  request?: {
    method?: string
    url?: PostmanUrl
    header?: Array<{ key?: string; value?: string; disabled?: boolean }>
    body?: { mode?: string; raw?: string }
  }
  item?: PostmanItem[]
}

type PostmanCollection = {
  info?: { name?: string; schema?: string }
  name?: string
  item?: PostmanItem[]
}

const V21_SCHEMA = 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'

function urlRaw(url: PostmanUrl | undefined): string {
  if (!url) return 'https://'
  if (typeof url === 'string') return url
  if (url.raw) return url.raw
  const host = (url.host ?? []).join('.')
  const path = (url.path ?? []).join('/')
  return host ? `https://${host}/${path}` : 'https://'
}

function flattenItems(items: PostmanItem[] | undefined, out: PostmanItem[] = []): PostmanItem[] {
  if (!items) return out
  for (const it of items) {
    if (it.request) out.push(it)
    if (it.item?.length) flattenItems(it.item, out)
  }
  return out
}

const METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])

export function collectionFromPostman(
  content: PostmanCollection,
  fileName: string,
): CollectionFolder {
  const name = content.info?.name || content.name || fileName.replace(/\.json$/i, '')
  const requests = flattenItems(content.item).map((it, i) => {
    const methodRaw = (it.request?.method ?? 'GET').toUpperCase()
    const method = (METHODS.has(methodRaw) ? methodRaw : 'GET') as HttpMethod
    return {
      id: `req-imp-${Date.now()}-${i}`,
      name: it.name || `Request ${i + 1}`,
      method,
      url: urlRaw(it.request?.url),
    }
  })
  return {
    id: `coll-imp-${Date.now()}`,
    name,
    open: true,
    requests,
  }
}

export function collectionToPostmanV21(folders: CollectionFolder[]): PostmanCollection {
  return {
    info: {
      name: 'Restly Export',
      schema: V21_SCHEMA,
    },
    item: folders.map((folder) => ({
      name: folder.name,
      item: folder.requests.map((req) => ({
        name: req.name,
        request: {
          method: req.method,
          header: [],
          url: req.url,
        },
      })),
    })),
  }
}

export function downloadPostmanCollection(
  folders: CollectionFolder[],
  filename = 'restly-collection.json',
) {
  const json = JSON.stringify(collectionToPostmanV21(folders), null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
