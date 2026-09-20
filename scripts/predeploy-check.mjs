import fs from 'node:fs';
const jsonFiles=fs.readdirSync('.').filter(f=>/^hotels.*\.json$/.test(f));
let hotels=[];
for(const file of jsonFiles){const j=JSON.parse(fs.readFileSync(file,'utf8'));for(const h of j.hotels||[])hotels.push({...h,__file:file})}
const aliases=[['solva-resort-medical-spa','solva'],['chervona-ruta-shayan','chervona-ruta'],['taor-karpaty','taor'],['vedmezha-gora-yaremche','vedmezha-gora']];
const ids=new Map();for(const h of hotels){const a=ids.get(h.id)||[];a.push(h.__file);ids.set(h.id,a)}
let bad=false;
for(const [canonical,legacy] of aliases){if(ids.has(canonical)&&ids.has(legacy)){console.error('DUPLICATE_PHYSICAL_PROPERTY',canonical,legacy);bad=true}}
for(const [id,files] of ids){if(files.length>1)console.log('MULTI_SOURCE_ID',id,files.join(','))}
for(const file of ['app.js','app-entry.js','app-20260914.js','pearls-bootstrap.js','goral-bootstrap.js','vedmezha-bootstrap.js','fb-spa-bootstrap.js','romantik-bootstrap.js','mirotel-bootstrap.js']){if(!fs.existsSync(file)){console.error('MISSING_RUNTIME_FILE',file);bad=true}}
if(bad)process.exit(1);console.log('PREDEPLOY_OK',jsonFiles.length,'hotel JSON files checked');
