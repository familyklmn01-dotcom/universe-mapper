/** Pure entitlement helpers shared by the trusted admin CLI and tests. */
export function normalizeAiTier(value) {
  if (value !== 'paid' && value !== 'free') {
    throw new Error('Tier harus "paid" atau "free".')
  }
  return value
}

/** Preserve unrelated custom claims; free means removing only the aiTier claim. */
export function buildNextCustomClaims(existingClaims, tier) {
  const normalizedTier = normalizeAiTier(tier)
  const next = { ...(existingClaims && typeof existingClaims === 'object' ? existingClaims : {}) }
  if (normalizedTier === 'paid') next.aiTier = 'paid'
  else delete next.aiTier
  return next
}
