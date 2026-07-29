import type { RequestDraft } from '@/entities'

export type SerializedRequestBody = {
  body: BodyInit | undefined
  contentType: string | undefined
}

function isMultipart(contentType: string): boolean {
  return contentType.toLowerCase().includes('multipart/form-data')
}

function isBinary(contentType: string): boolean {
  return contentType.toLowerCase().includes('application/octet-stream')
}

/**
 * [FLOW:REQUEST:BODY_SERIALIZATION]
 *
 * 1. Text modes preserve the editor text and declare the selected content type.
 * 2. Multipart passes real File objects through FormData.
 * 3. Binary passes the selected File directly.
 * 4. The runtime owns multipart boundary generation, so callers must omit Content-Type.
 *
 * [TRACE:REQUEST:IT0-45]
 */
export function serializeRequestBody(draft: RequestDraft): SerializedRequestBody {
  if (isMultipart(draft.contentType)) {
    const formData = new FormData()

    for (const filePart of draft.bodyFiles) {
      if (!filePart.file) {
        throw new Error(`Select "${filePart.name}" again before sending`)
      }
      formData.append(filePart.fieldName.trim() || 'file', filePart.file, filePart.name)
    }

    return { body: formData, contentType: undefined }
  }

  if (isBinary(draft.contentType)) {
    const filePart = draft.bodyFiles[0]
    if (!filePart?.file) {
      throw new Error('Select a file before sending a binary request')
    }
    return {
      body: filePart.file,
      contentType: draft.contentType || 'application/octet-stream',
    }
  }

  if (!draft.body) {
    return { body: undefined, contentType: undefined }
  }

  return {
    body: draft.body,
    contentType: draft.contentType || undefined,
  }
}
