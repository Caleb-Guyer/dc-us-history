import * as T from './three.module.js';

// Real, locally rendered 3D. Normalized arcade coordinates remain independent
// of scene geometry so steering, collision windows and saved records stay stable.
export const renderer='webgl';
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rnd=n=>{const a=Math.sin(n*91.17+18.3)*43758.5453;return a-Math.floor(a);};
const at=(x,y,h=0)=>V((y-280)/28,h,-(x-230)/20);
const palettes={9:{sky:0x9aaeb0,fog:0x9da9a2,sun:0xffd393,earth:0x8f8872,accent:0xecc278},11:{sky:0x9caec0,fog:0xa2b0ad,sun:0xffd49b,earth:0x8a9572,accent:0xf2cd7d}};

function canvasMap(kind){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const c=canvas.getContext('2d');
 c.fillStyle=kind==='brick'?'#865b46':kind==='wood'?'#806446':kind==='water'?'#7d9ca0':'#a39a7e';c.fillRect(0,0,256,256);
 for(let i=0;i<700;i++){c.fillStyle=`rgba(${70+rnd(i)*130},${65+rnd(i+7)*110},${45+rnd(i+11)*100},.15)`;c.fillRect(rnd(i+20)*256,rnd(i+44)*256,kind==='wood'?30:3,kind==='wood'?1:3);}
 if(kind==='brick'){c.strokeStyle='#b5a18a';c.lineWidth=2;for(let y=0;y<256;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(256,y);c.stroke();for(let x=(y/32%2)*32;x<256;x+=64){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+32);c.stroke();}}}
 if(kind==='wood'){c.strokeStyle='#4f4738';for(let y=0;y<256;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(256,y);c.stroke();}}
 if(kind==='water'){c.strokeStyle='#d0dbd0';c.globalAlpha=.35;for(let i=0;i<75;i++){const x=rnd(i)*256,y=rnd(i+38)*256;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+9,y-3,x+22+rnd(i)*18,y);c.stroke();}}
 const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(kind==='brick'?3:kind==='water'?8:6,kind==='brick'?3:kind==='water'?15:10);t.anisotropy=4;return t;
}
function smokeTexture(){const cv=document.createElement('canvas');cv.width=cv.height=64;const c=cv.getContext('2d'),g=c.createRadialGradient(32,32,1,32,32,31);g.addColorStop(0,'#fff');g.addColorStop(.3,'#ffffffaa');g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(0,0,64,64);return new T.CanvasTexture(cv);}

