export const clamp=(value,min,max)=>Number.isFinite(Number(value))?Math.max(min,Math.min(max,Number(value))):min
export const snap=(value,size=12)=>Math.round(value/size)*size

export function objectBounds(item){return{x:Number(item.x)||0,y:Number(item.y)||0,width:Math.max(1,Number(item.width)||1),height:Math.max(1,Number(item.height)||1)}}

export function boundsFor(items,padding=60){
  if(!items.length)return null
  const boxes=items.map(objectBounds),minX=Math.min(...boxes.map(b=>b.x))-padding,minY=Math.min(...boxes.map(b=>b.y))-padding,maxX=Math.max(...boxes.map(b=>b.x+b.width))+padding,maxY=Math.max(...boxes.map(b=>b.y+b.height))+padding
  return{x:minX,y:minY,width:maxX-minX,height:maxY-minY}
}

export function pathThrough(points){
  if(points.length<2)return''
  return points.reduce((path,point,index)=>index?`${path} L${point.x},${point.y}`:`M${point.x},${point.y}`,'')
}

export function viewportForBounds(bounds,width,height,scale=.88){
  if(!bounds)return null
  if(width&&typeof width==='object'){scale=Number(height)>2?.9:Number(height)||.88;height=width.height;width=width.width}
  const safeWidth=Math.max(1,Number(width)||1),safeHeight=Math.max(1,Number(height)||1)
  const safeBounds={x:Number.isFinite(Number(bounds.x))?Number(bounds.x):0,y:Number.isFinite(Number(bounds.y))?Number(bounds.y):0,width:Math.max(1,Number(bounds.width)||1),height:Math.max(1,Number(bounds.height)||1)}
  const zoom=clamp(Math.min(safeWidth/safeBounds.width,safeHeight/safeBounds.height)*Number(scale||.88),.2,1.8)
  return{zoom,pan:{x:safeWidth/2-(safeBounds.x+safeBounds.width/2)*zoom,y:safeHeight/2-(safeBounds.y+safeBounds.height/2)*zoom}}
}
