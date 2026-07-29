import { requestDraftSchema, type RequestDraft } from '@/entities'

export type RequestEditorValidation = {
  isValid: boolean
  urlError?: string
  headerError?: string
}

export function validateRequestEditor(draft: RequestDraft): RequestEditorValidation {
  const result = requestDraftSchema.safeParse(draft)
  if (result.success) return { isValid: true }

  let urlError: string | undefined
  let headerError: string | undefined

  for (const issue of result.error.issues) {
    if (issue.path[0] === 'url' && !urlError) {
      urlError = issue.message
    }
    if (issue.path[0] === 'headers' && !headerError) {
      headerError = issue.message
    }
  }

  return {
    isValid: false,
    urlError,
    headerError,
  }
}
