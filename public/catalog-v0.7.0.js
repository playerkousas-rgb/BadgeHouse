import {scoutRows} from './scout-regions-v0.7.0.js';
export const houses = [
 {id:'hong-kong', zh:'獅子山章屋',en:'Lion Rock Badge House',region:['香港','Hong Kong'],area:'asia',areaLabel:['亞洲','Asia'],initial:'HK',color:'#a97449', desc:['由香港營章到海外交流紀念，記錄每次出發同相遇。','From local camp patches to keepsakes from overseas adventures.'],badges:[['獅子山露營章','Lion Rock Camp','mountain','1998'],['海港交流章','Harbour Exchange','compass','2006'],['林間營火章','Woodland Campfire','fire','2018'],['山徑紀念章','Trail Memento','pine','2024']]},
 {id:'japan', zh:'富士山下嘅章簿',en:'The Fuji Field Journal',region:['日本','Japan'],area:'asia',areaLabel:['亞洲','Asia'],initial:'JP',color:'#a16d56',desc:['湖畔營地、懷舊布章，同埋喺山下交換返嚟嘅小故事。','Lakeside camps, vintage patches, and stories traded beneath the mountain.'],badges:[['富士山營章','Fuji Camp','mountain','2002'],['湖畔露營','Lakeside Camp','tent','2010'],['松林小徑','Pine Trail','pine','2015'],['晨曦紀念章','First Light','compass','2023']]},
 {id:'canada', zh:'落基山收藏屋',en:'Rocky Mountain Cabin',region:['加拿大','Canada'],area:'americas',areaLabel:['北美洲','North America'],initial:'CA',color:'#55766e',desc:['由松林走到雪山，每一枚章都係一段行山同露營回憶。','From pine forests to snowy peaks, each patch holds a memory from the trail.'],badges:[['落基山行山章','Rockies Trek','mountain','1999'],['松林紀念章','Pine Forest','pine','2005'],['山間營火','Mountain Campfire','fire','2017'],['湖畔小屋','Lakeside Cabin','tent','2022']]}
];
export function filterHouses(filter){return houses.filter(h=>filter==='all'||h.area===filter);}
export function escapeHTML(value){return String(value ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}

export const areas={
 'asia-pacific':['亞太區','Asia-Pacific'],'americas':['美洲區','Interamerica'],'europe':['歐洲區','Europe'],
 'arab':['阿拉伯區','Arab Region'],'africa':['非洲區','Africa']
};
export const regions=scoutRows.map(([id,mark,zh,en,area,lon,lat,org,flag,xy,orgShort,emblem])=>({id,mark,label:[zh,en],area,continent:areas[area],lon,lat,org,flag,xy,orgShort,emblem,scene:id==='hong-kong'?'harbour':id==='japan'?'mountain':'forest'}));
for(const h of houses) h.regionId=h.id;
houses.push(
 {id:'harbour-scout',regionId:'hong-kong',zh:'海旁小屋',en:'Harbour Lookout',desc:['收住沿海營地同海上活動嘅回憶。','Memories of camps and adventures along the shore.'],badges:[['海上歷奇章','Sea Adventure','compass','2012'],['海旁營火章','Harbour Campfire','fire','2021']]},
 {id:'pine-japan',regionId:'japan',zh:'松風小屋',en:'Matsukaze Cabin',desc:['由斜坡松林到山間冬營。','From hillside pines to winter camps.'],badges:[['雪營章','Winter Camp','mountain','2016'],['山林步道章','Forest Trail','pine','2022']]},
 {id:'cedar-canada',regionId:'canada',zh:'雪松營舍',en:'Cedar Trail Lodge',desc:['好朋友喺不同營地送畀我嘅章。','Patches gifted by friends at different camps.'],badges:[['雪松徑紀念章','Cedar Trail','pine','2011'],['露營紀念章','Camp Keepsake','tent','2020']]}
);
export const regionFor=house=>regions.find(r=>r.id===house.regionId);

export const housesIn=id=>houses.filter(h=>h.regionId===id);
export const countHouses=id=>housesIn(id).length;
export const collections=[
 {id:'badge',label:['章簿','Badge album'],sub:['揭頁睇布章同營章','Browse patches and camp badges'],glyph:'book'},
 {id:'scarf',label:['領巾牆','Neckerchief wall'],sub:['睇掛起嘅童軍領巾','View the hanging neckerchiefs'],glyph:'scarf'},
 {id:'woggle',label:['巾圈收藏盒','Woggle collection box'],sub:['打開盒睇唔同巾圈','Open the box to see the woggles'],glyph:'woggle'}
];
export function displayItems(h,type){
 if(type==='badge')return h.badges;
 const region=regionFor(h); const label=region.label;
 if(type==='scarf')return [[`${label[0]}交流領巾`,`${label[1]} Exchange Neckerchief`,'scarf','2021'],['營隊紀念領巾','Camp Neckerchief','scarf','2024']];
 if(type==='woggle')return [['木製營隊巾圈','Carved Wood Camp Woggle','woggle','2019'],[`${label[0]}交流巾圈`,`${label[1]} Exchange Woggle`,'woggle','2023']];
 return [];
}

const wosmRegionPaths={africa:'africa',americas:'interamerica',arab:'arab','asia-pacific':'asia-pacific',europe:'europe'};
// These flag sources are checked separately from Scoutworld's emblem field.
const flagReferences={
 'hong-kong':['https://www.scout.org.hk/uploads/tc/circulars/9926/pc-062022_c.pdf#page=4','會旗規格（附件二 PDF）','Association flag (appendix 2 PDF)'],
 japan:['https://www.scout.or.jp/about/regulations','會旗規程（第九章）','Association flag (regulations, chapter 9)'],
 canada:['https://www.scoutshop.ca/products/flag-hoist-sct-canada-50-x-36','會旗圖片（童軍用品社）','Association flag photo (Scout Shop)']
};
export function scoutSources(region,lang='zh'){
 const official='https://www.scout.org';
 const entry=wosmRegionPaths[region.area],flag=flagReferences[region.id];
 return {
  directory:entry ? `${official}/where-we-work/regions/${entry}/countries` : '',
  emblem:region.id==='hong-kong' ? `https://www.scout.org.hk/${lang==='en'?'en':'tc'}/scouting/emblem.html` : region.emblem && `${official}${region.emblem}`,
  flag:flag?.[0]||'',
  flagLabel:flag?.[lang==='en'?2:1]||''
 };
}
