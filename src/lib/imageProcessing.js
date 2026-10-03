export async function removeNearWhiteBackground(dataUrl,threshold=242){
  const image=await loadImage(dataUrl)
  const canvas=document.createElement('canvas')
  canvas.width=image.naturalWidth||image.width
  canvas.height=image.naturalHeight||image.height
  const context=canvas.getContext('2d',{willReadFrequently:true})
  context.drawImage(image,0,0)
  const pixels=context.getImageData(0,0,canvas.width,canvas.height)
  for(let index=0;index<pixels.data.length;index+=4){
    const red=pixels.data[index],green=pixels.data[index+1],blue=pixels.data[index+2]
    const lowest=Math.min(red,green,blue),spread=Math.max(red,green,blue)-lowest
    if(lowest>=threshold&&spread<18)pixels.data[index+3]=0
  }
  context.putImageData(pixels,0,0)
  return canvas.toDataURL('image/png')
}

function loadImage(source){
  return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Image could not be processed.'));image.src=source})
}
