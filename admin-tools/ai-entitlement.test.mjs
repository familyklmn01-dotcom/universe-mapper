import test from 'node:test'
import assert from 'node:assert/strict'
import { buildNextCustomClaims, normalizeAiTier } from './ai-entitlement.mjs'

test('grant paid sets aiTier and preserves unrelated claims', () => {
  const input = { admin: true, featureFlags: ['x'], aiTier: 'free' }
  assert.deepEqual(buildNextCustomClaims(input, 'paid'), { admin: true, featureFlags: ['x'], aiTier: 'paid' })
  assert.deepEqual(input, { admin: true, featureFlags: ['x'], aiTier: 'free' })
})

test('free removes only aiTier and preserves unrelated claims', () => {
  assert.deepEqual(buildNextCustomClaims({ admin: true, aiTier: 'paid', region: 'id' }, 'free'), { admin: true, region: 'id' })
})

test('empty claims are supported', () => {
  assert.deepEqual(buildNextCustomClaims(null, 'paid'), { aiTier: 'paid' })
  assert.deepEqual(buildNextCustomClaims(undefined, 'free'), {})
})

test('invalid tiers are rejected', () => {
  assert.throws(() => normalizeAiTier('enterprise'), /Tier harus/)
  assert.throws(() => buildNextCustomClaims({}, 'PAID'), /Tier harus/)
})
