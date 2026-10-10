import { normalizeData } from './store.js'

const FORMAT='universe-mapper/mf'
const VERSION=1
const encoder=new TextEncoder()

async function compress(bytes){
  if(!globalThis.CompressionStream)return bytes
  const stream=new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function decompress(bytes){
  const gzip=bytes[0]===0x1f&&bytes[1]===0x8b
  if(!gzip)return bytes
  if(!globalThis.DecompressionStream)throw new Error('This browser cannot open compressed .mf files.')
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

export async function createMapperFile(data){
  const normalized=normalizeData(data)
  const payload={manifest:{format:FORMAT,formatVersion:VERSION,appVersion:normalized.appVersion||'2.0.0',createdAt:new Date().toISOString(),projectId:normalized.universe.id,projectName:normalized.universe.name},universe:normalized}
  return new Blob([await compress(encoder.encode(JSON.stringify(payload)))],{type:'application/vnd.universe-mapper.project'})
}

export async function readMapperFile(file){
  const bytes=await decompress(new Uint8Array(await file.arrayBuffer()))
  let parsed
  try{parsed=JSON.parse(new TextDecoder().decode(bytes))}catch{throw new Error('The selected file is not a valid Mapper File.')}
  if(parsed?.manifest?.format!==FORMAT)throw new Error('Unsupported .mf project format.')
  if(Number(parsed.manifest.formatVersion)>VERSION)throw new Error('This .mf file was created by a newer Universe Mapper version.')
  return normalizeData(parsed.universe)
}

export function isMapperFile(file){return file?.name?.toLowerCase().endsWith('.mf')||file?.type==='application/vnd.universe-mapper.project'}
