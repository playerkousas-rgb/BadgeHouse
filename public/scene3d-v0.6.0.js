// © SCOUT SYSTEM · BadgeHouse v0.6.0. Original miniature models.
import {AmbientLight,BoxGeometry,Color,ConeGeometry,CylinderGeometry,DirectionalLight,Group,HemisphereLight,InstancedMesh,Matrix4,TorusGeometry,Line,LineDashedMaterial,BufferGeometry,Mesh,MeshBasicMaterial,MeshStandardMaterial,OrthographicCamera,PerspectiveCamera,PlaneGeometry,Quaternion,Raycaster,Scene,Shape,ExtrudeGeometry,SphereGeometry,SRGBColorSpace,TextureLoader,Vector2,Vector3,WebGLRenderer} from 'three';
import {houseColours} from './world-v0.6.0.js';
import {regions} from './catalog-v0.6.0.js';

const radius=2.1, north=new Vector3(0,1,0);
const spots={...Object.fromEntries(regions.map(r=>[r.id,[r.lon,r.lat]])),start:[102,-11]};
export const toVector=(lon,lat,r=1)=>{const l=lon*Math.PI/180,a=lat*Math.PI/180;return new Vector3(Math.cos(a)*Math.cos(l),Math.sin(a),-Math.cos(a)*Math.sin(l)).multiplyScalar(r);};
export const locationVector=(id,r=1)=>toVector(...(spots[id]||spots.start),r);
export function arcPoint(a,b,t,r=1){const left=a.clone().normalize(),right=b.clone().normalize();return left.applyQuaternion(new Quaternion().identity().slerp(new Quaternion().setFromUnitVectors(left,right),t)).multiplyScalar(r);}
const neutral=['#aebc84','#96ae70','#76985e'];
const mat=(color,settings)=>new MeshStandardMaterial({color,roughness:.92,...settings});
function put(g,m,x,y,z,parent){const obj=new Mesh(g,m);obj.position.set(x,y,z);parent.add(obj);return obj;}
const box=(p,w,h,d,x,y,z,c)=>put(new BoxGeometry(w,h,d),mat(c),x,y,z,p);
const cyl=(p,a,b,h,x,y,z,c,s=12)=>put(new CylinderGeometry(a,b,h,s),mat(c),x,y,z,p);
const ball=(p,r,x,y,z,c,s=12)=>put(new SphereGeometry(r,s,8),mat(c),x,y,z,p);
function shadow(p,x,y,z,w,d){const sh=put(new PlaneGeometry(1,1),new MeshBasicMaterial({color:'#40523f',transparent:true,opacity:.18,depthWrite:false}),x,y,z,p);sh.rotation.x=-Math.PI/2;sh.scale.set(w,d,1);return sh;}
function modelScout(){const body=new Group();const shoes='#334437',cap='#496744',tan='#e8b68b';const legs=[-.12,.12].map(x=>{const limb=new Group();limb.position.set(x,.43,0);body.add(limb);box(limb,.18,.29,.22,0,-.13,0,'#6d583f');box(limb,.18,.12,.31,0,-.32,.045,shoes);return limb;});box(body,.46,.35,.30,0,.60,0,'#7d9a61');box(body,.47,.08,.32,0,.46,0,'#5a513f');for(const x of [-.275,.275]){box(body,.11,.23,.15,x,.59,0,'#849e67');ball(body,.066,x,.46,.019,tan);}const scarf=box(body,.19,.17,.04,0,.695,.177,'#efb564');scarf.rotation.z=Math.PI/4;ball(body,.224,0,.92,.016,tan);for(const x of [-.069,.069])ball(body,.023,x,.944,.226,'#304234',8);box(body,.075,.015,.026,0,.866,.202,'#8d5e49');cyl(body,.17,.233,.125,0,1.09,0,cap);cyl(body,.26,.27,.035,0,1.034,.05,'#6f885a');return {body,legs};}
function pose(actor,t,walking){actor.legs.forEach((l,i)=>{l.rotation.x=walking?Math.sin(t*Math.PI*17+i*Math.PI)*.65:0;});}
function tree(g,x,z,scale=1,c='#61855a'){const t=new Group();t.position.set(x,0,z);t.scale.setScalar(scale);g.add(t);cyl(t,.11,.16,.52,0,.26,0,'#89694d',7);for(let i=0;i<3;i++)put(new ConeGeometry(.62-i*.12,1-i*.13,7),mat(i===2?'#85a370':c),0,.72+i*.38,0,t);return t;}
function roof(group,w,d,y,kind,c){
 if(kind==='flat'){box(group,w,.29,d,0,y+.12,0,c);return;}
 if(kind==='hip'){
  const x=w/2,z=d/2,r=w*.23,h=.84;
  const vertices=[-x,0,z,x,0,z,x,0,-z,-x,0,-z,-r,h,0,r,h,0];
  const g=new BufferGeometry().setFromPoints(Array.from({length:6},(_,i)=>new Vector3(...vertices.slice(i*3,i*3+3))));
  g.setIndex([0,1,5,0,5,4,1,2,5,2,3,4,2,4,5,3,0,4,0,3,2,0,2,1]);g.computeVertexNormals();put(g.toNonIndexed(),mat(c,{flatShading:true}),0,y,0,group);g.dispose();return;
 }
 const profiles={gable:[[-.5,0],[0,.78],[.5,0]],steep:[[-.5,0],[0,1.29],[.5,0]],shed:[[-.5,0],[-.5,.22],[.5,1],[.5,0]],barn:[[-.5,0],[-.36,.82],[-.15,1.12],[.15,1.12],[.36,.82],[.5,0]]};
 const s=new Shape();(profiles[kind]||profiles.gable).forEach(([x,h],i)=>i?s.lineTo(x*w,h):s.moveTo(x*w,h));s.closePath();
 const geo=new ExtrudeGeometry(s,{depth:d,bevelEnabled:false,steps:1});geo.translate(0,0,-d/2);put(geo,mat(c),0,y,0,group);
}
function detachedHouse(parent,x,z,look){
 const [top,wall,trim]=houseColours(look),h=new Group();h.position.set(x,0,z);parent.add(h);
 if(look.body==='lodge')h.scale.set(1.30,1,1.12);else if(look.body==='tower')h.scale.x=.88;
 const upper=look.body==='tower'?1.19:0;
 shadow(h,.15,.009,.1,look.body==='wing'?6.2:4.54,3.5);
 box(h,3.85,.22,3.08,0,.12,0,'#a89b76');box(h,3.6,1.87+upper,2.74,0,1.15+upper/2,0,wall);box(h,3.61,.11,2.75,0,.32,0,trim);
 roof(h,4.28,3.28,2.09+upper,look.roof,top);
 const chimney=2.25+upper+(look.roof==='steep'?.22:0);box(h,.35,.80,.42,.99,chimney,-.62,trim);box(h,.43,.12,.51,.99,chimney+.42,-.62,wall);
 box(h,.83,1.29,.13,0,.87,1.39,trim);box(h,.66,1.09,.075,0,.82,1.48,top);ball(h,.049,.21,.81,1.53,'#edc074',8);box(h,1.1,.16,.49,0,.10,1.73,'#ad9c7b');
 for(const wx of [-1.15,1.15]){windowPane(h,wx,1.26,1.39,.65,.70,trim);if(upper)windowPane(h,wx,2.63,1.39,.65,.62,trim);}
 if(upper)box(h,3.66,.11,2.82,0,2.01,0,trim);
 if(look.body==='wing'){const wing=new Group();wing.position.set(2.28,0,.08);h.add(wing);box(wing,1.93,.19,2.18,0,.1,0,'#a89b76');box(wing,1.87,1.43,2.0,0,.86,0,wall);roof(wing,2.16,2.35,1.57,'shed',top);windowPane(wing,.46,.98,1.01,.61,.57,trim);}
 else{const side=windowPane(h,1.81,1.30,-.2,.61,.69,trim);side.rotation.y=Math.PI/2;}
 box(h,.67,.20,.084,0,1.73,1.41,'#ddc38c');box(h,.26,.042,.019,0,1.73,1.46,trim);return h;
}
function windowPane(p,x,y,z,w,h,trim){const g=new Group();g.position.set(x,y,z);p.add(g);box(g,w+.08,h+.08,.085,0,0,0,trim);box(g,w,h,.038,0,0,.05,'#b8d8ca');box(g,.04,h,.025,0,0,.08,trim);box(g,w,.04,.025,0,0,.08,trim);box(g,w+.18,.062,.21,0,-h/2-.053,.054,'#816a4a');return g;}
function grassBits(root){for(let i=0;i<65;i++){const x=Math.sin(i*91.331)*7.65,z=Math.cos(i*19.323)*3.85;if(z>1.55&&z<3.1)continue;if(Math.abs(x)>1.3&&Math.abs(x)<6&&z<2.2&&z> -2.6)continue;const r=.10+(i%5)*.028;ball(root,r,x,.034,z,neutral[i%3],6).scale.y=.27;}}
function landBase(root){box(root,16.7,.52,9.1,0,-.28,0,'#9a865e');box(root,16.68,.24,9.08,0,-.07,0,'#aabb87');for(let i=0;i<14;i++){const x=-7.7+i*1.18;box(root,.64,.015,.53,x,.057,2.74+(i%3)*.06,i%2?'#d8c69d':'#ddcca4');}grassBits(root);}
function nature(root,flavour){for(const [i,x,z,s] of [[0,-7.0,-2.9,1.11],[1,-6.7,-1.37,.76],[2,-.5,-3.4,1.24],[3,.57,-2.9,.92],[4,6.68,-2.95,1.18],[5,7.56,-1.94,.86],[6,6.87,.82,.92],[7,-7.0,1.19,.76]])tree(root,x,z,s,flavour==='mountain'?'#6d8d5f':'#557954');if(flavour==='harbour'){for(let i=0;i<5;i++)box(root,.43,.65+(i%3)*.26,.48,-7.7+i*.53,.34+(i%3)*.13,-4.1,'#8ba7a1');}if(flavour==='mountain'){for(const [x,z,h,r] of [[-1,-4,2.5,1.18],[.2,-4.11,3.5,1.5]]){put(new ConeGeometry(r,h,5),mat('#8ca49b'),x,h/2,z,root);put(new ConeGeometry(r*.34,h*.34,5),mat('#efead9'),x,h*.83,z,root);}}}
function token(p,x,y,z,trim,images,i,redraw,local){box(p,.47,.48,.055,x,y,z,trim);box(p,.39,.40,.037,x,y,z+.039,'#eee1b9');const peg=cyl(p,.115,.115,.031,x,y,z+.074,['#648064','#aa644a','#7a8954','#537a80'][i%4],6);peg.rotation.x=Math.PI/2;if(images[i]){const im=put(new PlaneGeometry(.37,.38),new MeshBasicMaterial({transparent:true,depthWrite:false}),x,y,z+.104,p);const texture=new TextureLoader().load(images[i],()=>{if(!local.closed)redraw();},undefined,()=>{});texture.colorSpace=SRGBColorSpace;im.material.map=texture;}}
function room(root,look,images,redraw,local){const [roof,wall,trim,light]=houseColours(look);box(root,12.3,.48,8.3,0,-.26,0,'#947555');for(let i=0;i<15;i++){box(root,.807,.08,8.3,-5.71+i*.813,.002,0,['#c49c76','#caa681','#b9926b'][i%3]);}
 box(root,12.3,3.9,.24,0,1.98,-4.02,light);box(root,.22,3.9,8.29,-6.03,1.98,0,light);box(root,12.1,.12,.09,0,.15,-3.87,trim);box(root,.07,.12,8.04,-5.89,.15,0,trim);box(root,1.15,2.31,.10,-4.35,1.25,-3.85,trim);box(root,.96,2.15,.09,-4.35,1.24,-3.77,roof);ball(root,.062,-4.02,1.19,-3.69,'#efcd87',8);windowPane(root,-2.08,2.33,-3.84,1.51,1.17,trim);box(root,2.9,.017,1.72,-1.24,.052,1.42,roof);box(root,2.74,.018,1.56,-1.24,.056,1.42,wall);box(root,2.49,.018,1.31,-1.24,.059,1.42,roof);
 const decor=new Group();root.add(decor);if(look.furniture==='shelf'){box(decor,3.33,2.70,.59,2.19,1.42,-3.42,trim);for(const y of [.49,1.45,2.41]){box(decor,3.06,.08,.64,2.19,y,-3.27,'#cbac80');box(decor,3.05,.70,.062,2.19,y+.35,-3.07,wall);}for(let i=0;i<4;i++)token(decor,1.05+i*.75,1.87,-3,trim,images,i,redraw,local);for(let i=0;i<6;i++)box(decor,.21,.37+i%3*.06,.26,.97+i*.25,.68+i%3*.03,-2.91,[roof,'#a45d48','#dba769'][i%3]);}
 else if(look.furniture==='wall'){box(decor,3.62,1.77,.13,2.19,2.15,-3.82,trim);box(decor,3.45,1.60,.06,2.19,2.15,-3.71,roof);for(let i=0;i<4;i++)token(decor,1.07+i*.75,2.17,-3.65,trim,images,i,redraw,local);box(decor,3.45,.22,.70,2.19,.24,-3.39,'#bd986e');}
 else{box(decor,3.14,.19,1.28,2.23,1.25,-2.4,'#c79c71');for(const x of [1.02,3.44])for(const z of [-2.88,-1.92])box(decor,.13,1.2,.13,x,.61,z,trim);for(let i=0;i<4;i++)token(decor,1.05+i*.75,2.30,-3.75,trim,images,i,redraw,local);const a=box(decor,.46,.03,.50,1.99,1.365,-2.28,'#fcf0d0');const b=box(decor,.46,.03,.50,2.45,1.365,-2.28,'#f4e5bb');a.rotation.z=-.10;b.rotation.z=.10;}
 cyl(root,.26,.21,.37,4.77,.23,-2.69,roof);const plant=ball(root,.33,4.77,.63,-2.69,'#688e61');plant.scale.set(.70,1.35,.60);
 const scarves=new Group();scarves.position.set(-1.26,1.69,-3.72);root.add(scarves);box(scarves,1.98,.11,.10,0,.46,0,trim);
 for(const [i,c] of ['#ad5d49','#4d7b76'].entries()){const x=-.5+i,shape=new Shape();shape.moveTo(-.44,.36);shape.lineTo(.44,.36);shape.lineTo(0,-.40);shape.closePath();put(new ExtrudeGeometry(shape,{depth:.05,bevelEnabled:false}),mat(c),x,0,.14,scarves);const stripe=box(scarves,.51,.065,.023,x,.16,.197,'#ecd097');stripe.rotation.z=i?.14:-.14;}
 const woggles=new Group();woggles.position.set(3.76,0,.40);root.add(woggles);box(woggles,2.36,.35,1.18,0,.20,0,'#b28058');box(woggles,2.40,.09,1.19,0,.38,0,'#e2c38f');box(woggles,2.36,.08,.10,0,.45,.55,trim);box(woggles,2.36,.08,.1,0,.45,-.55,trim);
 for(const [i,c] of ['#73523e','#b36346','#6b7e4f'].entries()){const ring=put(new TorusGeometry(.225,.08,8,20),mat(c),-.67+i*.67,.51,-.033,woggles);ring.rotation.x=Math.PI/2;}
 return [decor,scarves,woggles];}

