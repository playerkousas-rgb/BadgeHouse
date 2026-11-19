import test from 'node:test';
import assert from 'node:assert/strict';
import {decodeBackup,encodeBackup,itemType,validItem,clearBorderBackground} from '../public/storage-v0.7.1.js';
import {filterHouses,escapeHTML} from '../public/catalog-v0.7.1.js';
const badge={id:'a1',name:'營章',place:'香港',story:'Test',year:'2024',noTrade:true,image:''};
const backup=(items,version=1)=>JSON.stringify({format:'badgehouse-backup',version,items});
test('backup round trip preserves item data and excludes unknown fields',()=>assert.deepEqual(decodeBackup(backup([{...badge,secret:'not imported'}])),[badge]));
test('backup fails closed on unsupported versions, dupes, and active image formats',()=>{
 for(const value of [backup([badge],2),backup([badge,badge]),backup([{...badge,image:'data:image/svg+xml;base64,AAAA'}]),backup([{...badge,year:'now'}]),'[]'])assert.throws(()=>decodeBackup(value));
 assert.equal(validItem({...badge,name:'  '}),false);
});
test('non-AI crop removes connected solid background without removing disconnected same-colour areas',()=>{
 const w=7,h=7,p=new Uint8ClampedArray(w*h*4).fill(255);
 for(let y=2;y<=4;y++)for(let x=2;x<=4;x++)if(x!==3||y!==3)p[(y*w+x)*4]=0;
 assert.deepEqual(clearBorderBackground(p,w,h),{x:2,y:2,w:3,h:3});assert.equal(p[3],0);assert.equal(p[(3*w+3)*4+3],255);
});
test('non-uniform corner colours leave image unchanged',()=>{const p=new Uint8ClampedArray(4*4*4).fill(255);p[0]=0;assert.equal(clearBorderBackground(p,4,4),null);assert.equal(p[3],255);});
test('regional filtering and rendering imported strings as text',()=>{assert.equal(filterHouses('all').length,6);assert.equal(filterHouses('asia').length,2);assert.equal(filterHouses('americas')[0].id,'canada');assert.equal(escapeHTML(`<b>&"'`),'&lt;b&gt;&amp;&quot;&#39;');});

test('design input is constrained to supported art options',async()=>{
 const {loadDesign,defaultDesign}=await import('../public/world-v0.7.1.js');
 assert.deepEqual(loadDesign('{invalid'),defaultDesign);
 assert.deepEqual(loadDesign(JSON.stringify({name:'  Camp House  ',paint:'__proto__',roof:'flat',furniture:'wall'})),{...defaultDesign,name:'Camp House',roof:'flat',furniture:'wall'});
});
test('walking follows a bounded path and arrives at the exact destination',async()=>{
 const {mapStop,trail,trailPoint}=await import('../public/world-v0.7.1.js'); const a=mapStop('start'),b=mapStop('canada'),s=trail(a,b);
 assert.deepEqual(trailPoint(s,0),a);assert.deepEqual(trailPoint(s,1),b);
 assert.notDeepEqual(trailPoint(s,.5),a);
});

test('3D globe positioning matches the equator texture and journey terminates on the sphere',async()=>{
 const {toVector,locationVector,arcPoint}=await import('../public/scene3d-v0.7.1.js');
 const greenwich=toVector(0,0),a=locationVector('start'),b=locationVector('canada');
 assert.deepEqual(greenwich.toArray().map(n=>n+0),[1,0,0]);
 assert(arcPoint(a,b,0).distanceTo(a)<1e-9);
 assert(arcPoint(a,b,1).distanceTo(b)<1e-9);
 assert(Math.abs(arcPoint(a,b,.5,2.1).length()-2.1)<1e-9);
});

test('Scoutworld snapshot is complete and counts report only actual demo houses',async()=>{
 const {regions,houses,countHouses,displayItems}=await import('../public/catalog-v0.7.1.js');
 const {existsSync}=await import('node:fs');
 assert.equal(regions.length,176);
 assert.equal(new Set(regions.map(r=>r.id)).size,176);
 assert.equal(regions.filter(r=>countHouses(r.id)===0).length,173);
 assert.equal(regions.reduce((total,r)=>total+countHouses(r.id),0),houses.length);
 assert(regions.every(r=>existsSync(new URL(`../public/static/flags-v1/${r.flag}.svg`,import.meta.url))));
 for(const kind of ['badge','scarf','woggle'])assert(displayItems(houses[0],kind).length);
 assert.deepEqual(displayItems(houses[0],'other'),[]);
});

test('Scout organization profiles keep association flags distinct from emblems and region flags', async()=>{
 const {regions,scoutSources}=await import('../public/catalog-v0.7.1.js');
 const links=regions.map(r=>[r,scoutSources(r)]);
 assert(links.every(([r,s])=>r.org && r.orgShort && /^https:\/\/www\.scout\.org\/where-we-work\/regions\/[a-z-]+\/countries$/.test(s.directory)));
 assert.deepEqual(links.filter(([,s])=>s.flag).map(([r])=>r.id).sort(),['canada','hong-kong','japan']);
 assert(links.every(([r,s])=>!s.flag||(s.flag.startsWith('https://')&&s.flagLabel&&s.flag!==s.emblem&&!s.flag.endsWith(`/${r.flag}.svg`))));
 assert(links.some(([,s])=>s.emblem&&!s.flag));
 assert(links.some(([,s])=>!s.emblem&&!s.flag));
 const hk=regions.find(r=>r.id==='hong-kong');
 assert.match(scoutSources(hk,'en').emblem,/\/en\/scouting\/emblem\.html$/);
});


