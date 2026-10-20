import test from 'node:test'
import assert from 'node:assert/strict'
import { flattenAIStructure, validateAIStructure } from '../src/lib/aiStructureSchema.js'

test('validates and normalizes mind map and hierarchy data without mutating input', () => {
  const input = { mode: 'hierarchy', root: '  Company  ', children: [{ name: ' Operations ', children: [{ name: 'Team A' }] }] }
  const before = structuredClone(input)
  const normalized = validateAIStructure(input)
  assert.equal(normalized.root, 'Company')
  assert.equal(normalized.children[0].name, 'Operations')
  assert.equal(normalized.nodeCount, 3)
  assert.deepEqual(input, before)
})

test('rejects malformed or unsafe output', () => {
  assert.throws(() => validateAIStructure(null), /object/)
  assert.throws(() => validateAIStructure({ mode: 'unknown', root: 'X', children: [] }), /mode/)
  assert.throws(() => validateAIStructure({ mode: 'mindmap', root: ' ', children: [] }), /root/)
  assert.throws(() => validateAIStructure({ mode: 'mindmap', root: 'X', children: [{ name: '' }] }), /non-empty/)
  assert.throws(() => validateAIStructure({ mode: 'mindmap', root: 'X', children: [{ name: 'Child' }] }, { maxNodes: 1, maxDepth: 8, maxLabelLength: 180 }), /maximum node count/)
})

test('flattens hierarchy into deterministic parent-linked records', () => {
  const flat = flattenAIStructure({ mode: 'hierarchy', root: 'Root', children: [{ name: 'A', children: [{ name: 'A1' }] }, { name: 'B' }] })
  assert.deepEqual(flat.records, [
    { index: 0, parentIndex: null, name: 'Root', depth: 0 },
    { index: 1, parentIndex: 0, name: 'A', depth: 1 },
    { index: 2, parentIndex: 1, name: 'A1', depth: 2 },
    { index: 3, parentIndex: 0, name: 'B', depth: 1 },
  ])
})
