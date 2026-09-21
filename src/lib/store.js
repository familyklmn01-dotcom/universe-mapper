import { sampleData } from '../data/sampleData.js'

const KEY = 'universe-mapper-v1'
export const clone = value => JSON.parse(JSON.stringify(value))
export const createId = prefix => `${prefix}-${globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`
const normalizeLink = value => {
  const link = value && typeof value === 'object' ? value : {}
  const type = ['none','url','view'].includes(String(link.type)) ? String(link.type) : (link.url ? 'url' : link.viewId ? 'view' : 'none')
  return { type, url: String(link.url || ''), viewId: link.viewId ? String(link.viewId) : '' }
}
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
    name:String(n.name||`Untitled ${i+1}`),type:String(n.type||'category'),value:n.value??'',status:String(n.status||'draft'),zIndex:Number.isFinite(Number(n.zIndex))?Number(n.zIndex):i,
    x:Number.isFinite(Number(n.x))?Number(n.x):120+(i%4)*250,y:Number.isFinite(Number(n.y))?Number(n.y):100+Math.floor(i/4)*130,width:Math.max(72,Number(n.width)|| (n.type==='circle'?104:184)),height:Math.max(48,Number(n.height)|| (n.type==='circle'?104:64)),locked:Boolean(n.locked),
    fields:Array.isArray(n.fields)?n.fields.map((f,j)=>({id:String(f.id||createId('field')),name:String(f.name||f.k||`Field ${j+1}`),type:String(f.type||f.t||'text'),value:f.value??f.v??''})):[],link:normalizeLink(n.link||n.hyperlink)
  }))
  const ids=new Set(nodes.map(n=>n.id)); const structureIds=new Set(structures.map(s=>s.id))
  nodes.forEach(n=>{if(!structureIds.has(n.structureId))n.structureId=structures[0].id;if(n.parentId&&!ids.has(n.parentId))n.parentId=null})
  // Break malformed hierarchy cycles so traversal can never lock the UI.
  nodes.forEach(node=>{const seen=new Set([node.id]);let current=node;while(current.parentId){if(seen.has(current.parentId)){node.parentId=null;break}seen.add(current.parentId);current=nodes.find(n=>n.id===current.parentId);if(!current)break}})
  const relationshipSource=Array.isArray(input.relationships)?input.relationships:legacyRels
  const relationships=relationshipSource.filter(r=>r.type!=='contains').map(r=>({id:String(r.id||createId('rel')),sourceId:String(r.sourceId||r.source||''),targetId:String(r.targetId||r.target||''),type:String(r.type||'influences'),weight:r.weight??1,manualRoute:Boolean(r.manualRoute),waypoints:Array.isArray(r.waypoints)?r.waypoints.map(point=>({x:Number(point.x)||0,y:Number(point.y)||0})):[],metadata:r.metadata&&typeof r.metadata==='object'?r.metadata:{}})).filter(r=>ids.has(r.sourceId)&&ids.has(r.targetId)&&r.sourceId!==r.targetId)
  const rawLayout=input.layout&&typeof input.layout==='object'?input.layout:{}
  const manualPositions=rawLayout.manualPositions&&typeof rawLayout.manualPositions==='object'?rawLayout.manualPositions:Object.fromEntries(nodes.map(n=>[n.id,{x:n.x,y:n.y}]))
  const formulas=(Array.isArray(input.formulas)?input.formulas:[]).map((f,i)=>({id:String(f.id||createId('formula')),name:String(f.name||f.label||`Formula ${i+1}`),nodeId:String(f.nodeId||f.targetNodeId||''),targetNodeId:String(f.targetNodeId||f.nodeId||''),expression:String(f.expression||f.label||''),inputs:Array.isArray(f.inputs)?f.inputs:Array.isArray(f.operands)?f.operands:[],outputType:String(f.outputType||'number'),unit:String(f.unit||''),description:String(f.description||''),status:String(f.status||'valid')})).filter(f=>!f.nodeId||ids.has(f.nodeId))
  const scenarios=(Array.isArray(input.scenarios)?input.scenarios:[]).map((s,i)=>({id:String(s.id||createId('scenario')),name:String(s.name||`Scenario ${i+1}`),overrides:s.overrides&&typeof s.overrides==='object'?s.overrides:{},createdAt:String(s.createdAt||new Date().toISOString())}))
  const annotationKinds=new Set(['text','shape','image','frame','button'])
  const annotations=(Array.isArray(input.annotations)?input.annotations:[]).map((a,i)=>{const kind=annotationKinds.has(a.kind)?a.kind:(a.kind==='text'?'text':'shape');const isText=kind==='text',isFrame=kind==='frame',isButton=kind==='button';return {id:String(a.id||createId('annotation')),kind,shape:String(a.shape||(isText||isFrame||isButton?'rectangle':'rounded')),text:String(a.text||''),assetId:a.assetId?String(a.assetId):null,src:a.src?String(a.src):'',x:Number(a.x)||120+i*20,y:Number(a.y)||120+i*20,width:Math.max(40,Number(a.width)||(isButton?160:180)),height:Math.max(30,Number(a.height)||(isButton?44:80)),rotation:Number(a.rotation)||0,zIndex:Number.isFinite(Number(a.zIndex))?Number(a.zIndex):nodes.length+i,fontFamily:String(a.fontFamily||'Inter'),fontSize:Math.max(8,Number(a.fontSize)||18),fontWeight:String(a.fontWeight||'600'),italic:Boolean(a.italic),underline:Boolean(a.underline),align:String(a.align||(isText?'left':'center')),verticalAlign:String(a.verticalAlign||(isText?'top':'middle')),color:String(a.color||(isText?'auto':isButton?'#172033':'#edf2ff')),fill:a.fill===undefined?(isText||isFrame?'auto':isButton?'#5574dc':'#263654'):String(a.fill),fillOpacity:Number.isFinite(Number(a.fillOpacity))?Number(a.fillOpacity):1,stroke:String(a.stroke||'#7897f5'),strokeWidth:Number.isFinite(Number(a.strokeWidth))?Math.max(0,Number(a.strokeWidth)):isText?0:2,strokeStyle:String(a.strokeStyle||'solid'),cornerRadius:Number.isFinite(Number(a.cornerRadius))?Math.max(0,Number(a.cornerRadius)):isFrame?0:10,autoFit:a.autoFit!==false,locked:Boolean(a.locked),visibility:String(a.visibility||'all'),sceneId:a.sceneId?String(a.sceneId):null,link:normalizeLink(a.link||a.hyperlink),maintainAspectRatio:a.maintainAspectRatio!==false,metadata:a.metadata&&typeof a.metadata==='object'?a.metadata:{}}})

  const assets=(Array.isArray(input.assets)?input.assets:[]).map((asset,i)=>({id:String(asset.id||createId('asset')),name:String(asset.name||`Asset ${i+1}`),mimeType:String(asset.mimeType||'application/octet-stream'),dataUrl:String(asset.dataUrl||asset.src||''),size:Math.max(0,Number(asset.size)||0),createdAt:String(asset.createdAt||new Date().toISOString()),metadata:asset.metadata&&typeof asset.metadata==='object'?asset.metadata:{}}))
  const presentations=(Array.isArray(input.presentations)?input.presentations:[]).map((p,i)=>({id:String(p.id||createId('presentation')),name:String(p.name||`Presentation ${i+1}`),description:String(p.description||''),defaultDuration:Math.max(1,Number(p.defaultDuration)||8),cameraSpeed:String(p.cameraSpeed||'normal'),createdAt:String(p.createdAt||new Date().toISOString()),updatedAt:String(p.updatedAt||new Date().toISOString()),scenes:(Array.isArray(p.scenes)?p.scenes:[]).map((s,j)=>({id:String(s.id||createId('scene')),name:String(s.name||`Scene ${j+1}`),order:Number.isFinite(Number(s.order))?Number(s.order):j+1,view:['graph','structure','root'].includes(s.view)?s.view:'graph',frameId:s.frameId?String(s.frameId):null,savedViewId:s.savedViewId?String(s.savedViewId):null,viewport:{panX:Number(s.viewport?.panX)||0,panY:Number(s.viewport?.panY)||0,zoom:Math.max(.1,Number(s.viewport?.zoom)||1)},captureBounds:s.captureBounds&&typeof s.captureBounds==='object'?{x:Number(s.captureBounds.x)||0,y:Number(s.captureBounds.y)||0,width:Math.max(1,Number(s.captureBounds.width)||1200),height:Math.max(1,Number(s.captureBounds.height)||700)}:null,focusedNodeIds:Array.isArray(s.focusedNodeIds)?s.focusedNodeIds.map(String):[],visibleRelationshipIds:Array.isArray(s.visibleRelationshipIds)?s.visibleRelationshipIds.map(String):[],annotationIds:Array.isArray(s.annotationIds)?s.annotationIds.map(String):[],layers:{structure:s.layers?.structure!==false,causal:s.layers?.causal!==false,formula:s.layers?.formula!==false,dependency:s.layers?.dependency!==false},theme:String(s.theme||'dark'),duration:Math.max(1,Number(s.duration)||Number(p.defaultDuration)||8),transition:String(s.transition||'zoom'),speakerNotes:String(s.speakerNotes||'')})).sort((a,b)=>a.order-b.order)}))
  const savedViews=(Array.isArray(input.savedViews)?input.savedViews:[]).map((saved,i)=>({id:String(saved.id||createId('view')),name:String(saved.name||`Saved View ${i+1}`),view:['graph','structure','root'].includes(saved.view)?saved.view:'graph',viewport:{panX:Number(saved.viewport?.panX)||0,panY:Number(saved.viewport?.panY)||0,zoom:Math.max(.1,Number(saved.viewport?.zoom)||1)},selectedIds:Array.isArray(saved.selectedIds)?saved.selectedIds.map(String).filter(id=>ids.has(id)):[],layers:saved.layers&&typeof saved.layers==='object'?saved.layers:{structure:true,causal:true,formula:true,dependency:true},theme:String(saved.theme||'dark'),createdAt:String(saved.createdAt||new Date().toISOString())}))
  return {schemaVersion:Math.max(2,Number(input.schemaVersion)||2),appVersion:String(input.appVersion||'2.0.0'),universe:{id:String(input.universe?.id||createId('universe')),name:String(input.universe?.name||input.name||'Untitled Universe'),description:String(input.universe?.description||input.description||'')},structures,nodes,relationships,formulas,scenarios,annotations,assets,presentations,savedViews,layout:{preset:String(rawLayout.preset||'manual'),direction:String(rawLayout.direction||'tb'),scope:String(rawLayout.scope||'universe'),manualPositions}}
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
