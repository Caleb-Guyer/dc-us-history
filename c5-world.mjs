import * as T from './three.module.js';
import {CAST} from './c5-data.mjs';
import {CinemaDirector} from './c5-cinema.mjs?v=3.2';
import {makeActor,poseActor,tendWound} from './c5-actors.mjs?v=3.2';
const lerp=(a,b,t)=>a+(b-a)*t;
function texture(kind){
 const c=document.createElement('canvas');c.width=c.height=256;const p=c.getContext('2d');let seed=11;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 p.fillStyle=kind==='wood'?'#817365':kind==='snow'?'#c5cbd0':kind==='earth'?'#687266':'#808b8c';p.fillRect(0,0,256,256);
 for(let i=0;i<2400;i++){const n=50+random()*130;p.fillStyle=`rgba(${n},${n},${n},.16)`;p.fillRect(random()*256,random()*256,1+random()*2,kind==='wood'?12:2);}
 p.strokeStyle='#19272b45';p.lineWidth=2;
 if(kind==='wood')for(let x=0;x<256;x+=32){p.beginPath();p.moveTo(x,0);p.lineTo(x,256);p.stroke();}
 if(kind==='stone')for(let y=0;y<256;y+=24)for(let x=-32;x<256;x+=55)p.strokeRect(x+(y%48?25:0),y,55,24);
 const tex=new T.CanvasTexture(c);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.colorSpace=T.SRGBColorSpace;return tex;
}
export class CampaignWorld{
 constructor(canvas,{low=false}={}){
  this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:1.5));this.renderer.shadowMap.enabled=!low;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;
  this.scene=new T.Scene();this.camera=new T.PerspectiveCamera(75,1,.06,220);this.camera.rotation.order='YXZ';this.scene.add(this.camera);this.tex={wood:texture('wood'),stone:texture('stone'),earth:texture('earth'),snow:texture('snow')};this.resize();
 }
 resize(){this.renderer.setSize(innerWidth,innerHeight,false);this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();}
 material(color,extra={}){return new T.MeshStandardMaterial({color,roughness:.88,...extra});}
 box(w,h,d,color,x,y,z,parent=this.scene){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),typeof color==='number'?this.material(color):color);mesh.position.set(x,y,z);mesh.castShadow=h>.3;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 cylinder(top,bottom,h,color,x,y,z,parent=this.scene,sides=10){const mesh=new T.Mesh(new T.CylinderGeometry(top,bottom,h,sides),this.material(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 orb(x,y,z,r,color,parent=this.scene,scale=[1,1,1]){const mesh=new T.Mesh(new T.SphereGeometry(r,14,10),this.material(color));mesh.position.set(x,y,z);mesh.scale.set(...scale);mesh.castShadow=true;parent.add(mesh);return mesh;}
 sign(text,x,y,z,width=3,rotation=0){
  const c=document.createElement('canvas');c.width=512;c.height=160;const p=c.getContext('2d');p.fillStyle='#15252b';p.fillRect(0,0,512,160);p.strokeStyle='#bfa16d';p.lineWidth=7;p.strokeRect(10,10,492,140);p.font='bold 30px Georgia';p.textAlign='center';p.textBaseline='middle';p.fillStyle='#e4d3ac';p.fillText(text,256,80,468);
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(new T.PlaneGeometry(width,width*160/512),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}));mesh.position.set(x,y,z);mesh.rotation.y=rotation;this.scene.add(mesh);return mesh;
 }
 roof(x,y,z,w,d,color){const shape=new T.Shape();shape.moveTo(-w/2,0);shape.lineTo(0,2.5);shape.lineTo(w/2,0);shape.closePath();const roof=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false}),this.material(color));roof.position.set(x,y,z-d/2);roof.castShadow=true;this.scene.add(roof);}
 building(w){
  this.box(w.w,w.h,w.d,this.material(w.x<0?0x7d6a58:0x596768,{map:this.tex.wood}),w.x,w.h/2,w.z);
  this.roof(w.x,w.h,w.z,w.w+.5,w.d+.5,0x293638);this.box(1,2,1,0x4d5454,w.x+2,w.h+2,w.z);
  const side=w.x<0?1:-1;
  for(let y=2;y<w.h-.5;y+=2.4)for(let z=-w.d/2+1.4;z<w.d/2-1;z+=3){
   this.box(.12,1.3,.95,0x202d31,w.x+side*(w.w/2+.02),y,w.z+z);
   this.box(.15,1.08,.73,this.material(0xf1c880,{emissive:0xffb447,emissiveIntensity:.8}),w.x+side*(w.w/2+.06),y,w.z+z);
   this.box(.2,1.15,.05,0x354342,w.x+side*(w.w/2+.12),y,w.z+z);this.box(.2,.07,.8,0x354342,w.x+side*(w.w/2+.12),y,w.z+z);
  }
  for(let y=1;y<w.h;y+=1.1)this.box(w.w+.06,.045,w.d+.06,0x384344,w.x,y,w.z);
  this.box(.2,2.6,1.7,0x2c3535,w.x+side*(w.w/2+.12),1.3,w.z);
 }
 lantern(x,z,blue=false){
  this.cylinder(.055,.07,3.4,0x2a3538,x,1.7,z);this.box(.55,.08,.65,0x28333a,x,3.35,z);
  this.box(.27,.45,.27,this.material(blue?0x7bbbd0:0xf8cf88,{emissive:blue?0x48b7e9:0xffad42,emissiveIntensity:1.7}),x,3.07,z);
  const l=new T.PointLight(blue?0x83d7fb:0xffc47a,12,13,2);l.position.set(x,3,z);this.scene.add(l);
 }
 character(key='WARD',enemy=false){
  const spec=CAST[key]||{color:0x827157},g=new T.Group(),skin=key==='ISAIAH'?0x73503c:0xb99276,coat=enemy?(key==='WARD'?0x555342:0x833b33):spec.color;
  const torso=this.cylinder(.31,.38,.75,coat,0,1.17,0,g,12);torso.scale.z=.65;
  const skirt=this.cylinder(.34,.43,.5,coat,0,.7,0,g,12);skirt.scale.z=.7;
  const hips=this.box(.43,.22,.24,0x353a37,0,.6,0,g);
  const limbs=[];for(const side of [-1,1]){const leg=new T.Group();leg.position.set(side*.15,.62,0);this.cylinder(.075,.08,.48,0x4d4c43,0,-.21,0,leg);this.box(.15,.18,.29,0x242c2c,0,-.51,-.04,leg);g.add(leg);limbs.push(leg);}
  const head=new T.Group();head.position.y=1.72;g.add(head);this.cylinder(.08,.09,.15,skin,0,-.16,0,head);this.orb(0,.035,0,.195,skin,head,[.88,1.12,.87]);
  this.orb(0,.005,-.174,.045,skin,head,[.7,1,1.3]);for(const side of [-1,1]){this.orb(side*.071,.066,-.16,.018,0x152427,head,[1,.55,.5]);this.orb(side*.177,.01,0,.032,skin,head,[.6,1,.6]);}
  this.orb(0,.16,.025,.195,key==='WARD'?0x6b6961:0x382e26,head,[1,.53,.94]);
  if(key==='WARD'||key==='ISAIAH')this.orb(0,-.061,-.09,.13,0x3e3630,head,[1,.48,.6]);
  const jaw=this.box(.07,.014,.012,0x533b32,0,-.037,-.165,head);
  const arms=[];for(const side of [-1,1]){const arm=new T.Group();arm.position.set(side*.36,1.48,0);this.cylinder(.078,.065,.51,coat,0,-.24,0,arm);this.orb(0,-.55,0,.072,skin,arm,[.8,1.15,.7]);arm.rotation.z=side*.1;g.add(arm);arms.push(arm);}
  this.box(.5,.09,.34,key==='ROWAN'?0x973e35:0xb8b09a,0,1.54,0,g);
  const strap=this.box(.07,1.03,.035,0xb29972,.04,1.06,-.24,g);strap.rotation.z=-.5;
  this.box(.3,.31,.13,0x817054,.31,.76,-.21,g);
  if(enemy||key==='WARD'||key==='THOMAS'){const hat=this.cylinder(.27,.34,.085,0x252d2d,0,1.99,0,g,3);hat.rotation.y=.3;this.cylinder(.16,.19,.12,0x29312e,0,2.05,0,g);}
  if(key==='MARA'){this.box(.55,.22,.35,0x345d6d,0,1.42,.07,g);this.cylinder(.2,.42,.8,coat,0,.49,0,g,12);}
  if(enemy){const gun=this.box(.06,.07,1.02,0x68523a,.4,1.04,-.36,g);this.box(.036,.035,1.05,0x748386,.4,1.09,-.4,g);}
  g.userData={limbs,arms,head,jaw,key};return g;
 }
 load(m,state){
  if(this.film){this.film.dispose();this.film=null;}
  const geometries=new Set(),materials=new Set();this.scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(v=>materials.add(v));});geometries.forEach(g=>g.dispose());materials.forEach(v=>{if(v.map&&!Object.values(this.tex).includes(v.map))v.map.dispose();v.dispose();});
  this.scene.clear();this.camera.clear();this.scene.add(this.camera);this.m=m;this.fires=[];this.actors=[];this.enemyModels=[];this.objectModels=[];this.crowds=[];this.splinters=[];
  const night=['city','ship','fire','harbor'].includes(m.theme),fog=m.theme==='snow'?0x697c88:night?0x142832:0x6c8583;
  this.scene.background=new T.Color(fog);this.scene.fog=new T.FogExp2(fog,m.theme==='forest'?.014:.009);
  this.scene.add(new T.HemisphereLight(night?0x9bbfd1:0xcfe2ed,0x313428,night?1.3:1.6));
  const moon=new T.DirectionalLight(night?0xabc6e5:0xffdfaf,night?2:3);moon.position.set(-30,45,-35);moon.castShadow=true;moon.shadow.mapSize.set(1536,1536);Object.assign(moon.shadow.camera,{left:-45,right:45,top:50,bottom:-50,near:1,far:125});moon.shadow.bias=-.0003;this.scene.add(moon);
  const earth=m.theme==='snow'?this.tex.snow:m.theme==='forest'?this.tex.earth:this.tex.stone;earth.repeat.set(35,45);this.box(160,.2,180,this.material(m.theme==='snow'?0xa2b5c1:0x66706a,{map:earth}),0,-.14,-8);
  this.box(17,.025,88,this.material(m.theme==='snow'?0x8f9faa:0x667679,{map:earth,roughness:.55}),0,.001,-4);
  if(m.theme==='ship')this.ship();
  for(const w of state.walls){if(w.h>3)this.building(w);else if(m.theme==='forest'){for(let i=0;i<3;i++){const rock=new T.Mesh(new T.IcosahedronGeometry(1,1),this.material(i%2?0x718077:0x8a9284));rock.scale.set(w.w*.25,w.h*(.65+i*.05),w.d*.55);rock.position.set(w.x+(i-1)*w.w*.25,w.h*.38,w.z);rock.rotation.y=i*.4;rock.castShadow=rock.receiveShadow=true;this.scene.add(rock);}}else{this.box(w.w,w.h,w.d,this.material(0x8f7150,{map:this.tex.wood}),w.x,w.h/2,w.z);for(let x=-w.w/2+.3;x<w.w/2;x+=1.2)this.box(.07,w.h+.03,w.d+.04,0x3e453e,w.x+x,w.h/2,w.z);}}
  if(m.theme==='forest'){
   for(let i=0;i<88;i++){const x=(i%2?-1:1)*(17+(i*7.3)%30),z=-65+(i*13.7)%130,h=7+i%5;this.cylinder(.12,.38,h,0x4b5143,x,h/2,z);for(let j=0;j<3;j++){const mesh=new T.Mesh(new T.ConeGeometry(3-j*.55,4.5,8),this.material(i%2?0x294a3b:0x3a5545));mesh.position.set(x,h-1+j*1.7,z);mesh.castShadow=true;this.scene.add(mesh);}}
   this.sign('PROCLAMATION · 1763',10,2.5,1,4);this.box(37,.025,.24,0xcdba82,0,.06,0);
   const grass=new T.InstancedMesh(new T.ConeGeometry(.14,.5,3),this.material(0x536c46),400);const transform=new T.Object3D();for(let i=0;i<400;i++){transform.position.set(Math.sin(i*23.71)*26,.16,Math.cos(i*71.17)*44);transform.rotation.y=i;transform.scale.setScalar(.5+(i%8)*.12);transform.updateMatrix();grass.setMatrixAt(i,transform.matrix);}this.scene.add(grass);
  }else if(m.theme!=='ship'){
   for(let i=0;i<10;i++){const x=i%2?-15:15,z=-33+i*7;this.cylinder(.36,.4,1,0x726148,x,.5,z);this.cylinder(.39,.39,.06,0x29363b,x,.25,z);this.cylinder(.39,.39,.06,0x29363b,x,.76,z);}
   for(const [x,z]of[[-15,26],[15,11],[-15,-8],[15,-30]])this.lantern(x,z);
   this.sign(m.id==='ink'?'VALE · PRINT & PAPER':m.id==='kingstreet'?'KING STREET':'BOSTON',0,4,-39,6);
   for(let i=0;i<8;i++)this.building({x:(i%2?1:-1)*(35+(i%3)*9),z:-38+i*12,w:8,h:7+i%4*2,d:9});
   if(m.theme==='snow')this.lantern(0,31,true);
  }
  if(m.theme==='fire')for(const [x,z]of[[-22,21],[23,18],[-24,-28]]){
   for(let i=0;i<5;i++){const flame=new T.Mesh(new T.ConeGeometry(.8,4+i*.4,7),this.material(i%2?0xffae39:0xd84c20,{emissive:0xff671b,emissiveIntensity:2,transparent:true,opacity:.8}));flame.position.set(x-2+i,6,z+Math.sin(i)*3);this.scene.add(flame);this.fires.push(flame);}
   const l=new T.PointLight(0xff782d,95,30);l.position.set(x,6,z);this.scene.add(l);
  }
  m.goals.forEach((goal,i)=>{
   const g=new T.Group();g.position.set(goal.x,0,goal.z);this.scene.add(g);
   if(goal.kind==='rescue'){const person=this.character('BYSTANDER');person.rotation.z=Math.PI/2;person.position.y=.35;g.add(person);}
   else if(goal.kind==='shelter'){this.box(3,.1,2.6,0x789aaa,0,.05,0,g);}
   else if(goal.kind==='tea'){this.box(1.3,1.1,1.15,0x7c633f,0,.55,0,g);this.box(1.1,.08,.85,0xb29e79,0,1.14,0,g);this.box(.12,1.16,1.18,0x31433f,.35,.57,0,g);}
   else if(goal.kind==='press'){this.box(1.4,1,1,0x443b2c,0,.5,0,g);this.cylinder(.07,.07,2.1,0x917756,0,1.1,0,g);this.box(2.2,.12,.18,0xb4945f,0,1.8,0,g);}
   else {this.box(.7,.8,.7,0x687261,0,.4,0,g);this.box(.5,.035,.34,0xe1d2a6,0,.83,0,g);}
   this.objectModels.push(g);
  });
  state.enemies.forEach(e=>{const g=this.character(m.theme==='forest'?'WARD':'THOMAS',true);g.position.set(e.x,0,e.z);this.scene.add(g);this.enemyModels.push(g);
   const cone=new T.Mesh(new T.ConeGeometry(3,10,24,1,true),new T.MeshBasicMaterial({color:0xf6c77c,transparent:true,opacity:.09,depthWrite:false,side:T.DoubleSide}));cone.rotation.x=-Math.PI/2;cone.position.set(0,1,-5);g.add(cone);g.userData.cone=cone;
  });
  if(m.mode==='rescue')for(let i=0;i<5;i++){const crowd=new T.Group();for(let j=0;j<3;j++){const p=this.character('BYSTANDER');p.position.x=(j-1)*.8;crowd.add(p);}this.scene.add(crowd);this.crowds.push(crowd);}
  this.marker=new T.Group();const ring=new T.Mesh(new T.RingGeometry(.48,.59,40),new T.MeshBasicMaterial({color:0xeac789,side:T.DoubleSide,transparent:true,opacity:.85}));ring.rotation.x=-Math.PI/2;ring.position.y=.08;this.marker.add(ring);const diamond=this.orb(0,2.6,0,.1,0xfce0a0,this.marker);diamond.scale.set(.6,1,.6);this.scene.add(this.marker);
  // The complete recurring cast is present for real-time conversation shots.
  (m.cast||['ROWAN','MARA']).forEach((key,i)=>{const actor=m.id==='kingstreet'?makeActor(key):this.character(key);actor.position.set((i-((m.cast?.length||2)-1)/2)*2.1,0,27+(i%2)*.35);actor.rotation.y=Math.PI+(i%2?.3:-.35);actor.userData.stage=actor.position.clone();this.scene.add(actor);this.actors.push(actor);});
  const faceLight=new T.PointLight(0xf5d6a6,32,19,2);faceLight.position.set(0,3.7,33);this.scene.add(faceLight);
  this.weapon=new T.Group();this.camera.add(this.weapon);
  this.box(.13,.3,.16,0x305160,.32,-.39,-.33,this.weapon);this.orb(.26,-.28,-.5,.085,0xb98e71,this.weapon,[.8,.7,1.3]);
  if(m.armed){this.box(.075,.08,.95,0x73563a,.2,-.22,-.65,this.weapon);const barrel=this.cylinder(.019,.026,1.12,0x819095,.2,-.17,-.7,this.weapon,12);barrel.rotation.x=Math.PI/2;this.box(.09,.18,.36,0x4f392a,.21,-.28,-.25,this.weapon);this.flash=new T.Mesh(new T.ConeGeometry(.13,.65,7),new T.MeshBasicMaterial({color:0xffdc83}));this.flash.rotation.x=-Math.PI/2;this.flash.position.set(.2,-.17,-1.33);this.weapon.add(this.flash);}
  else{this.box(.25,.025,.33,0xd6cba6,.25,-.19,-.54,this.weapon);this.orb(.25,-.166,-.52,.026,0x923b35,this.weapon);this.flash=null;}
  const count=m.theme==='snow'?380:200,positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=Math.sin(i*132.3)*35;positions[i*3+1]=(i*3.74)%19;positions[i*3+2]=Math.cos(i*89.5)*50;}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(positions,3));this.weather=new T.Points(geo,new T.PointsMaterial({color:m.theme==='fire'?0xffba65:0xb5c5d0,size:m.theme==='snow'?.10:.035,transparent:true,opacity:m.theme==='forest'?.25:.45,depthWrite:false}));this.scene.add(this.weather);
 }
 ship(){
  this.box(120,.05,170,this.material(0x244a5c,{metalness:.45,roughness:.28}),0,-.3,-5);
  this.box(22,.6,74,this.material(0x776b52,{map:this.tex.wood}),0,-.05,-4);
  for(const x of [-11,11]){this.box(.3,1.4,74,0x493f31,x,.6,-4);for(let z=-39;z<33;z+=3)this.box(.25,1.6,.25,0x62503a,x,.8,z);}
  for(const z of [-24,0,20]){this.cylinder(.19,.3,16,0x6e5840,0,8,z);this.box(14,.2,.18,0x665138,0,12,z);const sail=this.box(10,6,.04,this.material(0xb8baaa,{side:T.DoubleSide}),0,8,z+.1);sail.rotation.x=.08;}
  for(const z of [-26,-8,13])this.lantern(9,z);
  // Neighboring ships and shore silhouettes make the deck feel like a harbor.
  for(const x of [-27,28]){this.box(11,2,53,0x283e43,x,-.1,-7);for(const z of [-20,3]){this.cylinder(.15,.24,18,0x3d4b48,x,9,z);this.box(12,.16,.14,0x596664,x,14,z);this.box(9,6,.04,0x607783,x,10,z);}}
 }
 animatePerson(g,t,moving,talking=false){const u=g.userData;u.limbs?.forEach((p,i)=>p.rotation.x=moving?Math.sin(t*8+i*Math.PI)*.38:0);u.arms?.forEach((p,i)=>{p.rotation.x=moving?-Math.sin(t*8+i*Math.PI)*.2:talking?Math.sin(t*3+i)*.12:Math.sin(t+i)*.018;});if(u.head)u.head.rotation.y=Math.sin(t*.45)*.035;if(u.jaw)u.jaw.scale.y=talking?1+Math.abs(Math.sin(t*15))*3:1;}
 atmosphere(t,dt){this.fires.forEach((f,i)=>{f.scale.y=1+Math.sin(t*5+i)*.17;f.scale.x=1+Math.sin(t*8+i)*.1;});if(this.weather){const a=this.weather.geometry.attributes.position.array;for(let i=0;i<a.length;i+=3){a[i+1]+=dt*(this.m.theme==='fire'?1.8:-2.3);if(a[i+1]<0)a[i+1]=20;if(a[i+1]>21)a[i+1]=0;}this.weather.geometry.attributes.position.needsUpdate=true;}}
 cinematic(frame,dt){this.film??=new CinemaDirector(this.renderer,this.tex);return this.film.render(frame,dt);}
 render(s,input,dt){
  const p=s.player,t=s.time;this.actors.forEach(g=>{const key=g.userData.key;g.visible=key!=='ROWAN';let spot;
   if(this.m.id==='line'&&key==='WARD')spot=[s.escort.x,s.escort.z];
   if(this.m.id==='ink')spot=key==='ISAIAH'?[-14,18]:[12,-31];
   if(this.m.id==='kingstreet')spot=key==='MARA'?[-2.22,27.07]:[-3,27];
   if(this.m.id==='tea')spot=key==='ISAIAH'?[-3,20]:s.stage>=4?[3,25]:null;
   if(this.m.id==='dispatch')spot=key==='WARD'?[-12,-12]:key==='THOMAS'?[9,-35]:s.stage>=2?[12,5]:null;
   if(spot&&key!=='ROWAN'){g.position.set(spot[0],this.m.id==='line'?s.escort.y:0,spot[1]);g.visible=Math.hypot(p.x-spot[0],p.z-spot[1])>1.1;
    if(this.m.id==='kingstreet'){g.rotation.y=key==='ISAIAH'?2.85:Math.PI/2;poseActor(g,{time:t,pose:key==='ISAIAH'?'recover':'tend',injury:key==='ISAIAH',bandaged:key==='ISAIAH',mood:'sad'});}
    else {g.rotation.y=this.m.id==='line'?s.escort.yaw:Math.atan2(-(p.x-spot[0]),-(p.z-spot[1]));this.animatePerson(g,t,this.m.id==='line'&&s.escort.moving);}
   }else g.visible=false;
  });if(this.m.id==='kingstreet')tendWound(this.actors.find(g=>g.userData.key==='MARA'),this.actors.find(g=>g.userData.key==='ISAIAH'));this.weapon.visible=true;
  const moving=input.forward||input.back||input.left||input.right,bob=moving?Math.sin(t*(input.sprint?14:9))*.033:0;
  this.camera.position.set(p.x,1.74+p.y-(input.crouch?.55:0)+bob,p.z);this.camera.rotation.set(p.pitch+(s.shot>0?s.shot*.08:0),p.yaw,moving&&input.sprint?Math.sin(t*7)*.008:0);
  const fov=input.aim?56:input.sprint?84:75;this.camera.fov=lerp(this.camera.fov,fov,Math.min(1,dt*9));this.camera.updateProjectionMatrix();
  this.weapon.position.set(moving?Math.sin(t*7)*.014:0,s.reload>0?-.2*Math.sin(s.reload/1.65*Math.PI):0,s.shot*.4);this.weapon.rotation.z=s.reload>0?-.35*Math.sin(s.reload/1.65*Math.PI):0;if(this.flash)this.flash.visible=s.shot>.12;
  this.enemyModels.forEach((g,i)=>{const e=s.enemies[i];g.visible=e.hp>0||e.dead<.7;g.position.set(e.x,e.hp<=0?-e.dead*.2:0,e.z);g.rotation.set(0,e.angle,e.hp<=0?Math.min(Math.PI/2,e.dead*3):0);g.userData.cone.visible=e.hp>0&&!this.m.armed;g.userData.cone.material.opacity=e.alert>.5?.15:.065;this.animatePerson(g,t+i,e.hp>0);});
  this.crowds.forEach((g,i)=>{g.position.set(Math.sin(t*.56+i*1.7)*17,0,19-i*8);g.rotation.y=Math.cos(t*.56+i*1.7)>0?-Math.PI/2:Math.PI/2;g.children.forEach(p=>this.animatePerson(p,t+i,true));});
  this.objectModels.forEach((g,i)=>g.visible=i>=s.stage||this.m.goals[i].kind==='shelter');
  const goal=this.m.goals[s.stage];this.marker.visible=!!goal;if(goal){this.marker.position.set(goal.x,.02,goal.z);this.marker.children[1].position.y=2.6+Math.sin(t*2)*.12;}
  this.atmosphere(t,dt);this.renderer.render(this.scene,this.camera);
 }
}
