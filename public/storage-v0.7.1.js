const MAX_ITEMS=5000, MAX_IMAGE=700_000, MAX_BACKUP=250_000_000;
export {MAX_BACKUP};
export const itemTypes=['badge','scarf','woggle'];
export const itemType=item=>item?.type===undefined?'badge':item.type;
export function encodeBackup(items){return JSON.stringify({format:'badgehouse-backup',version:2,items:items.map(i=>({...i,type:itemType(i)}))});}
const imagePattern=/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
export function validItem(item){
 return item && itemTypes.includes(itemType(item)) && typeof item.id==='string' && /^[a-zA-Z0-9-]{1,80}$/.test(item.id) &&
 typeof item.name==='string' && item.name.trim().length>0 && item.name.length<=100 &&
 typeof item.place==='string' && item.place.length<=80 && typeof item.story==='string' && item.story.length<=1000 &&
 typeof item.year==='string' && /^(?:\d{4})?$/.test(item.year) && typeof item.noTrade==='boolean' &&
 typeof item.image==='string' && item.image.length<=MAX_IMAGE && (!item.image || imagePattern.test(item.image));
}
export function decodeBackup(raw){
 if (typeof raw!=='string'||raw.length>MAX_BACKUP) throw new Error('Invalid backup');
 const data=JSON.parse(raw);
 if(data?.format!=='badgehouse-backup'||![1,2].includes(data.version)||!Array.isArray(data.items)||data.items.length>MAX_ITEMS) throw new Error('Invalid backup');
 const seen=new Set();
 return data.items.map(item=>{
  if(!validItem(item)||seen.has(item.id)||(data.version===2&&!itemTypes.includes(item.type))||(data.version===1&&item.type!==undefined)) throw new Error('Invalid badge');
  seen.add(item.id);
  const {id,name,place,story,year,noTrade,image}=item;
  return {id,name,place,story,year,noTrade,image,...(data.version===2?{type:item.type}:{})};
 });
}
let connection;
function open(){
 if(!connection) connection=new Promise((resolve,reject)=>{
  const req=indexedDB.open('badgehouse',1);
  req.onupgradeneeded=()=>req.result.createObjectStore('badges',{keyPath:'id'});
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error);
 }).catch(err=>{connection=undefined;throw err;});
 return connection;
}
async function transaction(mode, fn){
 const db=await open();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('badges',mode);
  const out=fn(tx.objectStore('badges'));
  tx.oncomplete=()=>resolve(out?.result);
  tx.onabort=tx.onerror=()=>reject(tx.error||new Error('Storage unavailable'));
 });
}
export const readItems=()=>transaction('readonly',store=>store.getAll());
export const saveItem=item=>validItem(item)?transaction('readwrite',store=>store.put(item)):Promise.reject(new Error('Invalid item'));
export const dropItem=id=>transaction('readwrite',store=>store.delete(id));
export const restoreItems=items=>transaction('readwrite',store=>{for(const item of items) store.add(item);});

export async function formatPhoto(file, removeBackground){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15_000_000) throw new Error('Invalid image');
 const photo=await createImageBitmap(file);
 const scale=Math.min(1,960/Math.max(photo.width,photo.height));
 const canvas=document.createElement('canvas'); canvas.width=Math.max(1,Math.round(photo.width*scale));canvas.height=Math.max(1,Math.round(photo.height*scale));
 const ctx=canvas.getContext('2d',{willReadFrequently:removeBackground});
 ctx.drawImage(photo,0,0,canvas.width,canvas.height);photo.close();
 let output=canvas;
 if(removeBackground){
  const {width:w,height:h}=canvas; const image=ctx.getImageData(0,0,w,h);
  const bounds=clearBorderBackground(image.data,w,h);
  if(bounds){ctx.putImageData(image,0,0);output=document.createElement('canvas');output.width=bounds.w;output.height=bounds.h;output.getContext('2d').drawImage(canvas,bounds.x,bounds.y,bounds.w,bounds.h,0,0,bounds.w,bounds.h);}
 }
 const result=output.toDataURL('image/webp',0.82);
 if(!imagePattern.test(result)||result.length>MAX_IMAGE) throw new Error('Image too large');
 return result;
}

// Non-AI: only pixels connected to the edge and near the corner colour are removed.
export function clearBorderBackground(pixels,w,h){
 const corners=[0,(w-1)*4,(h-1)*w*4,(w*h-1)*4];
 const color=[0,1,2].map(c=>corners.reduce((sum,i)=>sum+pixels[i+c],0)/4);
 if(corners.some(i=>color.some((c,j)=>Math.abs(pixels[i+j]-c)>38))) return null;
 const size=w*h, seen=new Uint8Array(size), queue=new Int32Array(size);let head=0,tail=0;
 function tryPixel(i){if(seen[i])return;seen[i]=1;const p=i*4;if(pixels[p+3]&&color.some((v,c)=>Math.abs(pixels[p+c]-v)>33))return;queue[tail++]=i;}
 for(let x=0;x<w;x++){tryPixel(x);tryPixel((h-1)*w+x);}for(let y=0;y<h;y++){tryPixel(y*w);tryPixel(y*w+w-1);}
 while(head<tail){const i=queue[head++],x=i%w; if(x>0)tryPixel(i-1);if(x<w-1)tryPixel(i+1);if(i>=w)tryPixel(i-w);if(i<size-w)tryPixel(i+w);}
 if(!tail||tail===size)return null;
 for(let i=0;i<tail;i++)pixels[queue[i]*4+3]=0;
 let minX=w,minY=h,maxX=-1,maxY=-1;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(pixels[(y*w+x)*4+3]){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
 return maxX<0?null:{x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
}
