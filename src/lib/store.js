import { sampleData } from '../data/sampleData.js'

const KEY = 'universe-mapper-v1'
export const clone = value => JSON.parse(JSON.stringify(value))
export const createId = prefix => `${prefix}-${globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`
export function storageGet(key) {try{return localStorage.getItem(key)}catch{return null}}
export function storageSet(key,value){try{localStorage.setItem(key,value);return true}catch{return false}}

export function normalizeData(input) {
  if (!input || typeof input !== 'object') throw new Error('Invalid Universe file')
  const rawNodes=Array.isArray(input.nodes)?input.nodes:[]
  const legacyRels=Array.isArray(input.rels)?input.rels:[]
  const structures=Array.isArray(input.structures)&&input.structures.length?input.structures.map((s,i)=>({id:String(s.id||`structure-${i}`),name:String(s.name||`Structure ${i+1}`),description:String(s.description||''),color:s.color||null})):[{id:'default',name:'Main Structure',description:'',color:null}]
  const contains=[...(input.relationships||[]),...legacyRels].filter(r=>r.type==='contains')
  const nodes=rawNodes.map((n,i)=>({
    id:String(n.id||createId('node')),structureId:String(n.structureId||n.structure_id||structures[0].id),
    parentId:n.parentId??n.parent_id??contains.find(r=>(r.targetId||r.target)===n.id)?.sourceId??contains.find(r=>(r.targetId||r.target)===n.id)?.source??null,
    name:String(n.name||`Untitled ${i+1}`),type:String(n.type||'category'),value:n.value??'',status:String(n.status||'draft'),
    x:Number.isFinite(Number(n.x))?Number(n.x):120+(i%4)*250,y:Number.isFinite(Number(n.y))?Number(n.y):100+Math.floor(i/4)*130,width:Math.max(72,Number(n.width)|| (n.type==='circle'?104:184)),height:Math.max(48,Number(n.height)|| (n.type==='circle'?104:64)),locked:Boolean(n.locked),
    fields:Array.isArray(n.fields)?n.fields.map((f,j)=>({id:String(f.id||createId('field')),name:String(f.name||f.k||`Field ${j+1}`),type:String(f.type||f.t||'text'),value:f.value??f.v??''})):[]
  }))
  const ids=new Set(nodes.map(n=>n.id)); const structureIds=new Set(structures.map(s=>s.id))
  nodes.forEach(n=>{if(!structureIds.has(n.structureId))n.structureId=structures[0].id;if(n.parentId&&!ids.has(n.parentId))n.parentId=null})
  // Break malformed hierarchy cycles so traversal can never lock the UI.
  nodes.forEach(node=>{const seen=new Set([node.id]);let current=node;while(current.parentId){if(seen.has(current.parentId)){node.parentId=null;break}seen.add(current.parentId);current=nodes.find(n=>n.id===current.parentId);if(!current)break}})
  const relationshipSource=Array.isArray(input.relationships)?input.relationships:legacyRels
  const relationships=relationshipSource.filter(r=>r.type!=='contains').map(r=>({id:String(r.id||createId('rel')),sourceId:String(r.sourceId||r.source||''),targetId:String(r.targetId||r.target||''),type:String(r.type||'influences'),weight:r.weight??1})).filter(r=>ids.has(r.sourceId)&&ids.has(r.targetId)&&r.sourceId!==r.targetId)
  const rawLayout=input.layout&&typeof input.layout==='object'?input.layout:{}
  const manualPositions=rawLayout.manualPositions&&typeof rawLayout.manualPositions==='object'?rawLayout.manualPositions:Object.fromEntries(nodes.map(n=>[n.id,{x:n.x,y:n.y}]))
  const formulas=(Array.isArray(input.formulas)?input.formulas:[]).map((f,i)=>({id:String(f.id||createId('formula')),name:String(f.name||f.label||`Formula ${i+1}`),nodeId:String(f.nodeId||f.targetNodeId||''),targetNodeId:String(f.targetNodeId||f.nodeId||''),expression:String(f.expression||f.label||''),inputs:Array.isArray(f.inputs)?f.inputs:Array.isArray(f.operands)?f.operands:[],outputType:String(f.outputType||'number'),unit:String(f.unit||''),description:String(f.description||''),status:String(f.status||'valid')})).filter(f=>!f.nodeId||ids.has(f.nodeId))
  const scenarios=(Array.isArray(input.scenarios)?input.scenarios:[]).map((s,i)=>({id:String(s.id||createId('scenario')),name:String(s.name||`Scenario ${i+1}`),overrides:s.overrides&&typeof s.overrides==='object'?s.overrides:{},createdAt:String(s.createdAt||new Date().toISOString())}))
  return {universe:{id:String(input.universe?.id||createId('universe')),name:String(input.universe?.name||input.name||'Untitled Universe'),description:String(input.universe?.description||input.description||'')},structures,nodes,relationships,formulas,scenarios,savedViews:Array.isArray(input.savedViews)?input.savedViews:[],layout:{preset:String(rawLayout.preset||'manual'),direction:String(rawLayout.direction||'tb'),scope:String(rawLayout.scope||'universe'),manualPositions}}
}

export function loadData() {
  try { const stored=storageGet(KEY); return stored?normalizeData(JSON.parse(stored)):normalizeData(clone(sampleData)) } catch { return normalizeData(clone(sampleData)) }
}

export function saveData(data) { return storageSet(KEY, JSON.stringify(data)) }
export function loadProjectData(projectId) {
  try { const stored=storageGet(`um-project-data-${projectId}`); return stored?normalizeData(JSON.parse(stored)):loadData() } catch { return loadData() }
}
export function saveProjectData(projectId,data) { return projectId?storageSet(`um-project-data-${projectId}`,JSON.stringify(data)):false }
export function resetData() { try{localStorage.removeItem(KEY)}catch{/* storage may be blocked */} return clone(sampleData) }

export function pathFor(data, nodeId) {
  const names = []
  let current = data.nodes.find(node => node.id === nodeId)
  const seen=new Set()
  while (current && !seen.has(current.id)) { seen.add(current.id);names.unshift(current.name); current = data.nodes.find(node => node.id === current.parentId) }
  const structure = data.structures.find(item => item.id === data.nodes.find(node => node.id === nodeId)?.structureId)
  return [structure?.name, ...names].filter(Boolean).join(' / ')
}

export function descendants(data, nodeId) {
  const result = new Set([nodeId])
  let changed = true
  while (changed) {
    changed = false
    data.nodes.forEach(node => { if (node.parentId && result.has(node.parentId) && !result.has(node.id)) { result.add(node.id); changed = true } })
  }
  return result
}
