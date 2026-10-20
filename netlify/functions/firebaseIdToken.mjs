import { createPublicKey, createVerify } from 'node:crypto'

const CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
let cachedCerts = null
let certsExpiry = 0

async function getCerts() {
  if (cachedCerts && Date.now() < certsExpiry) return cachedCerts
  const response = await fetch(CERTS_URL)
  if (!response.ok) throw new Error('Firebase public certificates unavailable')
  cachedCerts = await response.json()
  const cacheControl = response.headers.get('cache-control') || ''
  const maxAge = Number(cacheControl.match(/max-age=(\d+)/i)?.[1] || 300)
  certsExpiry = Date.now() + Math.min(maxAge, 3600) * 1000
  return cachedCerts
}

export async function verifyFirebaseIdToken(token, projectId) {
  if (!token || !projectId) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  let header, claims
  try {
    header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'))
    claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
  } catch { return null }
  if (header.alg !== 'RS256' || typeof header.kid !== 'string') return null
  const now = Math.floor(Date.now() / 1000)
  if (claims.iss !== `https://securetoken.google.com/${projectId}` || claims.aud !== projectId ||
      typeof claims.sub !== 'string' || !claims.sub || claims.sub.length > 128 ||
      !Number.isFinite(claims.exp) || claims.exp <= now || !Number.isFinite(claims.iat) || claims.iat > now + 60 ||
      !Number.isFinite(claims.auth_time) || claims.auth_time > now + 60) return null
  if (claims.email_verified !== true) return null
  const certs = await getCerts()
  const cert = certs[header.kid]
  if (!cert) { cachedCerts = null; certsExpiry = 0; return null }
  try {
    const verifier = createVerify('RSA-SHA256')
    verifier.update(`${parts[0]}.${parts[1]}`)
    verifier.end()
    if (!verifier.verify(createPublicKey(cert), Buffer.from(parts[2], 'base64url'))) return null
  } catch { return null }
  return { uid: claims.sub, email: claims.email, claims }
}
