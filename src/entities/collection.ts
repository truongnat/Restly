import type { RequestItem } from '@/entities/request'

export type CollectionFolder = {
  id: string
  name: string
  open: boolean
  requests: RequestItem[]
}
