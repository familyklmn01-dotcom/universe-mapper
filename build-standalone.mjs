import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const dist=join(process.cwd(),'dist')
const source=await readFile(join(dist,'index.html'),'utf8')
const cssPath=source.match(/href="\.\/assets\/(.+?\.css)"/)?.[1]
const jsPath=source.match(/src="\.\/assets\/(.+?\.js)"/)?.[1]
if(!cssPath||!jsPath)throw new Error('Production assets were not found.')
const [css,js]=await Promise.all([readFile(join(dist,'assets',cssPath),'utf8'),readFile(join(dist,'assets',jsPath),'utf8')])
const standalone=source
  .replace(/<link rel="stylesheet"[^>]+>/,()=>`<style>${css}</style>`)
  .replace(/<script type="module"[^>]+><\/script>/,'')
  .replace('</body>',()=>`<script type="module">${js}</script>\n</body>`)
  .replace('<title>Universe Mapper</title>','<title>Universe Mapper — Final v1.7 Preview</title>')
await writeFile(join(process.cwd(),'Universe_Mapper_Final_v1_7_Preview.html'),standalone)
console.log('Created Universe_Mapper_Final_v1_7_Preview.html')
