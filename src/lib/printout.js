export function getMotherNodes(data) {
  return data.nodes.filter(node => !node.parentId)
}

export function getPrintoutNodeIds(data, motherIds) {
  const selected = new Set(motherIds)
  let changed = true
  while (changed) {
    changed = false
    for (const node of data.nodes) {
      if (node.parentId && selected.has(node.parentId) && !selected.has(node.id)) {
        selected.add(node.id)
        changed = true
      }
    }
  }
  return selected
}

export function buildPrintoutTree(data, structureId, allowedIds = new Set(data.nodes.map(node => node.id))) {
  const nodes = data.nodes.filter(node => node.structureId === structureId && allowedIds.has(node.id))
  const byParent = new Map()
  nodes.forEach(node => {
    const key = node.parentId && allowedIds.has(node.parentId) ? node.parentId : null
    if (!byParent.has(key)) byParent.set(key, [])
    byParent.get(key).push(node)
  })
  const build = (node, depth) => {
    const children = (byParent.get(node.id) || []).map((child, index, list) => ({
      ...build(child, depth + 1),
      isLast: index === list.length - 1
    }))
    return { id: node.id, name: node.name, type: node.type, description: node.description || '', depth, children, isLast: false }
  }
  return (byParent.get(null) || []).map((root, index, list) => ({ ...build(root, 0), isLast: index === list.length - 1 }))
}
