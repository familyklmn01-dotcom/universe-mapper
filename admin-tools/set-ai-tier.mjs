#!/usr/bin/env node
import { buildNextCustomClaims, normalizeAiTier } from './ai-entitlement.mjs'

function parseArgs(argv) {
  const positional = []
  let apply = false
  for (const arg of argv) {
    if (arg === '--apply') apply = true
    else if (arg.startsWith('--')) throw new Error(`Argumen tidak dikenal: ${arg}`)
    else positional.push(arg)
  }
  if (positional.length !== 2) {
    throw new Error('Pemakaian: node set-ai-tier.mjs <FIREBASE_UID> <paid|free> [--apply]')
  }
  const [uid, tier] = positional
  if (!uid || uid.length > 128 || /\s/.test(uid)) throw new Error('Firebase UID tidak valid.')
  return { uid, tier: normalizeAiTier(tier), apply }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const projectId = process.env.FIREBASE_PROJECT_ID
  if (!projectId) throw new Error('Set FIREBASE_PROJECT_ID ke project Firebase yang benar.')

  // Firebase Admin SDK is installed only in this isolated admin-tools directory.
  const [{ initializeApp, applicationDefault, getApps }, { getAuth }] = await Promise.all([
    import('firebase-admin/app'), import('firebase-admin/auth'),
  ])
  const app = getApps()[0] || initializeApp({ credential: applicationDefault(), projectId })
  const auth = getAuth(app)
  const user = await auth.getUser(args.uid)
  const nextClaims = buildNextCustomClaims(user.customClaims, args.tier)

  console.log(`Project: ${projectId}`)
  console.log(`UID: ${user.uid}`)
  console.log(`Email: ${user.email || '(tidak tersedia)'}`)
  console.log(`Email verified: ${Boolean(user.emailVerified)}`)
  console.log(`Action: ${args.tier === 'paid' ? 'grant Paid AI' : 'remove Paid AI entitlement'}`)
  console.log(`Existing claims: ${JSON.stringify(user.customClaims || {})}`)
  console.log(`Next claims: ${JSON.stringify(nextClaims)}`)

  if (!args.apply) {
    console.log('\nDRY RUN: tidak ada perubahan. Tambahkan --apply untuk menerapkan perubahan.')
    return
  }
  if (args.tier === 'paid' && !user.emailVerified) {
    throw new Error('Ditolak: verifikasi email akun terlebih dahulu sebelum memberi Paid AI.')
  }
  await auth.setCustomUserClaims(user.uid, nextClaims)
  console.log('\nBerhasil memperbarui custom claims. Pengguna perlu refresh ID token atau login ulang.')
}

main().catch((error) => {
  console.error(`Gagal: ${error?.message || String(error)}`)
  process.exitCode = 1
})
