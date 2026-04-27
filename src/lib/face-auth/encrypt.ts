import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const hex = process.env.FACE_ENCRYPTION_KEY
  if (!hex || hex.startsWith('generate_')) {
    throw new Error('FACE_ENCRYPTION_KEY is not configured')
  }
  return Buffer.from(hex, 'hex')
}

export function encryptDescriptor(descriptor: number[]): Buffer {
  const key = getKey()
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, key, iv)

  const json = JSON.stringify(descriptor)
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  // Format: [iv 16 bytes][authTag 16 bytes][encrypted data]
  return Buffer.concat([iv, authTag, encrypted])
}

export function decryptDescriptor(data: Buffer): number[] {
  const key = getKey()

  const iv = data.subarray(0, 16)
  const authTag = data.subarray(16, 32)
  const encrypted = data.subarray(32)

  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return JSON.parse(decrypted.toString('utf8'))
}
