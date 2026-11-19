// © SCOUT SYSTEM · BadgeHouse v0.6.0 · Local guestbook and bookmarks.
export const socialFields=['instagram','facebook','website'];
export const maxVisits=60;
export function socialURL(value){
 if(typeof value!=='string')return '';
 const input=value.trim();
 if(!/^https:\/\//i.test(input)||input.length>400||/[\s\u0000-\u001f\u007f\\]/u.test(input))return '';
 try{const url=new URL(input);return url.protocol==='https:'&&url.hostname.includes('.')&&!url.username&&!url.password&&url.href.length<=400?url.href:'';}catch{return '';}
}
export function socialLinks(value){return Object.fromEntries(socialFields.flatMap(key=>{const url=socialURL(value?.[key]);return url?[[key,url]]:[];}));}
export function needsSocialConsent(before,after){return socialFields.some(key=>after[key]&&before[key]!==after[key]);}
export const visitAlias=value=>typeof value==='string'?value.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,40):'';
function timestamp(value){return Number.isSafeInteger(value)&&value>0&&value<=8.64e15?value:0;}
function read(raw){try{return JSON.parse(raw);}catch{return null;}}
export function readVisits(raw){const parsed=read(raw);return Array.isArray(parsed)?parsed.filter(v=>v&&timestamp(v.at)).slice(0,maxVisits).map(v=>({alias:visitAlias(v.alias),at:v.at})):[];}
export function readActivity(raw){const state=read(raw);return {returnedAt:timestamp(state?.returnedAt),updatedAt:timestamp(state?.updatedAt)};}
export function readBookmarks(raw,allowed){const parsed=read(raw);return Array.isArray(parsed)?[...new Set(parsed.filter(id=>allowed.includes(id)))]:[];}