export function createStage(activate){
 const renderer=new WebGLRenderer({alpha:false,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:false});renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.65));renderer.outputColorSpace=SRGBColorSpace;
 const canvas=renderer.domElement,tex=new TextureLoader().load('/maps/globe-v0.6.0.webp',()=>draw(),undefined,()=>{});tex.colorSpace=SRGBColorSpace;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());canvas.setAttribute('aria-hidden','true');
 let scene,camera,state,root,actor,labels=[],targets=[],local,renderBox,observer,lost=false,motion=false,view,drag,projection,headLight,roomTarget,roomAngle,roomElevation,roomLength,dots;const ray=new Raycaster();
 function release(){observer?.disconnect();if(local)local.closed=true;root?.traverse(o=>{if(o.geometry)o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){if(m.map&&m.map!==tex)m.map.dispose();m.dispose();}});labels=[];targets=[];dots=null;root=null;}
 function light(){scene.add(new HemisphereLight('#fff6db','#69826b',2.05));const d=new DirectionalLight('#fff0d1',2.35);d.position.set(-4,7,6);scene.add(d);}
 function orbit(dir){view.copy(dir).normalize();camera.position.copy(view).multiplyScalar(projection);headLight?.position.copy(camera.position).add(new Vector3(-2,3,0));camera.lookAt(0,0,0);camera.updateMatrixWorld();}
 function setGlobeActor(n,phase=0,walking=false){actor.body.position.copy(n).multiplyScalar(radius+.045);actor.body.quaternion.setFromUnitVectors(north,n);pose(actor,phase,walking);}
 function draw(){if(lost||!root||!renderBox?.isConnected)return;renderer.render(scene,camera);if(state.kind!=='globe')return;const eye=camera.position.clone().normalize();for(const {el,n,v} of labels){const p=v.clone().project(camera),shown=n.dot(eye)>.30&&Math.abs(p.x)<1&&Math.abs(p.y)<1;el.hidden=!shown;if(shown){el.style.left=`${(p.x+1)*50}%`;el.style.top=`${(1-p.y)*50}%`;}}}
 function size(){if(!root||!renderBox?.isConnected)return;const w=renderBox.clientWidth,h=renderBox.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const ratio=w/h;if(camera.isPerspectiveCamera){camera.aspect=ratio;camera.fov=ratio<1.05?43:40;projection=ratio<1.03?8.1:7.3;orbit(view);}else{const base=state.kind==='outside'?4.0:state.kind==='inside'?5.42:5.05;const half=Math.max(base,(state.kind==='outside'?6.0:8.5)/ratio);camera.left=-half*ratio;camera.right=half*ratio;camera.top=half;camera.bottom=-half;}camera.updateProjectionMatrix();draw();}
 function dash(a,b,ink,opacity){if(a.dot(b)>.9995)return;const pts=Array.from({length:65},(_,i)=>arcPoint(a,b,i/64,radius+.036));const line=new Line(new BufferGeometry().setFromPoints(pts),new LineDashedMaterial({color:ink,dashSize:.047,gapSize:.048,transparent:true,opacity}));line.computeLineDistances();root.add(line);}
 function makeGlobe(){
  scene.background=new Color('#17382e');scene.add(new AmbientLight('#fffdf0',1.38));headLight=new DirectionalLight('#f5f8e4',1.8);scene.add(headLight);
  const center=state.from==='start'?toVector(110,20):locationVector(state.from);view=center.clone();camera=new PerspectiveCamera(40,1,.08,40);projection=7.3;orbit(view);
  put(new SphereGeometry(radius,72,48),mat('#fffef2',{map:tex,roughness:1}),0,0,0,root);
  const start=locationVector('start'),active=locationVector(state.selected);const quiet=state.regions.filter(r=>r.count===0&&r.id!==state.selected);
  dots=new InstancedMesh(new SphereGeometry(.027,8,6),new MeshBasicMaterial({color:'#426d59'}),quiet.length);dots.userData.ids=quiet.map(r=>r.id);quiet.forEach((r,i)=>{const p=locationVector(r.id,radius+.021);dots.setMatrixAt(i,new Matrix4().makeTranslation(p.x,p.y,p.z));});root.add(dots);
  for(const r of state.regions){const chosen=r.id===state.selected;if(!r.count&&!chosen)continue;const n=locationVector(r.id),p=n.clone().multiplyScalar(radius+.047);if(r.count)dash(start,n,'#e2e8b0',.54);ball(root,.052,p.x,p.y,p.z,chosen?'#f4c374':'#e5dfac',10);const el=document.createElement('button');el.className=`globe-pin ${chosen?'chosen':''}`;el.type='button';const flag=document.createElement('img');flag.src=`/flags-v1/${r.flag}.svg`;flag.alt='';el.append(flag,` ${r.label} · ${r.count}`);el.dataset.action='destination';el.dataset.value=r.id;renderBox.append(el);labels.push({el,n,v:n.clone().multiplyScalar(radius+.16)});}
  dash(locationVector(state.from),active,'#f8c172',.92);actor=modelScout();actor.body.scale.setScalar(.36);root.add(actor.body);setGlobeActor(locationVector(state.from));
 }
 function lookAtMiniature(){camera.position.copy(roomTarget).add(new Vector3(Math.sin(roomAngle)*roomLength,roomElevation,Math.cos(roomAngle)*roomLength));camera.lookAt(roomTarget);camera.updateMatrixWorld();}
 function makeVillage(){
  scene.background=new Color(state.kind==='inside'?'#e0e9dc':'#dcead9');light();camera=new OrthographicCamera(-10,10,5,-5,.1,150);
  roomTarget=state.kind==='inside'?new Vector3(0,1,-.45):new Vector3(0,.6,0);
  const pos=state.kind==='street'?[5.2,9.4,17]:state.kind==='inside'?[9,11,15]:[7.8,7,12];roomAngle=Math.atan2(pos[0],pos[2]);roomLength=Math.hypot(pos[0],pos[2]);roomElevation=pos[1]-.65;lookAtMiniature();
  if(state.kind==='inside'){const furniture=room(root,state.look,state.images||[],draw,local);if(state.interactive!==false)targets.push(...furniture.map((obj,i)=>[obj,'exhibit',['badge','scarf','woggle'][i]]));actor=modelScout();root.add(actor.body);actor.body.position.set(-2.58,.07,1.25);actor.body.rotation.y=.29;}
  else if(state.kind==='street'){landBase(root);nature(root,state.flavour);state.villas.forEach((h,i)=>{const x=(i===0?-1:1)*3.42;const g=detachedHouse(root,x,-.76,h.look);targets.push([g,'visit',h.id]);for(let k=0;k<4;k++)box(root,.58,.021,.32,x,.056,1.12+k*.39,'#d7c69e');});actor=modelScout();root.add(actor.body);actor.body.scale.setScalar(.87);actor.body.rotation.y=.57;actor.body.position.set(-6.2,.08,2.92);}
  else{const lawn=new Group();root.add(lawn);lawn.scale.set(.62,1,.72);landBase(lawn);for(const [x,z,s] of [[-4.4,-1.85,.89],[4.25,-1.84,1],[3.91,.3,.62]])tree(root,x,z,s);detachedHouse(root,0,-.31,state.look);for(let i=0;i<4;i++)box(root,.58,.021,.27,0,.075,1.39+i*.29,'#d7c69e');actor=modelScout();root.add(actor.body);actor.body.position.set(2.55,.07,2.05);actor.body.rotation.y=.48;}
 }
 function update(container,next){if(lost)return false;release();renderBox=container;state=next;local={closed:false};motion=false;drag=null;container.replaceChildren(canvas);scene=new Scene();root=new Group();scene.add(root);if(state.kind==='globe')makeGlobe();else makeVillage();observer=new ResizeObserver(size);observer.observe(container);size();return true;}
 function step(itinerary,t){if(!root||!state||!renderBox?.isConnected)return;motion=t<1;if(state.kind==='globe'&&itinerary.type==='globe'){
   const a=locationVector(itinerary.from),b=locationVector(itinerary.to),n=arcPoint(a,b,t);setGlobeActor(n,t,motion);orbit(arcPoint(itinerary.startView||view,b,Math.min(1,t*1.28)));
  }else if(state.kind==='street'&&itinerary.type==='street'){const z=t<.77?2.92:2.92-(t-.77)/.23*1.87,x=-6.2+(itinerary.index===0?2.78:9.62)*Math.min(1,t/.77);actor.body.position.set(x,.07,z);actor.body.rotation.y=t<.77?Math.PI/2:Math.PI;pose(actor,t,motion);}draw();}
 canvas.addEventListener('pointerdown',e=>{if(!root||motion||e.button>0)return;canvas.setPointerCapture(e.pointerId);drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};});
 canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId||!state||motion)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.abs(dx)+Math.abs(dy)<4)return;drag.moved=true;drag.x=e.clientX;drag.y=e.clientY;if(state.kind==='globe'){const a=Math.asin(view.y)*180/Math.PI,l=Math.atan2(-view.z,view.x)*180/Math.PI;orbit(toVector(l+dx*.38,Math.max(-72,Math.min(72,a+dy*.32))));}else{roomAngle=Math.max(state.kind==='inside'?.14:-.64,Math.min(1.08,roomAngle-dx*.008));roomElevation=Math.max(5.2,Math.min(16,roomElevation+dy*.035));lookAtMiniature();}draw();});
 canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const prev=drag;drag=null;if(prev.moved||motion||Math.hypot(e.clientX-prev.x,e.clientY-prev.y)>10)return;const rect=canvas.getBoundingClientRect();ray.setFromCamera(new Vector2((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2),camera);if(state.kind==='globe'){const eye=camera.position.clone().normalize();const hit=dots&&ray.intersectObject(dots)[0];const id=hit&&dots.userData.ids[hit.instanceId];if(id&&locationVector(id).dot(eye)>.23)activate('destination',id);return;}const hit=ray.intersectObjects(targets.map(o=>o[0]),true)[0];if(hit)for(let obj=hit.object;obj;obj=obj.parent){const target=targets.find(row=>row[0]===obj);if(target){activate(target[1],target[2]);break;}}});
 canvas.addEventListener('pointercancel',()=>{drag=null;});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;renderBox?.classList.remove('live-3d');renderBox?.parentElement?.classList.remove('scene-3d-active');});canvas.addEventListener('webglcontextrestored',()=>{lost=false;});
 return {update,step,unmount:release,view:()=>view?.clone(),canvas};
}