export class CampaignWorld{
 constructor(canvas,{chapter=9,mission={mode:'factory'}}={}){
  this.canvas=canvas;this.chapter=chapter;this.mission=mission;this.mode=mission.mode||'factory';this.p=palettes[chapter]||palettes[9];
  this.geometries=new Map();this.materials=new Map();this.textures=[];this.entityViews=new Map();this.entityPools=new Map();this.flags=[];this.moving=[];this.wheels=[];this.sheets=[];this.crowd=[];this.trees=[];this.gameplayLabels=[];this.actorBatches=[];this.performance={calls:0,triangles:0,quality:'efficient'};this.disposed=false;this.lastPlayer=V();this.frame=0;
  this.scene=new T.Scene();this.scene.background=new T.Color(this.p.sky);this.scene.fog=new T.FogExp2(this.p.fog,.014);
  this.renderer=new T.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(1);this.renderer.shadowMap.enabled=false;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.06;this.renderer.outputColorSpace=T.SRGBColorSpace;
  this.camera=new T.PerspectiveCamera(54,1,.1,230);this.camera.position.set(0,7,14);
  this.scene.add(new T.HemisphereLight(0xe0e9dd,0x4c4438,1.15));
  this.sun=new T.DirectionalLight(this.p.sun,1.7);this.sun.position.set(-13,23,10);this.sun.castShadow=false;this.scene.add(this.sun);
  const rim=new T.DirectionalLight(0x9ac5d6,.55);rim.position.set(12,9,-25);this.scene.add(rim);
  this.brick=canvasMap('brick');this.wood=canvasMap('wood');this.ground=canvasMap('ground');this.waterTex=canvasMap('water');this.smokeTex=smokeTexture();this.textures.push(this.brick,this.wood,this.ground,this.waterTex,this.smokeTex);
  this.land=this.group();this.entities=this.group();this.people=this.group();this.films=this.group();this.mapStage=this.group();this.alamoStage=this.group();this.goldStage=this.group();
  this.buildEnvironment();this.buildMap();this.buildAlamo();this.buildGoldRush();
  this.hero=this.actor(0,0,{dress:this.mode==='factory'||this.mode==='courier',coat:chapter===9?0x768d87:0x927b59,hat:this.mode!=='factory'},this.people);
  this.other=this.actor(this.water?9:3,-2,{coat:0x4b6570,hat:true},this.people);
  this.hero.userData.carry.visible=this.mode!=='factory';
  if(this.water){this.boat=this.makeBoat(this.mode==='river',this.people);this.hero.scale.setScalar(.85);this.hero.position.y=.65;this.other.position.set(9,.23,-3);if(this.mode==='canal')this.makeHorse();}
  this.effectSprites=[];for(let i=0;i<30;i++){const s=new T.Sprite(new T.SpriteMaterial({map:this.smokeTex,color:0xffdaa1,transparent:true,opacity:0,depthWrite:false}));s.visible=false;this.scene.add(s);this.effectSprites.push(s);}
  this.wake=[];if(this.water)for(let i=0;i<9;i++){const ring=this.mesh('ring',[.4,.48,24],this.mat(0xd3e6d8,{transparent:true,opacity:.3,side:T.DoubleSide,depthWrite:false}),0,.04,0,this.people);ring.rotation.x=-Math.PI/2;ring.castShadow=false;this.wake.push(ring);}
  this.mapDot.userData.dynamic=true;
  for(const g of [this.land,this.mapStage,this.alamoStage,this.goldStage]){this.batchStatic(g);this.batchActors(g);}
  this.mapStage.visible=this.alamoStage.visible=this.goldStage.visible=false;this.resize();
 }
 get water(){return this.mode==='canal'||this.mode==='river';}
 batchStatic(parent){
  parent.updateMatrixWorld(true);const groups=new Map();
  const moving=new Set([...this.wheels,...this.flags,...this.moving.map(x=>x.m)]);
  parent.traverse(o=>{if(!o.isMesh||Array.isArray(o.material)||moving.has(o))return;let p=o;while(p&&p!==parent){if(p.userData?.root||p.userData?.dynamic)return;p=p.parent;}const key=o.geometry.uuid+'|'+o.material.uuid+'|'+o.castShadow+'|'+o.receiveShadow;const list=groups.get(key)||[];list.push(o);groups.set(key,list);});
  for(const list of groups.values())if(list.length>=3){const sample=list[0],batch=new T.InstancedMesh(sample.geometry,sample.material,list.length);batch.castShadow=sample.castShadow;batch.receiveShadow=sample.receiveShadow;batch.frustumCulled=false;const inverse=parent.matrixWorld.clone().invert();list.forEach((m,i)=>{batch.setMatrixAt(i,inverse.clone().multiply(m.matrixWorld));m.parent.remove(m);});batch.instanceMatrix.needsUpdate=true;parent.add(batch);}
 }
 batchActors(parent){
  const actors=[];parent.traverse(o=>{if(o.userData?.root)actors.push(o);});const groups=new Map();
  for(const actor of actors)actor.traverse(o=>{if(!o.isMesh||Array.isArray(o.material))return;const key=o.geometry.uuid+'|'+o.material.uuid;const list=groups.get(key)||[];list.push(o);groups.set(key,list);});
  for(const list of groups.values())if(list.length>=2){const mesh=new T.InstancedMesh(list[0].geometry,list[0].material,list.length);mesh.frustumCulled=false;mesh.castShadow=false;mesh.receiveShadow=false;parent.add(mesh);list.forEach(o=>{o.visible=false;});this.actorBatches.push({mesh,list,parent});}
 }
 syncActors(){
  if(!this.actorBatches.length)return;this.scene.updateMatrixWorld(true);const hidden=new T.Matrix4().makeScale(0,0,0),matrix=new T.Matrix4();
  for(const b of this.actorBatches){const inverse=b.parent.matrixWorld.clone().invert();b.list.forEach((node,i)=>{let visible=true,p=node.parent;while(p&&p!==b.parent){if(!p.visible){visible=false;break;}p=p.parent;}b.mesh.setMatrixAt(i,visible?matrix.multiplyMatrices(inverse,node.matrixWorld):hidden);});b.mesh.instanceMatrix.needsUpdate=true;}
 }
 group(x=0,y=0,z=0,parent=this.scene){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
 mat(color,extra={}){const {roughness,metalness,...simple}=extra,map=simple.map?.uuid||'',key=`${color?.isColor?color.getHex():color}|${map}|${JSON.stringify({...simple,map:null})}`;if(!this.materials.has(key))this.materials.set(key,new T.MeshLambertMaterial({color,...simple}));return this.materials.get(key);}
 geo(kind,args){const key=kind+args.join(',');if(!this.geometries.has(key)){const types={box:T.BoxGeometry,cyl:T.CylinderGeometry,sphere:T.SphereGeometry,cone:T.ConeGeometry,plane:T.PlaneGeometry,torus:T.TorusGeometry,ring:T.RingGeometry};this.geometries.set(key,new types[kind](...args));}return this.geometries.get(key);}
 mesh(kind,args,material,x=0,y=0,z=0,parent=this.land){const m=new T.Mesh(this.geo(kind,args),material?.isMaterial?material:this.mat(material));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 box(w,h,d,color,x=0,y=0,z=0,p=this.land){return this.mesh('box',[w,h,d],color,x,y,z,p);}
 cyl(r,h,color,x=0,y=0,z=0,p=this.land){return this.mesh('cyl',[r,r,h,10],color,x,y,z,p);}
 sphere(r,color,x=0,y=0,z=0,p=this.land){return this.mesh('sphere',[r,10,7],color,x,y,z,p);}
 label(text,x,y,z,width=5,parent=this.land){const cv=document.createElement('canvas');cv.width=512;cv.height=80;const c=cv.getContext('2d');c.fillStyle='#132e39d9';c.fillRect(0,0,512,80);c.fillStyle='#f4e1b1';c.font='600 27px Georgia';c.textAlign='center';c.fillText(text,256,51,480);const texture=new T.CanvasTexture(cv);texture.colorSpace=T.SRGBColorSpace;this.textures.push(texture);const s=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));s.position.set(x,y,z);s.scale.set(width,width/6.4,1);parent.add(s);return s;}
 actor(x,z,{coat=0x637a73,hat=false,dress=false,skin=0xc29a75,soldier=false}={},parent=this.land){
  const g=this.group(x,0,z,parent),root=this.group(0,0,0,g),linen=this.mat(0xd8ceae),cloth=this.mat(coat),dark=this.mat(0x283333),leather=this.mat(0x504231),flesh=this.mat(skin),body=this.group(0,1.18,0,root);
  const contact=this.mesh('plane',[1.3,.7],this.mat(0x182e2c,{map:this.smokeTex,transparent:true,opacity:.35,depthWrite:false}),0,.015,0,g);contact.rotation.x=-Math.PI/2;contact.castShadow=false;
  const torso=this.mesh('cyl',[.23,.28,.65,8],cloth,0,.05,0,body);torso.scale.z=.62;
  this.box(.17,.52,.035,linen,0,.06,-.18,body);this.box(.5,.055,.34,leather,0,-.22,0,body);for(let i=0;i<4;i++)this.sphere(.018,0xbfa06d,.14,.24-i*.12,-.18,body);
  const head=this.group(0,.62,0,body);const face=this.sphere(.18,flesh,0,0,0,head);face.scale.set(.83,1.14,.9);this.sphere(.19,0x3e3328,0,.11,.045,head).scale.set(.87,.55,.9);
  for(const a of [-1,1]){this.sphere(.022,0xe5e0d0,a*.057,.025,-.152,head);this.sphere(.012,0x29332e,a*.057,.024,-.17,head);this.box(.055,.013,.015,0x483b2c,a*.057,.069,-.15,head);}
  this.sphere(.027,flesh,0,-.016,-.175,head).scale.set(.65,1,.7);this.box(.05,.012,.014,0x6a4839,0,-.076,-.163,head);
  if(hat){this.cyl(.29,.035,dark,0,.21,0,head);this.cyl(.17,soldier?.21:.15,dark,0,.30,0,head);}else if(dress){this.sphere(.21,0xd2c5a7,0,.08,.08,head).scale.set(1,.8,.8);}
  const legs=[],arms=[];for(const side of [-1,1]){const l=this.group(side*.13,.88,0,root);this.box(.16,.67,.17,linen,0,-.34,0,l);this.box(.18,.16,.33,leather,0,-.74,-.05,l);legs.push(l);const a=this.group(side*.30,.32,0,body);this.box(.14,.47,.16,cloth,0,-.22,0,a);this.sphere(.072,flesh,0,-.49,0,a);arms.push(a);}
  if(dress){const skirt=this.mesh('cyl',[.23,.46,.84,10],cloth,0,.51,0,root);skirt.scale.z=.75;this.box(.36,.65,.025,linen,0,.56,-.31,root);}
  const carry=this.group(.14,-.13,-.36,body);this.box(.43,.32,.17,0xc2a16d,0,0,0,carry);this.box(.38,.015,.30,0xe2cf9a,0,.18,0,carry);carry.visible=false;
  if(soldier){this.box(.065,.69,.05,0xe2d5b6,-.09,.03,-.2,body).rotation.z=.35;const musket=this.cyl(.026,1.5,0x544332,.38,.50,-.15,g);musket.rotation.x=.16;}
  g.userData={root,body,head,legs,arms,carry};return g;
 }
 animateActor(a,t,{moving=false,sprint=false,work=false,read=false,duck=false,jump=0,speaking=false}={}){const u=a.userData;if(!u.root)return;const s=sprint?1.3:1;u.root.position.y=jump+(moving?Math.abs(Math.sin(t*9))*.07:Math.sin(t*1.5)*.012);u.root.scale.y=duck?.65:1;u.body.rotation.x=work?.12:moving?.07:0;u.head.rotation.y=Math.sin(t*.6)*.035;u.head.rotation.x=read?.18:0;u.arms.forEach((arm,i)=>{arm.rotation.x=work?-.9+Math.sin(t*6+i)*.18:read&&i===1?-.8:moving?-Math.sin(t*9+i*Math.PI)*.55*s:Math.sin(t*1.6)*.025;arm.rotation.z=(i?1:-1)*.08;});u.legs.forEach((l,i)=>l.rotation.x=moving?Math.sin(t*9+i*Math.PI)*.65*s:0);if(speaking)u.head.rotation.z=Math.sin(t*2)*.025;}
 buildEnvironment(){
  const mode=this.mode;
  if(mode==='factory'){this.buildMill();return;}
  if(this.water){this.buildWater();return;}
  const outdoor=mode==='dispatch';this.box(100,.25,150,this.mat(outdoor?0x8f9973:0x96876c,{map:this.ground}),0,-.2,-48);
  this.box(16,.03,145,this.mat(outdoor?0xa19c75:0x9f947e,{map:this.ground}),0,-.035,-47);
  if(outdoor){this.buildBattlefield();return;}
  for(let i=0;i<8;i++)for(const side of [-1,1])this.building(side*(13+rnd(i)*1.6),-i*12,7+rnd(i+4)*3,7+rnd(i+9)*5,10,i%3,mode==='courier');
  for(const side of [-1,1]){this.box(2,.20,140,0xaea78e,side*9,.02,-45);for(let i=0;i<8;i++)this.lamp(side*8.5,-i*15);}
  for(let i=0;i<7;i++){const a=this.actor((i%2?1:-1)*(8.2+rnd(i)*1.3),-5-i*7,{coat:i%2?0x697a74:0x958064,dress:i%3===0,hat:i%3!==0});this.crowd.push(a);}
  if(mode==='courier'){this.label('LOWELL · WORKERS’ MEETING',0,5.8,-42,10);this.building(0,-62,20,12,14,1,true);this.flag(-6,-45,0xb99168);}
  else{this.capitol();this.printingPress(-12,4);this.label('THE UNION · 1850',0,6,-52,10);for(let i=0;i<4;i++)this.newspaper(-10+i*.65,1.15,2+i*.2,this.land);}
 }
 building(x,z,w=8,h=10,d=9,variant=0,mill=false){const g=this.group(x,0,z,this.land),wall=this.mat(mill?0xa47c60:variant===0?0xb9a88d:variant===1?0x966f56:0x7c8e89,{map:this.brick});this.box(w,h,d,wall,0,h/2,0,g);this.box(w+.4,.24,d+.4,0x4d5148,0,h,0,g);
  const rows=Math.max(2,Math.floor(h/2.5)),cols=Math.max(2,Math.floor(w/2));for(let a=0;a<cols;a++)for(let b=0;b<rows;b++){const xx=(a-(cols-1)/2)*1.8,yy=1.5+b*2.4;this.box(.92,1.45,.12,0xd5c8a4,xx,yy,-d/2-.07,g);this.box(.70,1.23,.14,this.mat(0x6e979c,{metalness:.35,roughness:.22}),xx,yy,-d/2-.14,g);this.box(.055,1.3,.17,0xd5c8a4,xx,yy,-d/2-.2,g);this.box(.80,.05,.17,0xd5c8a4,xx,yy,-d/2-.2,g);}
  this.box(1.1,2.3,.18,0x4b493b,0,1.15,-d/2-.2,g);this.cyl(.35,3,0x766550,w*.3,h+1.4,0,g);return g;
 }
 lamp(x,z){this.cyl(.06,3.7,0x455251,x,1.85,z);this.box(.34,.48,.34,0x3b4340,x,3.8,z);this.box(.25,.34,.27,this.mat(0xffd28f,{emissive:0xdb963e,emissiveIntensity:1.8}),x,3.8,z-.05);}
 tree(x,z,s=1,p=this.land,oak=false){const g=this.group(x,0,z,p);this.cyl(.18*s,3*s,0x66553e,0,1.5*s,0,g);if(oak){for(let i=0;i<4;i++)this.sphere(1.5*s,i%2?0x617f61:0x6f8b67,(rnd(i+1)-.5)*1.8*s,3.2*s+rnd(i)*s,(rnd(i+5)-.5)*1.4*s,g);}else{for(let i=0;i<3;i++)this.mesh('cone',[(1.5-i*.26)*s,3*s,7],i%2?0x506f65:0x5b7a69,0,(2.6+i*.9)*s,0,g);}return g;}
 mountains(parent=this.land){for(let i=0;i<7;i++){const x=-40+i*13,h=12+rnd(i)*17,r=12+rnd(i+4)*8;this.mesh('cone',[r,h,5],i%2?0x718890:0x8b9da0,x,h/2,-86-rnd(i+5)*10,parent);const peak=this.mesh('cone',[r*.32,h*.3,5],0xd7dcce,x,h*.87,-86-rnd(i+5)*10,parent);peak.rotation.y=.15;}}
 buildWater(){
  this.scene.fog.density=this.mode==='river'?.011:.015;
  this.waterPlane=this.mesh('plane',[17.5,150,1,1],this.mat(this.mode==='river'?0x3e8295:0x4b8586,{map:this.waterTex,roughness:.2,metalness:.38}),0,-.05,-48);this.waterPlane.rotation.x=-Math.PI/2;this.waterPlane.castShadow=false;
  for(const side of [-1,1]){this.box(30,1,150,this.mat(this.mode==='river'?0x8d9876:0x8c9d78,{map:this.ground}),side*24,-.4,-48);this.box(2,.20,150,0xc2b491,side*10,.13,-48);for(let i=0;i<12;i++)this.tree(side*(18+rnd(i)*13),-i*9,1+rnd(i+2)*.6,this.land,this.mode==='canal');}
  if(this.mode==='river'){this.mountains();for(let i=0;i<16;i++){const b=this.mesh('sphere',[1,6,4],0x8d968a,(i%2?1:-1)*(12+rnd(i)*3),.13,-i*7);b.scale.set(1+rnd(i+3),.6,1.3);}}
  else{for(let i=0;i<5;i++)this.building(-23,-i*23,9,8,12,1);this.bridge(-48);this.label('ERIE CANAL · BUFFALO ↔ ALBANY',0,6,-65,12);this.lock(-72);}
 }
 bridge(z){for(const x of [-14,14])this.box(2,5,5,0xa59c80,x,2,z);this.box(30,.7,4,0x8c7a5d,0,5,z);for(let i=0;i<12;i++)this.box(.12,1.4,.12,0x554b38,-14+i*2.5,6,z-1.8);this.box(29,.13,.13,0x69553c,0,6.7,z-1.8);}
 lock(z){for(const x of [-12,12])this.box(1,3,9,this.mat(0x8e8e7e,{map:this.brick}),x,1.2,z);for(const x of [-6,6]){const g=this.group(x,0,z,this.land);this.box(12,2,.4,this.mat(0x72654a,{map:this.wood}),0,1,0,g);g.rotation.y=x<0?.15:-.15;}this.gameplayLabels.push(this.label('LOCK',0,4,z,5));}
 makeBoat(river,p){const g=this.group(0,.18,0,p),wood=this.mat(river?0x9f7b4f:0x937447,{map:this.wood});const hull=this.mesh('sphere',[1,12,8],wood,0,.2,0,g);hull.scale.set(river?.85:1.3,.47,river?2.7:3.5);this.box(river?1.1:1.8,.15,river?3.9:5.3,0xc3a578,0,.32,0,g);for(const x of [-1,1]){this.box(.12,.35,4.8,0x6e5536,x*(river?.65:.98),.48,0,g);}
  if(river){for(const z of [-1.1,.7])this.box(1.35,.14,.3,0x6a563c,0,.6,z,g);this.paddle=this.group(-.9,1.0,-.3,g);this.cyl(.035,2.6,0x8e6b43,0,-.2,0,this.paddle);this.box(.25,.65,.07,0xae8e58,0,-1.3,0,this.paddle);this.paddle.rotation.z=.7;}
  else{this.box(1.8,1.5,2,0xd0c1a0,0,1.06,1.4,g);this.box(2.05,.16,2.3,0x475b55,0,1.90,1.4,g);for(const x of [-.6,0,.6])this.box(.30,.32,.025,0x385d63,x,1.28,.38,g);this.cyl(.055,3.4,0xb5a278,.8,2.1,.4,g);this.flag(.8,.4,0xd9ca9b,g,3.5);this.box(.08,.10,1.4,0x68523a,0,.75,3.1,g);}
  return g;
 }
 makeHorse(){this.horse=this.group(10.5,.24,0,this.people);this.horseLegs=[];const g=this.horse,brown=this.mat(0x8c6847);this.mesh('sphere',[1,10,7],brown,0,1.25,0,g).scale.set(.48,.65,1.1);const neck=this.box(.45,1.05,.5,brown,0,1.85,-.75,g);neck.rotation.x=.3;this.mesh('sphere',[.38,9,6],brown,0,2.42,-1,g).scale.set(.65,1,1.35);for(const x of [-.18,.18])this.mesh('cone',[.12,.4,4],brown,x,2.8,-1,g);for(const side of [-1,1])for(const z of [-.65,.65]){const l=this.group(side*.3,1.08,z,g);this.box(.13,1.15,.15,brown,0,-.5,0,l);this.horseLegs.push(l);}this.box(.98,.08,.12,0x403e31,0,1.55,-.3,g);this.box(.08,.65,.1,0x403e31,-.5,1.2,-.3,g);this.box(.08,.65,.1,0x403e31,.5,1.2,-.3,g);
  const geometry=new T.BufferGeometry().setFromPoints([V(),V(),V()]);this.towLine=new T.Line(geometry,new T.LineBasicMaterial({color:0xcdbd85}));this.people.add(this.towLine);
 }
 loom(x,z){const g=this.group(x,0,z,this.land),oak=this.mat(0xa28253,{map:this.wood});for(const xx of [-1.1,1.1])for(const zz of [-.8,.8])this.box(.18,2.5,.18,oak,xx,1.25,zz,g);this.box(2.5,.18,1.8,oak,0,1.9,0,g);this.box(2.25,.12,1.45,0xd4c091,0,1.1,0,g);
  for(let i=0;i<13;i++)this.box(.018,1.3,.018,0xe7d5a7,-1+i/6,.99,.25,g);const wheel=this.mesh('torus',[.65,.07,7,16],0xb79d66,1.3,1.05,0,g);wheel.rotation.y=Math.PI/2;this.wheels.push(wheel);for(let i=0;i<4;i++)this.cyl(.16,.30,0xd5be89,-.7+i*.47,2.15,0,g);return g;
 }
 buildMill(){
  this.scene.background.set(0x4e615c);this.scene.fog.color.set(0x63756d);this.scene.fog.density=.017;this.renderer.toneMappingExposure=1.25;
  this.box(30,.25,95,this.mat(0xb19b75,{map:this.wood}),0,-.2,-28);this.box(30,9,.4,this.mat(0xbda17b,{map:this.brick}),0,4.5,-68);
  for(const side of [-1,1]){this.box(.4,9,95,this.mat(0xa68463,{map:this.brick}),side*15,4.5,-28);for(let i=0;i<10;i++){const z=9-i*8;this.box(.5,5,3.4,0xd5cba9,side*14.7,4.2,z);this.box(.56,4.5,2.9,this.mat(0xc4d2be,{emissive:0x819d82,emissiveIntensity:.45,metalness:.2,roughness:.35}),side*14.65,4.2,z);this.box(.60,.09,3,0x687d6a,side*14.6,4.2,z);this.box(.60,4.5,.09,0x687d6a,side*14.6,4.2,z);}}
  for(let i=0;i<9;i++){const z=8-i*9;this.box(30,.3,.28,0x5b5945,0,7,z);for(const x of [-10,10])this.box(.3,7,.3,0x68614a,x,3.5,z);}
  for(let i=0;i<5;i++)for(const side of [-1,1]){this.loom(side*11,-6-i*11);const a=this.actor(side*11,-4-i*11,{dress:true,coat:0x85918b});this.crowd.push(a);}
  for(const x of [-5,0,5]){const station=this.loom(x,-7);station.scale.setScalar(.72);const ring=this.mesh('ring',[1.1,1.18,28],this.mat(0xf3d699,{transparent:true,opacity:.6,side:T.DoubleSide}),x,.02,0);ring.rotation.x=-Math.PI/2;this.gameplayLabels.push(this.label(x<0?'STATION 1':x>0?'STATION 3':'STATION 2',x,3,-9,3.5));}
  for(const x of [-10,0,10]){const axle=this.cyl(.14,60,0x596451,x,6.3,-25);axle.rotation.x=Math.PI/2;for(let i=0;i<5;i++){const wheel=this.mesh('torus',[.65,.08,7,16],0x66776a,x,6.3,-i*11);this.wheels.push(wheel);this.box(.1,4,.12,0x4b4a3b,x,4.3,-i*11);}}
  this.label('LOWELL · THE BELL OWNS THE DAY',0,5.5,-45,10);
 }
 flag(x,z,color=0xd4c49a,parent=this.land,height=5){const g=this.group(x,0,z,parent);this.cyl(.045,height,0xa08c64,0,height/2,0,g);const geom=new T.PlaneGeometry(1.8,1.0,7,3),m=this.mesh('plane',[1,1],this.mat(color,{side:T.DoubleSide}),.94,height-.6,0,g);m.geometry=geom;m.userData.flagBase=Float32Array.from(geom.attributes.position.array);this.flags.push(m);return g;}
 cannon(x,z,p=this.land){const g=this.group(x,0,z,p);this.box(1.1,.3,2,0x78634a,0,.55,0,g);for(const side of [-1,1]){const wheel=this.mesh('torus',[.52,.10,7,16],0x514735,side*.7,.62,.35,g);wheel.rotation.y=Math.PI/2;for(let i=0;i<4;i++){const s=this.box(.10,1,.10,0xa18552,side*.7,.62,.35,g);s.rotation.x=i*Math.PI/4;}}this.cyl(.21,2.3,this.mat(0x334442,{metalness:.6,roughness:.4}),0,1,-.5,g).rotation.x=Math.PI/2;return g;}
 buildBattlefield(){
  this.scene.background.set(0xaebbb4);this.scene.fog.color.set(0xaebbb4);this.scene.fog.density=.018;
  this.box(30,.04,120,this.mat(0x6c9b9c,{metalness:.25,roughness:.3}),-34,-.06,-45);
  for(let i=0;i<14;i++)this.tree((i%2?1:-1)*(19+rnd(i)*16),-i*7,1+rnd(i)*.7,this.land,true);
  for(let i=0;i<4;i++){this.cannon((i%2?1:-1)*12,-15-i*12);this.flag((i%2?1:-1)*14,-18-i*12,i%2?0xe7d9b6:0x8c9b8c);}
  for(let i=0;i<12;i++){const a=this.actor((i%2?1:-1)*(13+rnd(i)*5),-9-i*4,{coat:i%2?0x6f8a83:0xb6b4a0,soldier:true,hat:true});this.crowd.push(a);}
  for(let i=0;i<12;i++){const g=this.group((i%2?1:-1)*(9+rnd(i)*2),0,-i*9,this.land);for(let j=0;j<3;j++)this.box(1.2,.35,.6,0xb9a57a,(j-1)*1.1,.2,0,g);}
  this.smokeClouds=[];for(let i=0;i<12;i++){const s=new T.Sprite(new T.SpriteMaterial({map:this.smokeTex,color:0xb8b4a2,transparent:true,opacity:.3,depthWrite:false}));s.position.set((i%2?1:-1)*12,2+rnd(i)*3,-12-i*5);s.scale.setScalar(4+rnd(i)*5);this.land.add(s);this.smokeClouds.push(s);}
 }
 capitol(){const g=this.group(0,0,-80,this.land);this.box(32,9,12,0xc9c2a9,0,4.5,0,g);this.box(17,10,16,0xd7cfb6,0,5,-2,g);for(let x=-14;x<=14;x+=3)this.cyl(.45,7,0xe0d6bd,x,3.5,7,g);this.box(34,.5,2,0xe0d6bd,0,7.1,7,g);const ped=this.mesh('cone',[8,3,3],0xd2c5a7,0,9,7,g);ped.rotation.z=Math.PI/2;ped.rotation.y=Math.PI/2;const drum=this.cyl(4.3,3,0xc1bfaa,0,11.4,-2,g),dome=this.mesh('sphere',[4.5,16,10,0,Math.PI*2,0,Math.PI/2],0x7e938c,0,12.6,-2,g);dome.scale.y=.54;this.cyl(.25,1.2,0xb8b39e,0,15.2,-2,g);for(let i=0;i<6;i++){this.box(36+i*1.1,.16,17+i*.9,0xb7b296,0,.1-i*.13,0,g);}return g;}
 printingPress(x,z,parent=this.land){const g=this.group(x,0,z,parent);for(const side of [-1,1])this.box(.25,3.5,.3,0x334b4b,side*1.05,1.75,0,g);this.box(2.7,.3,.8,0x334b4b,0,3.5,0,g);this.box(2.7,.25,2,0x786249,0,1.0,0,g);const platen=this.box(2,.2,1.6,0xbfa776,0,1.7,0,g);this.cyl(.12,1.6,0x71817a,0,2.6,0,g);this.box(2.5,.12,.12,0xb29c6c,.6,2.8,0,g).rotation.z=.12;this.moving.push({kind:'press',m:platen,base:1.7});for(const xx of [-.8,.8])for(const zz of [-.65,.65])this.box(.17,1.1,.17,0x786249,xx,.55,zz,g);for(let i=0;i<8;i++)this.newspaper(-1.9,.5+i*.035,.5,g);return g;}
 newspaper(x,y,z,parent=this.land){const g=this.group(x,y,z,parent);this.box(.58,.025,.77,0xe9d6a9,0,0,0,g);for(let i=0;i<4;i++)this.box(.41,.01,.018,0x5f5c49,0,.017,-.22+i*.12,g);return g;}
 buildMap(){
  const g=this.mapStage;this.box(21,.4,14,this.mat(0x71533a,{map:this.wood}),0,.9,-5,g);for(const x of [-9,9])for(const z of [-11,1])this.box(.4,.9,.4,0x615039,x,.45,z,g);this.box(20.3,.07,13.3,0xc3b78b,0,1.15,-5,g);
  const pts=[[-8,-4],[-7,-1],[-5,0],[-4,3],[-1,4],[2,3],[3,1],[5,1],[7,-1],[8,-4],[6,-5],[4,-6],[1,-5],[-2,-6],[-4,-5],[-6,-6]],shape=new T.Shape();pts.forEach(([x,z],i)=>i?shape.lineTo(x,z):shape.moveTo(x,z));shape.closePath();const geometry=new T.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:false}),land=new T.Mesh(geometry,this.mat(0x9d9f73));land.rotation.x=-Math.PI/2;land.position.set(0,1.38,-5);g.add(land);
  this.mapTopics={};this.mapRoutes={};
  const topic=(name,points)=>{const q=this.group(0,0,0,g);q.userData.dynamic=true;this.mapTopics[name]=q;this.mapRoutes[name]=points;if(points.length){const line=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0xffe3a1}));q.add(line);}return q;};
  const marker=(p,x,z,color=0xd8bc78)=>{this.cyl(.15,.45,color,x,1.8,z,p);this.sphere(.18,color,x,2.05,z,p);};
  let p=topic('transport',[V(-1,1.68,-5),V(3,1.68,-4),V(5,1.68,-3)]);this.label('GREAT LAKES',-3,2.5,-6,4.8,p);this.label('BUFFALO',-1,2.1,-5,3,p);this.label('ALBANY',3,2.1,-4,3,p);this.label('HUDSON → ATLANTIC',5,2.1,-2,5.5,p);marker(p,-1,-5);marker(p,3,-4);
  p=topic('industrial',[V(2,1.68,-1),V(4,1.68,-4),V(5,1.68,-7)]);this.label('COTTON GROWN BY ENSLAVED PEOPLE',1,2.8,-.7,10,p);this.label('NORTHERN MILLS',5,2.5,-7,6,p);for(let i=0;i<3;i++){this.box(.8,.6,.7,0x9d7355,4+i*.7,1.8,-7,p);this.cyl(.1,.6,0x6c6a53,4+i*.7,2.4,-7,p);}
  p=topic('expedition',[V(3,1.68,-7),V(1,1.68,-6),V(-1,1.68,-4),V(-5,1.68,-3)]);this.label('PACIFIC',-6,2,-3,3,p);this.label('ST. LOUIS',3,2,-7,3.5,p);this.label('OVER LAND AND WATER',-1,3,-9,7,p);for(let i=0;i<5;i++)this.mesh('cone',[.5,.7+i%2*.4,5],0x798c88,-2.5,1.8,-9+i*1.5,p);
  p=topic('missouri',[V(-4,1.7,-4),V(5,1.7,-4)]);this.label('MAINE · FREE · 1820',6,2.3,-8,5.5,p);this.label('MISSOURI · SLAVE · 1821',2,2.3,-4,6.5,p);this.label('36°30′ · EXCEPT MISSOURI',-1,2.5,-1.6,8,p);marker(p,6,-8,0x8bb4b1);marker(p,2,-4,0xc6a578);
  p=topic('texas',[V(1,1.7,-1),V(3,1.7,-3)]);this.box(2.2,.12,2.0,0xcba86f,1,1.6,-1,p);this.label('TEXAS · REPUBLIC 1836',0,2.5,-.6,7,p);this.label('ANNEXED BY U.S. · 1845',3,2.7,-4,7,p);marker(p,1,-1);
  p=topic('cession',[]);this.box(4,.12,3,0xc8a875,-4,1.6,-3,p);this.label('MEXICAN CESSION · 1848',-3,2.8,-3,8,p);this.label('CALIFORNIA',-6,2.3,-5,4,p);this.label('TEXAS · ANNEXED EARLIER',2.5,2.3,-.5,7.5,p);this.label('NEW MEXICO & UTAH',-1,2.4,-6,6.5,p);
  this.mapRoute=this.mapRoutes[this.chapter===9?'transport':'expedition'];this.mapDot=this.sphere(.16,this.mat(0xffd26f,{emissive:0xe7ab39,emissiveIntensity:1}),0,1.68,-5,g);this.label('SCHEMATIC · NOT TO SCALE',0,3.4,-11,9,g);
 }
 buildAlamo(){const p=this.alamoStage;this.box(100,.18,110,0x9f9c76,0,-.2,-35,p);const g=this.group(0,0,-12,p),stone=this.mat(0xc7ba94,{map:this.brick});this.box(13,7,.9,stone,0,3.5,0,g);for(const x of [-6,6])this.box(1.1,7.7,1.35,0xd0c19b,x,3.85,-.1,g);this.box(15,.5,1.5,0xd1c29a,0,7.25,0,g);for(let i=0;i<8;i++)this.box(1.9,.18+rnd(i)*.35,1.2,0xc7ba94,-6.5+i*1.85,7.5,0,g);this.box(3,4.0,.98,0x706b51,0,2,.03,g);const arch=this.mesh('sphere',[1.5,12,8,0,Math.PI*2,0,Math.PI/2],0x706b51,0,3.4,.57,g);arch.scale.z=.06;this.box(1.1,1.3,1.05,0x75847b,0,5.5,0,g);for(const x of [-13,13])this.box(13,3.2,1.2,stone,x,1.6,-2,g);for(let i=0;i<7;i++){const a=this.actor(-6+i*1.7,-6,{hat:true,soldier:true,coat:0x697e7c},p);a.rotation.y=Math.PI;}
 }
 buildGoldRush(){const p=this.goldStage;this.box(100,.2,120,this.mat(0x9c9e78,{map:this.ground}),0,-.2,-40,p);const creek=this.mesh('plane',[8,100],this.mat(0x5a9294,{roughness:.22,metalness:.3}),-7,-.04,-30,p);creek.rotation.x=-Math.PI/2;this.mountains(p);for(let i=0;i<7;i++)this.tree((i%2?1:-1)*(14+rnd(i)*8),-9-i*7,1.2,p);
  for(let i=0;i<3;i++){const x=4+i*4.5,z=-8-i*6,g=this.group(x,0,z,p);const tent=this.mesh('cone',[2.6,2.8,4],0xc8b995,0,1.4,0,g);tent.rotation.y=Math.PI/4;tent.scale.z=1.4;this.cyl(.08,3.2,0x7c6241,0,1.6,-1.8,g);}
  for(let i=0;i<3;i++){const a=this.actor(-4+rnd(i)*1.3,-3-i*5,{hat:true,coat:i%2?0x8f7c59:0x6c8278},p);a.rotation.y=-1;this.crowd.push(a);const pan=this.cyl(.5,.06,0x737b70,-5,0.3,-3-i*5,p);pan.rotation.z=.15;}
  this.label('CALIFORNIA · 1849',4,4.5,-12,8,p);
 }
 makeEntity(kind){const g=this.group(0,0,0,this.entities),gold=this.mat(0xf5d691,{emissive:0xb88a33,emissiveIntensity:.45}),red=this.mat(0xc46f4c,{emissive:0x8f3b22,emissiveIntensity:.25});
  const pickup=['spool','crate','chart','petition','dispatch','newspaper'].includes(kind);
  if(kind==='spool'){this.cyl(.30,.75,0xd9c99e,0,.75,0,g);for(const y of [.36,1.13])this.cyl(.44,.1,0xb29865,0,y,0,g);}
  else if(kind==='crate'){this.box(1,1,1,0xae8c55,0,.65,0,g);for(const x of [-.4,.4])this.box(.09,1.06,1.06,0x61513b,x,.65,0,g);}
  else if(kind==='chart'||kind==='petition'||kind==='dispatch'||kind==='newspaper'){this.box(.82,.08,1.2,0xf1dfae,0,1.1,0,g).rotation.x=.6;this.cyl(.13,.035,kind==='chart'?0x527c78:0xa25037,.2,1.25,.2,g);}
  else if(kind==='gear'){const ring=this.mesh('torus',[.65,.19,8,12],0x7a785b,0,1,0,g);ring.rotation.x=Math.PI/2;for(let i=0;i<8;i++){const p=this.box(.25,.3,.36,0x9b8e66,Math.sin(i*Math.PI/4)*.79,1,Math.cos(i*Math.PI/4)*.79,g);p.rotation.y=i*Math.PI/4;}g.userData.spin=true;}
  else if(kind==='log'){const log=this.cyl(.43,2.6,this.mat(0x806548,{map:this.wood}),0,.36,0,g);log.rotation.z=Math.PI/2;this.box(.18,.5,.18,0x766042,.4,.6,0,g).rotation.z=-.4;}
  else if(kind==='rock'){const rock=this.mesh('sphere',[1,6,4],0x8b998e,0,.3,0,g);rock.scale.set(1.15,.85,1);}
  else if(kind==='cart'){this.box(1.8,1,2.2,this.mat(0x917247,{map:this.wood}),0,.9,0,g);this.box(1.9,.12,2.3,0xbea576,0,1.5,0,g);for(const side of [-1,1])for(const z of [-.7,.7]){const wheel=this.mesh('torus',[.4,.09,6,12],0x554a36,side,0.5,z,g);wheel.rotation.y=Math.PI/2;}}
  else if(kind==='volley'){const ball=this.sphere(.3,this.mat(0x4f5650,{metalness:.45}),0,.45,0,g);this.box(.10,.10,2,0xdbbb74,0,.42,1,g);g.userData.ball=ball;}
  const ring=this.mesh('ring',[pickup?.78:1.1,pickup?.83:1.2,24],pickup?gold:red,0,.035,0,g);ring.rotation.x=-Math.PI/2;ring.castShadow=false;g.userData.ring=ring;g.userData.pickup=pickup;g.userData.kind=kind;
  if(pickup){const halo=this.mesh('torus',[.7,.028,5,20],gold,0,1.1,0,g);halo.rotation.x=Math.PI/2;g.userData.halo=halo;}
  return g;
 }
 updateEntities(run,t){const active=new Set();for(const e of run.entities||[]){active.add(e.id);let view=this.entityViews.get(e.id);if(!view){const pool=this.entityPools.get(e.kind)||[];view=pool.pop()||this.makeEntity(e.kind);this.entityPools.set(e.kind,pool);this.entityViews.set(e.id,view);}view.visible=true;const h=e.pickup?(this.water?.12:0):0;view.position.copy(at(e.x,e.y,h));if(e.pickup){view.position.y+=Math.sin(t*3+e.id)*.14;view.userData.halo.rotation.z=t*1.4;}if(view.userData.spin)view.rotation.y=t*3;
   view.userData.ring.material.emissiveIntensity=e.pickup?.5:.35+Math.max(0,Math.sin(t*10))*.7;view.userData.ring.scale.setScalar(e.telegraph>0?1.3+Math.sin(t*8)*.15:1);if(e.kind==='volley'){view.position.y=.5+Math.sin(e.x*.02)*.5;view.userData.ball.scale.setScalar(e.telegraph>0?.6:1);}}
  for(const [id,v]of this.entityViews)if(!active.has(id)){v.visible=false;this.entityViews.delete(id);const pool=this.entityPools.get(v.userData.kind)||[];pool.push(v);this.entityPools.set(v.userData.kind,pool);}
 }
 updateEffects(run,t){const effects=run.effects||[];this.effectSprites.forEach((s,i)=>{const e=effects[i];s.visible=!!e;if(!e)return;const p=at(e.x,e.y,1),life=clamp(e.life??.5,0,1);s.position.copy(p);s.position.y+=(1-life)*2;const hit=e.kind==='hit';s.material.color.set(hit?0xe29b78:e.kind==='near-miss'?0xafd6df:0xffdc8e);s.material.opacity=life*.8;s.scale.setScalar((1-life)*2+(hit?1.7:1.1));});}
 update(run={},dt=0,time=0,{view='play',cinema=false,beat=null,beatProgress=0,shot=null}={}){
  if(this.disposed)return;const frameStart=globalThis.performance.now();run=run||{};const t=time||0;this.frame++;
  const movie=cinema||view==='menu',stage=shot?.stage||(cinema&&beat?.shot==='map'?'map':cinema&&String(beat?.speaker||'').startsWith('THE ALAMO')?'alamo':'normal');
  this.land.visible=stage==='normal';this.mapStage.visible=stage==='map';this.alamoStage.visible=stage==='alamo';this.goldStage.visible=stage==='goldrush';this.entities.visible=!movie&&view==='play';
  this.gameplayLabels.forEach(label=>label.visible=!movie&&view==='play');
  this.people.visible=stage!=='map';this.hero.visible=stage!=='map';this.other.visible=cinema&&stage==='normal';
  this.boat&&(this.boat.visible=stage==='normal');this.horse&&(this.horse.visible=stage==='normal');this.towLine&&(this.towLine.visible=stage==='normal');
  const player=run.player||{x:230,y:280};const pp=at(player.x??230,player.y??280,0),dx=pp.x-this.lastPlayer.x,moving=Math.abs(dx)+Math.abs(pp.z-this.lastPlayer.z)>.002;this.lastPlayer.copy(pp);
  if(movie){this.hero.position.set(0,this.water?.7:0,0);this.hero.rotation.y=this.water?0:Math.PI;this.other.position.set(this.water?9:3,this.water?.23:0,this.water?-3:-2);this.other.rotation.y=Math.PI*.8;this.animateActor(this.hero,t,{work:shot?.heroPose==='work'||this.mode==='factory'&&beat?.shot==='action',read:shot?.heroPose==='carry'||shot?.heroPose==='read',moving:shot?.heroPose==='run',sprint:shot?.heroPose==='run',speaking:beat?.focus==='hero'});this.animateActor(this.other,t,{read:shot?.otherPose==='read',speaking:beat?.focus==='other'});}
  else{this.hero.position.copy(pp);this.hero.position.y=this.water?.7:0;this.hero.rotation.y=moving?clamp(dx*.8,-.4,.4):0;this.hero.visible=!run.invulnerable||Math.floor(t*10)%2===0;this.animateActor(this.hero,t,{moving:!this.water&&(moving||this.mode!=='factory'),sprint:(player.dash||0)>0,work:this.mode==='factory'&&(run.actionHeld||run.actionCooldown>.1),duck:player.duck,jump:player.jump||0,read:false});}
  if(this.boat){this.boat.position.copy(movie?V(0,.18,0):pp);this.boat.position.y=.12+Math.sin(t*2.2)*.05;this.boat.rotation.z=Math.sin(t*2)*.025+(player.lean||0)*.28;this.boat.rotation.x=Math.sin(t*1.8)*.012;this.paddle&&(this.paddle.rotation.x=Math.sin(t*(player.boost>0?5:3))*.5);this.wake.forEach((r,i)=>{const progress=((t*(player.boost>0?1:.6)+i/this.wake.length)%1),s=.6+progress*2;r.position.set(this.boat.position.x,.025,this.boat.position.z+2.3+progress*5);r.scale.set(s,1.2+s*.8,1);r.material.opacity=(1-progress)*.28;});}
  if(this.horse){this.horse.position.set(10.5,.24,movie?-3:pp.z-3);this.horseLegs.forEach((l,i)=>l.rotation.x=Math.sin(t*7+i%2*Math.PI)*.45);const start=V(10.1,1.74,this.horse.position.z+.5),end=V(this.boat.position.x+.9,.6,this.boat.position.z+1.5),mid=start.clone().lerp(end,.5);mid.y=.55;const a=this.towLine.geometry.attributes.position;a.setXYZ(0,...start.toArray());a.setXYZ(1,...mid.toArray());a.setXYZ(2,...end.toArray());a.needsUpdate=true;}
  this.wheels.forEach(w=>w.rotation.z=t*1.2);this.moving.forEach(p=>{if(p.kind==='press')p.m.position.y=p.base+Math.sin(t*3)*.18;});this.crowd.forEach((a,i)=>this.animateActor(a,t+i,{moving:this.mode==='dispatch',work:this.mode==='factory'}));
  this.flags.forEach((f,i)=>{const a=f.geometry.attributes.position,b=f.userData.flagBase;for(let k=0;k<a.count;k++){const x=b[k*3];a.setZ(k,Math.sin(t*3.7+x*3+i)*.13*(x+.95));}a.needsUpdate=true;});
  if(this.waterPlane){this.waterTex.offset.y=(t*.012)%1;this.waterTex.offset.x=Math.sin(t*.16)*.015;}
  if(this.smokeClouds)this.smokeClouds.forEach((s,i)=>{s.position.y=2+((t*.3+i*.7)%5);s.position.x=(i%2?1:-1)*12+Math.sin(t*.3+i)*1.4;s.material.opacity=.15+Math.sin(t*.4+i)*.07;});
  if(this.mapDot){const kind=shot?.mapKind||(this.chapter===9?'transport':'expedition');for(const [name,g]of Object.entries(this.mapTopics))g.visible=name===kind;const r=this.mapRoutes[kind]||this.mapRoute;this.mapDot.visible=r.length>1;if(r.length>1){const p=((t*.12)%1)*(r.length-1),i=Math.floor(p);this.mapDot.position.copy(r[i]).lerp(r[Math.min(i+1,r.length-1)],p-i);}}
  this.updateEntities(run,t);this.updateEffects(run,t);
  let position,target,fov=54;
  if(cinema&&shot){position=shot.position;target=shot.target;fov=shot.fov||50;}
  else if(view==='menu'){position=[Math.sin(t*.11)*10+8,6.5,Math.cos(t*.11)*4+12];target=[0,1.5,-7];fov=48;}
  else if(cinema){const close=beat?.shot==='close';position=close?[-2,2.2,3.8]:[11,7,13];target=close?[0,1.4,0]:[0,1,-8];fov=close?44:52;}
  else{const aspect=this.camera.aspect,back=aspect<.9?20:14,up=aspect<.9?10:7.3;position=[pp.x*.3,up,pp.z+back];target=[pp.x*.24,.8,pp.z-17];fov=aspect<.9?61:55;if(this.mode==='factory'){position=[pp.x*.18,4.7,pp.z+15];target=[pp.x*.1,.6,pp.z-17];fov=aspect<.9?64:59;}}
  this.camera.position.set(...position);this.camera.lookAt(...target);if(Math.abs(this.camera.fov-fov)>.01){this.camera.fov=fov;this.camera.updateProjectionMatrix();}
  this.syncActors();this.renderer.render(this.scene,this.camera);this.performance.calls=this.renderer.info.render.calls;this.performance.triangles=this.renderer.info.render.triangles;this.performance.cpuMs=globalThis.performance.now()-frameStart;
 }
 resize(){if(this.disposed)return;const r=this.canvas.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}
 dispose(){if(this.disposed)return;this.disposed=true;const geometries=new Set(this.geometries.values()),materials=new Set(this.materials.values()),textures=new Set(this.textures);this.scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){materials.add(m);for(const k of ['map','normalMap','roughnessMap'])if(m[k])textures.add(m[k]);}});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const t of textures)t.dispose();this.renderer.dispose();this.entityViews.clear();this.entityPools.clear();}
}
