import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for(const name of ['vendor/three-vendor.js','registro-3d.js','registro-app.js','registro-controles.js']) new vm.Script(fs.readFileSync(path.join(root,name),'utf8'),{filename:name});
const entry=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of entry.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) if(!fs.existsSync(path.join(root,match[1])))throw Error('Falta '+match[1]);
if(!fs.existsSync(path.join(root,'logo-minecad.png')))throw Error('Falta el logo');
new vm.Script(fs.readFileSync(path.join(root,'integraciones/minecad-tema.user.js'),'utf8'));
const wrapper=fs.readFileSync(path.join(root,'integraciones/panel-externo.html'),'utf8');
for(const m of wrapper.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/MANIFIESTO.json'),'utf8'));
for(const file of manifest.files){const bytes=fs.readFileSync(path.join(root,file.path));if(bytes.length!==file.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==file.sha256)throw Error('No coincide: '+file.path);}
if(fs.existsSync(path.join(root,'autocad')))throw Error('La aplicación web no debe incluir carpeta autocad');
console.log('Aplicación web: sintaxis, rutas e integridad correctas.');
