/** Provider-neutral schema and validation for AI-generated Universe Mapper structures.
 * This module is intentionally pure: it does not touch canvas state, storage, or APIs.
 */
export const AI_STRUCTURE_SCHEMA_VERSION = 1
export const AI_STRUCTURE_LIMITS = Object.freeze({ maxNodes: 120, maxDepth: 8, maxLabelLength: 180 })

const cleanLabel = value => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''

/**
 * Expected input shape:
 * { schemaVersion: 1, mode: 'mindmap'|'hierarchy', root: string,
 *   children: [{ name: string, children?: [{ name: string, children?: [...] }] }] }
 * Returns a normalized copy or throws a readable validation error.
 */
export function validateAIStructure(input, limits = AI_STRUCTURE_LIMITS) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('AI output must be an object.')
  const mode = input.mode
  if (mode !== 'mindmap' && mode !== 'hierarchy') throw new Error('Unsupported AI structure mode.')
  const root = cleanLabel(input.root)
  if (!root) throw new Error('The root node label is required.')
  if (root.length > limits.maxLabelLength) throw new Error('A node label is too long.')
  if (!Array.isArray(input.children)) throw new Error('The children field must be an array.')

  let nodeCount = 1
  const walk = (items, depth) => {
    if (depth > limits.maxDepth) throw new Error(`AI structure exceeds maximum depth (${limits.maxDepth}).`)
    return items.map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Each child must be an object.')
      const name = cleanLabel(item.name)
      if (!name) throw new Error('Every node must have a non-empty name.')
      if (name.length > limits.maxLabelLength) throw new Error('A node label is too long.')
      nodeCount += 1
      if (nodeCount > limits.maxNodes) throw new Error(`AI structure exceeds maximum node count (${limits.maxNodes}).`)
      if (item.children !== undefined && !Array.isArray(item.children)) throw new Error('Nested children must be an array.')
      return { name, children: walk(item.children || [], depth + 1) }
    })
  }
  const children = walk(input.children, 1)
  return { schemaVersion: AI_STRUCTURE_SCHEMA_VERSION, mode, root, children, nodeCount }
}

/** Convert validated tree data into flat parent-linked records for a canvas adapter. */
export function flattenAIStructure(input, options = {}) {
  const tree = validateAIStructure(input, options.limits || AI_STRUCTURE_LIMITS)
  const records = []
  let index = 0
  // Walk directly from the validated tree; preserve order and parent indices.
  const walk = (name, children, parentIndex, depth) => {
    const currentIndex = index++
    records.push({ index: currentIndex, parentIndex, name, depth })
    for (const child of children) walk(child.name, child.children, currentIndex, depth + 1)
  }
  walk(tree.root, tree.children, null, 0)
  return { schemaVersion: tree.schemaVersion, mode: tree.mode, records }
}

