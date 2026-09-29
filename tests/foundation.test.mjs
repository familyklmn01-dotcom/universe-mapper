import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeData } from '../src/lib/store.js'
import { createMapperFile, readMapperFile } from '../src/lib/projectFormat.js'
import { pathThrough, snap, viewportForBounds } from '../src/lib/canvasGeometry.js'
import { buildPrintoutTree, getMotherNodes, getPrintoutNodeIds } from '../src/lib/printout.js'

const project={
  universe:{id:'u1',name:'Test'},
  structures:[{id:'s1',name:'Main'}],
  nodes:[{id:'a',structureId:'s1',name:'A',description:'Mother A',x:10,y:20},{id:'b',structureId:'s1',parentId:'a',name:'B',description:'Child B',x:220,y:20},{id:'c',structureId:'s1',name:'C',x:450,y:20}],
  relationships:[{id:'r1',sourceId:'a',targetId:'b',type:'influences',manualRoute:true,waypoints:[{x:140,y:80}]}],
  annotations:[{id:'frame-1',kind:'frame',x:0,y:0,width:500,height:300}],
  savedViews:[{id:'v1',name:'Overview',viewport:{panX:2,panY:3,zoom:.8}}]
}

test('normalizer preserves canonical routing, frames, and views',()=>{
  const data=normalizeData(project)
  assert.equal(data.relationships[0].waypoints[0].x,140)
  assert.equal(data.relationships[0].strokeStyle,'dashed')
  assert.equal(data.nodes[0].description,'Mother A')
  assert.equal(data.annotations[0].kind,'frame')
  assert.equal(data.savedViews[0].name,'Overview')
})

test('Mapper File round-trips normalized project data',async()=>{
  const blob=await createMapperFile(project)
  const file={name:'test.mf',arrayBuffer:()=>blob.arrayBuffer()}
  const restored=await readMapperFile(file)
  assert.equal(restored.universe.name,'Test')
  assert.equal(restored.nodes.length,3)
  assert.equal(restored.relationships[0].manualRoute,true)
})

test('canvas geometry is deterministic',()=>{
  assert.equal(snap(19,12),24)
  assert.equal(pathThrough([{x:0,y:0},{x:10,y:12}]),'M0,0 L10,12')
  assert.deepEqual(viewportForBounds({x:0,y:0,width:100,height:50},200,100,1),{zoom:1.8,pan:{x:10,y:5}})
})

test('printout mother filter includes only selected mothers and descendants',()=>{
  const data=normalizeData(project)
  const mothers=getMotherNodes(data)
  assert.deepEqual(mothers.map(node=>node.id),['a','c'])
  const ids=getPrintoutNodeIds(data,['a'])
  assert.equal(ids.has('a'),true)
  assert.equal(ids.has('b'),true)
  assert.equal(ids.has('c'),false)
  const tree=buildPrintoutTree(data,'s1',ids)
  assert.equal(tree.length,1)
  assert.equal(tree[0].children[0].name,'B')
})