test('legacy badge backups and typed collection backups preserve the right displays',()=>{
 assert.equal(itemType(decodeBackup(backup([badge]))[0]),'badge');
 const scarf={...badge,id:'s2',type:'scarf'},woggle={...badge,id:'w3',type:'woggle'};
 assert.deepEqual(decodeBackup(encodeBackup([badge,scarf,woggle])),[{...badge,type:'badge'},scarf,woggle]);
 assert.throws(()=>decodeBackup(backup([{...badge,type:'video'}],2)));
 assert.throws(()=>decodeBackup(backup([scarf],1)));
});

test('house design validates custom colours independently and preserves the host introduction',async()=>{
 const {loadDesign,houseColours,bodyLabels,roofLabels,paletteLabels,outsideScene,insideScene}=await import('../public/world-v0.7.1.js');
 const entry=loadDesign(JSON.stringify({intro:'  Hiking club\nHong Kong  ',body:'tower',paint:'violet',roof:'hip',colours:{roof:'#FFDDEE',wall:'url(fake)',trim:'#003377',bad:'#abcabc'}}));
 assert.equal(entry.intro,'Hiking club\nHong Kong');assert.equal(entry.body,'tower');assert.equal(entry.roof,'hip');
 assert.deepEqual(entry.colours,{roof:'#ffddee',trim:'#003377'});
 assert.deepEqual(houseColours(entry).slice(0,3),['#ffddee','#dbcaf0','#003377']);
 assert.equal(Object.keys(paletteLabels).length,12);
 const t=(zh,en)=>en;
 const variants=Object.keys(bodyLabels).flatMap(body=>Object.keys(roofLabels).map(roof=>outsideScene({...entry,body,roof},t)));
 assert.equal(new Set(variants).size,24);assert(variants.every(scene=>!scene.includes('undefined')));
 assert.match(insideScene(entry,t,[],true),/data-value="scarf"/);assert.match(insideScene(entry,t,[],true),/data-value="woggle"/);
});

test('public profile accepts only credential-free HTTPS links and warns on new or changed links',async()=>{
 const {socialURL,socialLinks,needsSocialConsent}=await import('../public/visit-v0.7.1.js');
 const {loadDesign}=await import('../public/world-v0.7.1.js');
 const entry=socialLinks({instagram:' https://www.instagram.com/scout/ ',facebook:'javascript:alert(1)',website:'https://www.example.com'});
 assert.deepEqual(entry,{instagram:'https://www.instagram.com/scout/',website:'https://www.example.com/'});
 for(const url of ['//www.example.com','http://www.example.com','https://me:secret@example.com','https://foo.example\\@evil.example','https://one.example/\nother','https://localhost','data:text/html,<svg>'])assert.equal(socialURL(url),'');
 assert.equal(needsSocialConsent({},entry),true);assert.equal(needsSocialConsent(entry,entry),false);
 assert.equal(needsSocialConsent(entry,{}),false);
 assert.equal(needsSocialConsent(entry,{...entry,website:'https://example.com/new'}),true);
 assert.deepEqual(loadDesign(JSON.stringify({social:{...entry,unknown:'https://example.com/'}})).social,entry);
});

test('local guestbook and bookmarks reject malformed rows and keep activity separate',async()=>{
 const {readVisits,readActivity,readBookmarks,maxVisits,visitAlias}=await import('../public/visit-v0.7.1.js');
 assert.deepEqual(readBookmarks('["x","japan","japan","local-house"]',['japan','local-house']),['japan','local-house']);
 assert.deepEqual(readActivity('{"returnedAt":200,"updatedAt":-1}'),{returnedAt:200,updatedAt:0});
 assert.deepEqual(readVisits('[{"alias":" Ada ","at":123},{"alias":"No","at":-1},null,{"at":124}]'),[{alias:'Ada',at:123},{alias:'',at:124}]);
 assert.equal(visitAlias('a'.repeat(100)).length,40);
 assert.equal(readVisits(JSON.stringify(Array.from({length:100},(_,i)=>({at:i+1})))).length,maxVisits);
});

test('Vercel first release builds the static output with the same security headers as Pages',async()=>{
 const {readFileSync}=await import('node:fs');
 const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
 const vercel=JSON.parse(read('vercel.json'));
 assert.equal(vercel.outputDirectory,'dist');assert.equal(vercel.buildCommand,'npm run build');
 const pages=read('public/static/_headers').split('\n');
 for(const {headers} of vercel.headers)for(const {key,value} of headers)assert(pages.includes(`  ${key}: ${value}`),`Mismatched ${key}`);
});

test('交通工具一律用飛機（用戶定案）', async () => {
  const {travelMode} = await import('../public/world-v0.7.1.js');
  assert.equal(travelMode('start', 'hong-kong'), 'plane');
  assert.equal(travelMode('hong-kong', 'japan'), 'plane');
  assert.equal(travelMode('start', 'japan'), 'plane');
  assert.equal(travelMode('japan', 'canada'), 'plane');
});
