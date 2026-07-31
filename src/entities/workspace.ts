import { z } from 'zod'

/**
 * Workspace entity — top-level container for collections, environments, and settings.
 * FEAT-01: Multi-Workspace & Nested Collection Storage
 */
export const workspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Workspace name is required'),
  description: z.string().default(''),
  icon: z.string().default('folder'),
  createdAt: z.number(),
  updatedAt: z.number(),
  activeEnvironmentId: z.string().nullable().default(null),
})

export type Workspace = z.infer<typeof workspaceSchema>

/**
 * Create a new workspace with default values.
 */
export function createWorkspace(name: string, description = ''): Workspace {
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    name,
    description,
    icon: 'folder',
    createdAt: now,
    updatedAt: now,
    activeEnvironmentId: null,
  }
}
