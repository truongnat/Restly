/** TanStack Query keys — stable identifiers for cached remote/mock data. */
export const restlyKeys = {
  collections: ['collections'] as const,
  history: ['history'] as const,
  environments: ['environments'] as const,
  response: (url: string) => ['response', url] as const,
}
