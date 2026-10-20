import { validateAIStructure } from './aiStructureSchema.js'

/** Calls the same-origin Netlify function; credentials and provider keys stay server-side. */
export async function generateFreeAIStructure({ prompt, mode, user, signal } = {}) {
  const cleanPrompt = String(prompt || '').trim()
  if (!cleanPrompt) throw new Error('Tulis instruksi terlebih dahulu.')
  if (cleanPrompt.length > 5000) throw new Error('Instruksi terlalu panjang. Maksimal 5.000 karakter.')
  if (mode !== 'mindmap' && mode !== 'hierarchy') throw new Error('Pilih Mind Map atau Hierarchy.')
  if (!user || user.demo || typeof user.getIdToken !== 'function') {
    throw new Error('Free AI memerlukan akun online yang sudah masuk dan terverifikasi. Demo lokal tetap tersedia tanpa AI online.')
  }

  const idToken = await user.getIdToken()
  const response = await fetch('/.netlify/functions/ai-structure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ prompt: cleanPrompt, mode }),
    signal,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload?.error || `Free AI tidak tersedia (HTTP ${response.status}).`)
  return validateAIStructure(payload?.structure)
}
