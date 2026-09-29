import * as T from './three.module.js';
import {makeActor,poseActor,disposeTree} from './c5-actors.mjs?v=3.2';
import {BLOCKS,currentGoal} from './c6-sim.mjs';
const V=(x,y,z)=>new T.Vector3(x,y,z),mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>(t=Math.max(0,Math.min(1,t)))*t*(3-2*t);
const rand=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};

export class OpeningWorld{
 constructor(canvas){
  this.canvas=canvas;this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
  this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.14;
  this.camera=new T.PerspectiveCamera(70,1,.055,210);this.camera.rotation.order='YXZ';this.level=null;this.materials=new Map();this.moving=[];this.clock=0;
  this.groundTexture=this.texture('ground');this.woodTexture=this.texture('wood');this.smokeTexture=this.texture('smoke');this.stoneTexture=this.texture('stone');this.resize();
 }
 texture(kind){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
  if(kind==='stone'){x.fillStyle='#554f47';x.fillRect(0,0,256,256);for(let yy=0;yy<8;yy++)for(let xx=-1;xx<5;xx++){const tone=115+Math.floor(rand(yy*10+xx)*35);x.fillStyle=`rgb(${tone},${tone+3},${tone-4})`;x.fillRect(xx*64+(yy%2)*32+2,yy*32+2,60,28);}for(let i=0;i<3500;i++){x.fillStyle=`rgba(10,20,17,${rand(i+8)*.15})`;x.fillRect(rand(i+1)*256,rand(i+7)*256,2,1);}}
  else if(kind==='smoke'){const g=x.createRadialGradient(128,128,6,128,128,125);g.addColorStop(0,'rgba(220,224,212,.46)');g.addColorStop(.35,'rgba(209,212,204,.25)');g.addColorStop(1,'rgba(190,201,202,0)');x.fillStyle=g;x.fillRect(0,0,256,256);}
  else{x.fillStyle=kind==='ground'?'#b3ac91':'#8b7660';x.fillRect(0,0,256,256);for(let i=0;i<4500;i++){const a=rand(i+3),b=rand(i+19);x.fillStyle=`rgba(${kind==='ground'?'43,54,36':'47,29,14'},${rand(i+11)*.16})`;x.fillRect(a*256,b*256,kind==='wood'?1:2,kind==='wood'?rand(i+7)*45:2);}if(kind==='wood'){x.strokeStyle='#5c4b3d';for(let i=0;i<8;i++){x.beginPath();x.moveTo(i*32,0);x.lineTo(i*32,256);x.stroke();}}}
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;if(kind!=='smoke'){texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(kind==='ground'?40:kind==='stone'?4:2,kind==='ground'?60:2);texture.anisotropy=4;}return texture;
 }
 mat(color,extra={}){if(Object.keys(extra).length)return new T.MeshStandardMaterial({color,roughness:.87,...extra});if(!this.materials.has(color))this.materials.set(color,new T.MeshStandardMaterial({color,roughness:.87}));return this.materials.get(color);}
 mesh(geometry,color,x=0,y=0,z=0,parent=this.scene){const m=new T.Mesh(geometry,typeof color==='number'?this.mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 box(w,h,d,c,x,y,z,p){return this.mesh(new T.BoxGeometry(w,h,d),c,x,y,z,p);}
 cyl(r,h,c,x,y,z,p){return this.mesh(new T.CylinderGeometry(r,r,h,10),c,x,y,z,p);}
 sphere(r,c,x,y,z,p,scale=[1,1,1]){const m=this.mesh(new T.SphereGeometry(r,12,8),c,x,y,z,p);m.scale.set(...scale);return m;}
 group(x=0,y=0,z=0){const g=new T.Group();g.position.set(x,y,z);this.scene.add(g);return g;}
 resize(){const w=innerWidth,h=innerHeight;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}
 label(text,x,y,z,width=2,rotation=0){const c=document.createElement('canvas');c.width=768;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#c5b797';ctx.fillRect(0,0,768,256);ctx.strokeStyle='#514a3d';ctx.lineWidth=4;ctx.strokeRect(14,14,740,228);ctx.fillStyle='#333b34';ctx.textAlign='center';ctx.font='bold 60px Georgia';text.split('|').forEach((s,i,a)=>ctx.fillText(s,384,130+(i-(a.length-1)/2)*68,700));const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const obj=this.mesh(new T.PlaneGeometry(width,width/3),this.mat(0xffffff,{map:tex}),x,y,z);obj.rotation.y=rotation;return obj;}
 house(x,z,w=7,d=9,h=5,tone=0x73746c){
  this.box(w,h,d,this.mat(tone,{map:this.woodTexture}),x,h/2,z);this.box(w+.25,.18,d+.3,0xaaa294,x,h,z);
  const shape=new T.Shape();shape.moveTo(-w/2,0);shape.lineTo(0,h*.48);shape.lineTo(w/2,0);shape.closePath();const roof=new T.ExtrudeGeometry(shape,{depth:d+.6,bevelEnabled:false});this.mesh(roof,0x343d3c,x,h,z-d/2-.3);
  this.box(.8,2,.8,0x6e5448,x+w*.27,h+1,z-1);
  for(const dx of [-w*.3,w*.3])for(const dy of [1.8,h>5?4.4:1.8]){
   this.box(1.08,1.55,.16,0x343b37,x+dx,dy,z+d/2+.03);
   this.box(.88,1.32,.17,this.mat(0xd3a669,{emissive:0xeeb65c,emissiveIntensity:this.night?.55:.13}),x+dx,dy,z+d/2+.06);
   this.box(.055,1.4,.21,0x454b43,x+dx,dy,z+d/2+.12);this.box(.94,.055,.21,0x454b43,x+dx,dy,z+d/2+.12);
  }
  this.box(1.25,2.25,.16,0x333d37,x,1.13,z+d/2+.1);this.box(1.45,.15,.6,0x8a8676,x,.08,z+d/2+.3);
  for(let yy=1;yy<h;yy+=.7)this.box(w+.02,.025,d+.02,0x656b62,x,yy,z);
 }
 lantern(x,y,z,light=true){const g=this.group(x,y,z);this.box(.2,.3,.2,this.mat(0xffd59a,{emissive:0xffba50,emissiveIntensity:2}),0,0,0,g);this.box(.3,.05,.3,0x34332a,0,.18,0,g);this.box(.27,.045,.27,0x34332a,0,-.18,0,g);for(const dx of [-.11,.11])this.box(.02,.4,.22,0x34332a,dx,0,0,g);if(light){const l=new T.PointLight(0xffc178,13,11,2);g.add(l);}return g;}
 wagon(x,z){const g=this.group(x,0,z);this.box(2.3,.18,3.3,0x716047,0,.9,0,g);for(const xx of [-1.1,1.1])this.box(.1,.65,3.3,0x8c7552,xx,1.2,0,g);this.box(2.3,.6,.1,0x8c7552,0,1.2,1.6,g);this.box(1.5,.13,2.2,0x9b9879,0,1.05,.3,g);
  for(const xx of [-1.3,1.3])for(const zz of [-1.1,1.1]){const wheel=this.mesh(new T.TorusGeometry(.65,.08,6,16),0x3a342b,xx,.68,zz,g);wheel.rotation.y=Math.PI/2;for(let i=0;i<4;i++){const spoke=this.box(.065,1.2,.045,0x8b7755,xx,.68,zz,g);spoke.rotation.x=i*Math.PI/4;}}
  for(const xx of [-.75,.75])this.box(.085,.08,2.5,0x736043,xx,.6,-2.7,g);return g;
 }
 trees(count,level){
  const trunk=new T.InstancedMesh(new T.CylinderGeometry(.12,.25,5,6),this.mat(0x514d3e),count),leaves=new T.InstancedMesh(new T.ConeGeometry(2.5,7,7),this.mat(level==='night'?0x344e46:0x536649),count);const matrix=new T.Matrix4(),q=new T.Quaternion();
  for(let i=0;i<count;i++){const x=(i%2?-1:1)*(level==='night'?18+rand(i+2)*30:25+rand(i+2)*55),z=level==='night'?25-rand(i+12)*175:45-rand(i+12)*145,scale=.6+rand(i+90)*.9;matrix.compose(V(x,2.4*scale,z),q,V(scale,scale,scale));trunk.setMatrixAt(i,matrix);matrix.compose(V(x,6.1*scale,z),q,V(scale,scale,scale));leaves.setMatrixAt(i,matrix);}
  trunk.castShadow=leaves.castShadow=true;this.scene.add(trunk,leaves);
  const bare=new T.InstancedMesh(new T.CylinderGeometry(.10,.24,7,6),this.mat(0x5d594c),20),branches=new T.InstancedMesh(new T.CylinderGeometry(.025,.075,2.7,5),this.mat(0x5d594c),60);
  for(let i=0;i<20;i++){const x=(i%2?-1:1)*(15+rand(i+2)*9),z=17-Math.floor(i/2)*14;matrix.compose(V(x,3.4,z),q,V(1,1,1));bare.setMatrixAt(i,matrix);
   for(let j=0;j<3;j++){const a=i*2.4+j*2.1,dir=V(Math.sin(a)*.75,.75,Math.cos(a)*.75).normalize(),rot=new T.Quaternion().setFromUnitVectors(V(0,1,0),dir);matrix.compose(V(x+dir.x*1.3,3.8+j*.7+dir.y*1.3,z+dir.z*1.3),rot,V(1,1,1));branches.setMatrixAt(i*3+j,matrix);}}
  this.scene.add(bare,branches);
 }
 soldier(red=false){const g=new T.Group(),skin=red?0xc6a17d:0xb49776,coat=red?0x973e32:0x566e72;
  this.box(.45,.6,.28,coat,0,1.08,0,g);this.box(.22,.49,.31,0xccbf9c,0,1.09,-.015,g);this.sphere(.17,skin,0,1.61,0,g,[.85,1.1,.9]);const hat=this.mesh(new T.CylinderGeometry(.23,.28,.07,3),0x303632,0,1.84,0,g);hat.rotation.y=Math.PI/2;
  g.userData.legs=[-.12,.12].map(x=>this.box(.14,.65,.17,0x898c7c,x,.45,0,g));g.userData.arms=[-.31,.31].map(x=>this.box(.14,.54,.17,coat,x,1.05,-.05,g));
  const gun=this.box(.045,.055,1.28,0x56452e,.29,1.22,-.54,g);this.box(.02,.02,1.4,0x84908c,.29,1.26,-.57,g);g.userData.gun=gun;
  g.userData.flash=this.mesh(new T.ConeGeometry(.13,.7,6),new T.MeshBasicMaterial({color:0xffd29a}),.29,1.25,-1.36,g);g.userData.flash.rotation.x=-Math.PI/2;g.userData.flash.visible=false;this.scene.add(g);return g;
 }
 actor(key,x,z,yaw=0){const g=makeActor(key);g.position.set(x,0,z);g.rotation.y=yaw;this.scene.add(g);this.cast[key]=g;return g;}
 load(level){
  if(level===this.level)return;this.level=level;if(this.scene)disposeTree(this.scene,[this.groundTexture,this.woodTexture,this.smokeTexture,this.stoneTexture]);this.camera.clear();this.materials.clear();this.cast={};this.enemies=[];this.extras=[];this.effects=[];this.practicals=[];this.moving=[];this.bell=null;this.casualties=null;
  this.night=level==='night';this.scene=new T.Scene();this.scene.background=new T.Color(this.night?0x223b4b:level==='release'?0x899ea4:0xafbbc0);this.scene.fog=new T.FogExp2(this.night?0x263d46:0xafb8b8,this.night?.012:.008);
  this.scene.add(new T.HemisphereLight(this.night?0xa3c9eb:0xe7e9d9,0x4d5847,this.night?1.5:2));
  const sun=new T.DirectionalLight(this.night?0x9cbfdf:0xffe2b0,this.night?1.8:2.5);sun.position.set(-23,35,-28);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=sun.shadow.camera.bottom=-35;sun.shadow.camera.right=sun.shadow.camera.top=35;sun.shadow.camera.far=110;sun.shadow.bias=-.0005;this.scene.add(sun);this.sun=sun;
  this.box(250,.2,300,this.mat(this.night?0x5d6e5c:0x8d9871,{map:this.groundTexture}),0,-.15,-55);
  const path=this.box(level==='night'?5:9,.03,level==='night'?165:160,this.mat(0xa69779,{map:this.groundTexture}),0,-.035,-40);path.receiveShadow=true;
  this.trees(level==='night'?145:95,level);
  if(this.night){this.mesh(new T.SphereGeometry(2.8,20,12),new T.MeshBasicMaterial({color:0xf3e1b9}),-39,49,-105);}
  for(const b of BLOCKS[level]||[]){const [x,z,w,d,h]=b;if(h>2){if(level!=='release')this.house(x,z,w,d,h,[0x747d70,0x858174,0x687976][Math.abs(Math.round(x))%3]);else{this.box(w,h,d,this.mat(0xa4aaa1,{map:this.stoneTexture}),x,h/2,z);this.box(w+.22,.2,d+.22,0x8d9286,x,h,z);}}else{
   if(level==='concord'||level==='lexington'){
    this.box(w,h*.92,d,this.mat(0xa4a89b,{map:this.stoneTexture}),x,h*.46,z);
    const count=Math.ceil(Math.max(w,d)/.75),stones=new T.InstancedMesh(new T.DodecahedronGeometry(.46,0),this.mat(0x8c9080),count),matrix=new T.Matrix4();
    for(let j=0;j<count;j++){const along=(j+.5)/count-.5;matrix.compose(V(x+(w>d?along*w:0),h-.14,z+(d>w?along*d:0)),new T.Quaternion().setFromEuler(new T.Euler(j*.6,j,0)),V(w>d?1:.65,.46,w>d?.7:1));stones.setMatrixAt(j,matrix);}stones.castShadow=true;this.scene.add(stones);
   }else{for(const yy of [.45,.95])this.box(w,.17,d,0x796c50,x,yy,z);for(let xx=-w/2+.1;xx<=w/2;xx+=1.7)this.box(.16,h+.1,.22,0x655b45,x+xx,h/2,z);}
  }}
  if(level==='release'){
   this.box(3,4,.3,0x262f2c,0,2,-8.3);this.door=this.group(-1.4,0,-8);this.box(2.8,3.7,.14,0x564b37,1.4,1.85,0,this.door);for(let xx=0;xx<2.8;xx+=.45)this.box(.045,3.6,.17,0x292e26,xx,1.85,0,this.door);
   this.label('PROVOST GUARD',0,4.5,-8,4);for(let i=0;i<3;i++)this.box(4,.16,.8,0x989586,0,.08+(2-i)*.16,-7+i*.7);
   for(const side of [-1,1])for(const y of [2,4.8])for(const z of [-6,-2]){this.box(.07,1.4,1.15,0x273834,side*3.46,y,z);for(const dz of [-.38,0,.38])this.box(.09,1.45,.04,0x626b62,side*3.4,y,z+dz);this.box(.2,.13,1.3,0xc3c0a9,side*3.37,y-.75,z);}
   this.box(2.3,.14,2.3,0x665439,-2, .78,5);for(const x of [-2.9,-1.1])for(const z of [4.1,5.9])this.box(.11,.8,.11,0x514734,x,.4,z);this.label('RELEASE ORDER',-2,.87,5,1.1).rotation.x=-Math.PI/2;
   this.wagonObject=this.wagon(9,10);this.lantern(-2,2.7,-5);this.lantern(6,2.6,8);
   this.actor('WARD',0,2,Math.PI);this.actor('ROWAN',-.8,4,0);this.actor('MARA',7,9,Math.PI*.75);this.actor('THOMAS',1.7,-3,Math.PI);this.actor('ISAIAH',10,8,Math.PI*.75);
   const sentry=this.soldier(true);sentry.position.set(-3.2,0,-6);sentry.rotation.y=Math.PI;this.extras.push(sentry);
  }else if(level==='night'){
   this.actor('WARD',-1,15,0);this.actor('ROWAN',1,15,0);this.wagonObject=null;
   // Required interaction points are outside building collision, facing the route.
   this.box(1.2,2.3,.15,0x3d493d,-8,1.16,-23);this.lantern(-7,2.6,-21);this.label('NORTH FARM',-8,3,-22.7,2);
   this.box(.18,3.2,.18,0x665b42,9,1.6,-62);this.box(1.5,.14,.18,0x665b42,9,3.2,-62);this.bell=this.mesh(new T.CylinderGeometry(.18,.42,.55,16,1,true),this.mat(0xb29a63,{metalness:.6,roughness:.4}),9,2.6,-62);this.cyl(.014,1.7,0xab9e78,9,1.6,-61.8);this.lantern(10,2.4,-60);this.label('MEETING HOUSE',14,3,-53.8,3.8);
   this.label('LEXINGTON',-3,2,-116,2.5);this.box(.13,2.4,.13,0x6e644b,-3,1.2,-116.1);
  }else if(level==='lexington'){
   this.wagonObject=this.wagon(14,17);this.actor('MARA',12.2,16,Math.PI);this.actor('WARD',1,12,0);this.actor('ROWAN',0,15,0);
   this.casualties=[this.soldier(),this.soldier()];this.casualties[0].position.set(-7,.05,-4);this.casualties[1].position.set(-13,.05,-16);this.casualties.forEach(a=>a.rotation.z=1.35);
   for(let i=0;i<7;i++){const a=this.soldier(true);a.position.set(-7+i*2.2,0,-23);a.rotation.y=Math.PI;this.extras.push(a);}for(let i=0;i<5;i++){const a=this.soldier();a.position.set(-8+i*2.6,0,-12);this.extras.push(a);}
   this.flag(-3,-20,0xa6afa1);this.label('LEXINGTON',4,3.5,-21.8,3);
  }else if(level==='concord'){
   this.wagonObject=this.wagon(-14,-8);this.actor('WARD',-5,6,0);this.actor('MARA',-16,-8,-Math.PI/2);this.actor('ROWAN',3,15,0);
   this.box(1.3,.8,.7,0x6c5c40,2,.4,9);this.groundGun=this.box(.07,.06,1.65,0x57452e,2,.86,9);
   this.flag(-10,3,0xb0b49b);for(let i=0;i<7;i++){const a=this.soldier();a.position.set(-10-i*1.5,0,8+i%2);a.rotation.y=.15;this.extras.push(a);}
  }else{
   this.wagonObject=this.wagon(5,2);this.actor('WARD',0,1,Math.PI*.7);this.actor('ROWAN',-1,3,0);this.actor('MARA',2,2,Math.PI*.8);this.actor('ISAIAH',3,0,Math.PI*.9);
   for(let i=0;i<8;i++){const a=this.soldier();a.position.set(-9+Math.sin(i)*2,0,-12-i*3);a.rotation.y=Math.PI;this.extras.push(a);}
   this.lantern(1,.5,1);this.box(.5,.6,.5,0x654e38,0,.3,3);
  }
  this.weapon=new T.Group();this.camera.add(this.weapon);this.scene.add(this.camera);this.box(.063,.075,1.1,0x70553b,.23,-.29,-.7,this.weapon);const barrel=this.cyl(.022,1.38,this.mat(0x798583,{metalness:.6,roughness:.4}),.23,-.235,-.85,this.weapon);barrel.rotation.x=Math.PI/2;this.box(.09,.14,.35,0x4c3c2a,.23,-.32,-.22,this.weapon);this.sphere(.055,0xc2a183,.18,-.32,-.58,this.weapon,[.8,1.1,1]);this.sphere(.05,0xc2a183,.25,-.36,-.29,this.weapon);const sleeve=this.cyl(.075,.43,0x345958,.15,-.47,-.42,this.weapon);sleeve.rotation.x=-.7;this.box(.04,.055,.035,0x9c987d,.265,-.205,-.37,this.weapon);
  this.flash=this.mesh(new T.ConeGeometry(.10,.7,7),new T.MeshBasicMaterial({color:0xffd28a}),.23,-.22,-1.6,this.weapon);this.flash.rotation.x=-Math.PI/2;this.flash.visible=false;
  this.marker=this.mesh(new T.RingGeometry(.34,.41,40),new T.MeshBasicMaterial({color:0xe9cf99,transparent:true,opacity:.75,side:T.DoubleSide,depthWrite:false}),0,.07,0);this.marker.rotation.x=-Math.PI/2;
  // Haze uses a bounded pool, never an ever-growing collection of particles.
  this.mist=[];for(let i=0;i<12;i++){const sprite=new T.Sprite(new T.SpriteMaterial({map:this.smokeTexture,color:0xc3d5d4,opacity:this.night?.22:.3,depthWrite:false}));sprite.position.set((rand(i+82)-.5)*40,.6+rand(i+80),-i*9);sprite.scale.set(18,4,1);this.scene.add(sprite);this.mist.push(sprite);}
 }
 flag(x,z,color){this.cyl(.045,4,0x544a36,x,2,z);const cloth=this.mesh(new T.PlaneGeometry(1.9,1.1,8,4),this.mat(color,{side:T.DoubleSide}),x+.93,3.3,z);this.moving.push(cloth);}
 smoke(x,z,scale=1){if(this.effects.length>18){const old=this.effects.shift();this.scene.remove(old.object);old.object.material.dispose();}const sprite=new T.Sprite(new T.SpriteMaterial({map:this.smokeTexture,color:0xddd6c2,opacity:.7,depthWrite:false}));sprite.position.set(x,1.35,z);sprite.scale.set(2*scale,1.8*scale,1);this.scene.add(sprite);this.effects.push({object:sprite,life:0,scale});}
 animate(dt,t){
  this.effects=this.effects.filter(e=>{e.life+=dt;e.object.position.y+=dt*.24;e.object.position.x+=dt*.38;e.object.scale.setScalar((2+e.life*1.7)*e.scale);e.object.material.opacity=Math.max(0,.62-e.life*.11);if(e.life>5.7){this.scene.remove(e.object);e.object.material.dispose();return false;}return true;});
  this.mist.forEach((m,i)=>{m.position.x=Math.sin(t*.035+i*1.5)*22;});
  if(this.bell)this.bell.rotation.z=this.bellUntil>t?Math.sin(t*16)*.4:0;
 }
 setActor(key,x,z,yaw,pose='listen',time=0,speaking=false){const a=this.cast[key];if(!a)return;a.visible=true;a.position.set(x,0,z);a.rotation.y=yaw;poseActor(a,{time,pose,speaking,voiceTime:time,mood:key==='WARD'?'sad':'steady'});return a;}
 render(s,input,dt,{reduced=false,voice=null}={}){
  this.load(s.level);const p=s.player,t=s.time;this.clock=t;this.animate(dt,t);
  Object.values(this.cast).forEach(a=>a.visible=false);const moving=input.forward||input.back||input.left||input.right;
  if(s.level==='release'){
   this.setActor('WARD',s.carrying?s.ward.x:0,s.carrying?s.ward.z:2,s.carrying?p.yaw:Math.PI,s.carrying&&moving?'walk':'listen',t,voice==='WARD');
   this.setActor('MARA',7,9,Math.PI*.75,'listen',t,voice==='MARA');this.setActor('ISAIAH',10,8,Math.PI*.75,'listen',t,voice==='ISAIAH');this.setActor('THOMAS',1.7,-3,Math.PI,'paper',t,voice==='THOMAS');this.door.rotation.y=-1.3;
  }else if(s.level==='night')this.setActor('WARD',p.x+1.4,p.z+2.4,p.yaw,moving?'walk':'listen',t,voice==='WARD');
  else if(s.level==='lexington'){
   this.setActor('MARA',12.2,16,Math.PI,'listen',t,voice==='MARA');this.setActor('WARD',1,12,0,'brace',t,voice==='WARD');this.casualties[0].visible=s.stage<1;this.casualties[1].visible=s.stage<3;
   this.extras.forEach((a,i)=>{if(i>=7){a.position.x=-8+(i-7)*2.6+Math.sin(t*.9+i)*.4;a.rotation.z=.25;}a.userData.flash.visible=i<7&&Math.sin(t*1.2+i*2)> .985;});
  }else if(s.level==='concord'){
   const prog=Math.min(1,s.defense/52);this.wagonObject.position.x=mix(-14,18,prog);this.setActor('MARA',this.wagonObject.position.x-1.8,-8,-Math.PI/2,s.stage===1?'walk':'listen',t,voice==='MARA');this.setActor('WARD',-5,6,0,'brace',t,voice==='WARD');this.groundGun.visible=!s.armed;
   this.extras.forEach((a,i)=>{a.userData.flash.visible=s.stage===1&&Math.sin(t*1.9+i)> .99;});
  }
  while(this.enemies.length<s.enemies.length)this.enemies.push(this.soldier(true));
  this.enemies.forEach((a,i)=>{const e=s.enemies[i];if(!e){a.visible=false;return;}a.visible=e.hp>0||e.dead<15;a.position.set(e.x,e.hp<=0?.08:0,e.z);a.rotation.set(0,e.yaw,e.hp<=0?Math.min(1.5,e.dead*4):0);a.userData.legs.forEach((leg,j)=>leg.rotation.x=e.moving?Math.sin(t*8+j*Math.PI)*.4:0);a.userData.flash.visible=e.fired>0;if(e.patrol&&!a.userData.lantern){const l=this.lantern(0,0,0,false);a.add(l);l.position.set(-.35,1.3,-.2);a.userData.lantern=l;}});
  this.camera.position.set(p.x,p.y+(input.crouch?1.02:1.7)+(moving&&!reduced?Math.sin(t*(input.sprint?12:8))*.025:0),p.z);this.camera.rotation.set(-p.pitch,p.yaw,!reduced&&s.shot>0?s.shot*.035:0);
  this.camera.fov=mix(this.camera.fov,input.aim&&s.armed?48:input.sprint&&moving?78:70,Math.min(1,dt*10));this.camera.updateProjectionMatrix();
  this.weapon.visible=s.armed;this.weapon.position.set(input.aim?-.19:0,s.reload>0?-.22*Math.sin(s.reload/4.2*Math.PI):0,s.shot*.18);this.weapon.rotation.z=s.reload>0?-.6*Math.sin(s.reload/4.2*Math.PI):0;this.flash.visible=s.shot>.2;
  const goal=currentGoal(s);this.marker.visible=!!goal&&!(s.level==='concord'&&s.stage===1);if(goal)this.marker.position.set(goal.x,.065,goal.z);
  const g=goal?V(goal.x,1.35,goal.z).project(this.camera):V(0,0,0);this.goalScreen={x:g.x,y:g.y,behind:g.z>1,near:goal?Math.hypot(goal.x-p.x,goal.z-p.z)<3:false};this.renderer.render(this.scene,this.camera);
 }
 film(key,beat,time,dt,{speaking=false,reduced=false}={}){
  const level=key==='release'||key==='gate'?'release':key==='nightIntro'?'night':key==='lexington'?'lexington':key==='concordIntro'?'concord':'end';this.load(level);this.animate(dt,time+beat*10);this.weapon.visible=false;this.marker.visible=false;Object.values(this.cast).forEach(a=>a.visible=false);let from,to;
  const p=smooth(Math.min(time/7,1)),drift=reduced?0:time*.018;
  if(key==='release'){
   this.door.rotation.y=-smooth((beat+time*.12)/2)*1.3;
   this.setActor('THOMAS',1.7,-3,Math.PI,beat===0?'read':'listen',time,speaking&&beat===0);
   this.setActor('WARD',0,beat<2?mix(-5,2,smooth((beat+time*.10)/2)):2,Math.PI,beat<2?'walk':'listen',time,speaking&&(beat===2||beat===4));
   this.setActor('ROWAN',-.8,4,0,beat===3?'reach':'listen',time,speaking&&(beat===1||beat===3));
   const shots=[[[2.9,2.05,1.8],[1.3,1.4,-3]],[[2,1.75,6],[0,1.4,-1]],[[1.05,1.68,3.9],[0,1.52,2]],[[1,1.8,.8],[-.8,1.6,4]],[[.8,1.67,4.4],[0,1.5,2]]];[from,to]=shots[Math.min(beat,4)];
  }else if(key==='gate'){
   this.setActor('WARD',6.7,9.4,Math.PI*.9,'listen',time,speaking&&(beat===1||beat===6));const mara=this.setActor('MARA',6.25,10.15,.05,beat===0?'work':'listen',time,speaking&&beat===0);
   this.setActor('ISAIAH',10,8,Math.PI*.85,'listen',time,speaking&&beat===2);this.setActor('ROWAN',4,7,-Math.PI*.6,'listen',time,speaking&&beat===4);this.setActor('THOMAS',1.5,3,Math.PI*.9,'paper',time,speaking&&(beat===3||beat===5));this.door.rotation.y=-1.3;
   const shots=[[[7.8,1.2,11.5],[6.55,1,9.7]],[[7.7,1.6,11.3],[6.7,1.53,9.4]],[[8,1.8,11],[10,1.5,8]],[[3,1.7,6],[1.5,1.55,3]],[[2,1.65,5],[4,1.55,7]],[[3,1.7,6],[1.5,1.55,3]],[[11,3.1,15],[5.8,1.3,8]]];[from,to]=shots[Math.min(beat,6)];
  }else if(key==='nightIntro'){
   this.setActor('WARD',-1,15,Math.PI*.85,'listen',time,speaking&&beat%2===0);this.setActor('ROWAN',1,16,-.35,'listen',time,speaking&&beat%2===1);
   const shots=[[[5,4,23],[0,1.4,9]],[[0,1.7,13],[1,1.5,16]],[[1.2,1.7,17],[-1,1.5,15]],[[2,2.4,20],[0,1,-15]]];[from,to]=shots[Math.min(beat,3)];
  }else if(key==='lexington'){
   this.setActor('MARA',2,14,-.2,beat>=2?'brace':'listen',time,speaking&&(beat===0||beat===4));this.setActor('WARD',1,12,.1,beat>=2?'brace':'listen',time,speaking&&(beat===1||beat===3));this.setActor('ROWAN',0,15,.0,beat>=2?'kneel':'listen',time,speaking&&beat===2);
   this.casualties.forEach(a=>a.visible=beat>=2);this.extras.forEach((a,i)=>{a.userData.flash.visible=beat>=3&&i<7&&Math.sin(time*7+i*4)>.93;if(i>=7)a.rotation.z=beat>=3?.2:0;});
   const shots=[[[7,3,19],[1,1.2,-9]],[[3,1.8,15],[1,1.5,12]],[[2,.8,17],[-1,.7,8]],[[2,1.2,15],[1,1,12]],[[4,2,9],[-7,.6,-4]]];[from,to]=shots[Math.min(beat,4)];
  }else if(key==='concordIntro'){
   this.setActor('WARD',-1,9,.25,'point',time,speaking&&beat!==1);this.setActor('MARA',-3,9,Math.PI*.5,'listen',time,speaking&&beat===1);this.setActor('ROWAN',1,11,-.2,'listen',time);
   const shots=[[[8,4,17],[0,1,-12]],[[.3,1.8,11],[-3,1.5,9]],[[3,1.5,12],[0,1,9]]];[from,to]=shots[Math.min(beat,2)];
  }else{
   this.setActor('WARD',0,1,Math.PI*.7,'listen',time,speaking&&(beat===1||beat===4));this.setActor('ROWAN',-1,3,-.2,'listen',time,speaking&&(beat===0||beat===3));this.setActor('MARA',2,2,Math.PI*.8,'listen',time,speaking&&beat===2);this.setActor('ISAIAH',3,0,Math.PI*.9,'listen',time,speaking&&beat===5);
   const shots=[[[1,1.7,.9],[-1,1.5,3]],[[2,1.7,3],[0,1.5,1]],[[3,1.8,4],[2,1.5,2]],[[1,1.7,1],[-1,1.5,3]],[[2,1.8,3],[0,1.5,1]],[[9,4,10],[1,1.2,1]]];[from,to]=shots[Math.min(beat,5)];
  }
  this.camera.fov=(key==='gate'&&beat===0?43:beat===0?52:44)+(this.camera.aspect<1.2?12:0);this.camera.position.set(from[0]+drift,from[1],from[2]-.12*p);this.camera.lookAt(...to);this.camera.updateProjectionMatrix();this.renderer.render(this.scene,this.camera);
 }
 menu(t,dt){this.load('night');this.animate(dt,t);Object.values(this.cast).forEach(a=>a.visible=false);this.weapon.visible=false;this.marker.visible=false;this.camera.position.set(6+Math.sin(t*.035)*.5,2.3,0);this.camera.lookAt(-3,1.6,-45);this.camera.fov=57;this.camera.updateProjectionMatrix();this.renderer.render(this.scene,this.camera);}
}



