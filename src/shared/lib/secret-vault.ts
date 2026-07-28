/**
 * DEV-ONLY secret vault: AES-GCM with a fixed app key in localStorage.
 * Not OS Keychain — placeholder until Tauri/Keychain (F20).
 */

const VAULT_KEY_ID = 'restly.vault.aeskey.v1'

async function getAesKey(): Promise<CryptoKey> {
  const existing = localStorage.getItem(VAULT_KEY_ID)
  if (existing) {
    const raw = Uint8Array.from(atob(existing), (c) => c.charCodeAt(0))
    return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt'])
  }
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ])
  const raw = await crypto.subtle.exportKey('raw', key)
  localStorage.setItem(VAULT_KEY_ID, btoa(String.fromCharCode(...new Uint8Array(raw))))
  return key
}

function toB64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

function fromB64(s: string): ArrayBuffer {
  const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

export async function encryptSecret(plain: string): Promise<string> {
  if (!plain) return plain
  if (typeof crypto === 'undefined' || !crypto.subtle) return plain
  const key = await getAesKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plain),
  )
  return `enc:v1:${toB64(iv.buffer)}:${toB64(cipher)}`
}

export async function decryptSecret(value: string): Promise<string> {
  if (!value.startsWith('enc:v1:')) return value
  if (typeof crypto === 'undefined' || !crypto.subtle) return value
  try {
    const [, , ivB64, dataB64] = value.split(':')
    if (!ivB64 || !dataB64) return value
    const key = await getAesKey()
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromB64(ivB64) },
      key,
      fromB64(dataB64),
    )
    return new TextDecoder().decode(plain)
  } catch {
    return value
  }
}
